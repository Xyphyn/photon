<script lang="ts">
  // TODO make community form use
  import { goto } from '$app/navigation'
  import { client, site } from '$lib/api/client.svelte'
  import type { CommunityVisibility } from '$lib/api/types'
  import { profile } from '$lib/app/auth'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import MarkdownEditor from '$lib/app/markdown/MarkdownEditor.svelte'
  import { communityLink } from '$lib/app/util.svelte'
  import { uploadStrategy } from '$lib/ui/form/files/file-upload.svelte'
  import FileUpload from '$lib/ui/form/files/FileUpload.svelte'
  import FreeTextInput from '$lib/ui/form/FreeTextInput.svelte'
  import Avatar from '$lib/ui/generic/Avatar.svelte'
  import { Header } from '$lib/ui/layout'
  import {
    Badge,
    Button,
    Label,
    Material,
    Menu,
    MenuButton,
    Option,
    Select,
    Switch,
    TextInput,
    toast,
  } from 'mono-svelte'
  import { DocumentPlus, GlobeAlt, Icon, MapPin, Plus } from 'svelte-hero-icons/dist'

  interface Props {
    /**
     * The community ID to edit.
     */
    edit?: number
    formData?: {
      name: string
      displayName: string
      icon?: string
      banner?: string
      sidebar?: string
      nsfw: boolean
      postsLockedToModerators: boolean
      submitting: boolean
      visibility: CommunityVisibility
      languages?: number[]
    }
    formtitle?: import('svelte').Snippet
  }

  let {
    edit = undefined,
    formData: passedFormData = $bindable({
      name: '',
      displayName: '',
      sidebar: '',
      nsfw: false,
      postsLockedToModerators: false,
      submitting: false,
      visibility: 'public',
      languages: undefined,
    }),
    formtitle,
  }: Props = $props()

  let form = $state(passedFormData)

  async function submit() {
    if (!profile.current?.jwt) return
    if ((!edit && form.name == '') || form.displayName == '') return

    form.submitting = true

    try {
      const res = edit
        ? await client().editCommunity({
            title: form.displayName,
            summary: form.sidebar,
            nsfw: form.nsfw,
            posting_restricted_to_mods: form.postsLockedToModerators,
            community_id: edit,
            visibility: form.visibility,
            discussion_languages: form.languages,
          })
        : await client().createCommunity({
            name: form.name,
            title: form.displayName,
            summary: form.sidebar,
            nsfw: form.nsfw,
            posting_restricted_to_mods: form.postsLockedToModerators,
            visibility: form.visibility,
            discussion_languages: form.languages,
          })

      toast({
        content: $t('toast.updatedCommunity'),
        type: 'success',
      })

      if (profile.current.user) {
        const c = profile.current.user.moderates
          .map((m) => m.community.id)
          .indexOf(res.community_view.community.id)
        if (c != -1) {
          profile.current.user.moderates[c] = {
            community: res.community_view.community,
            moderator: profile.current.user.local_user_view.person,
          }
        } else {
          profile.current.user = {
            ...profile.current.user,
            moderates: [
              ...profile.current.user.moderates,
              {
                community: res.community_view.community,
                moderator: profile.current.user.local_user_view.person,
              },
            ],
          }
        }
      }

      if (!edit) goto(communityLink(res.community_view.community))
    } catch (err) {
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })
    }

    form.submitting = false
  }
</script>

<form
  onsubmit={(e) => {
    e.preventDefault()
    submit()
  }}
  class="flex flex-col gap-4 h-full w-full"
>
  {#if formtitle}{@render formtitle()}{:else}
    <Header>{$t('form.post.community')}</Header>
  {/if}

  <Material color="uniform" padding="xl" rounding="3xl" class="space-y-4">
    <div class="relative overflow-hidden rounded-t-[inherit] -m-6 mask-b-from-0 h-32 @lg:h-48 z-0">
      <FileUpload
        upload={edit
          ? (file: File) => client().uploadCommunityBanner({ id: edit }, { image: file })
          : uploadStrategy.default}
        preview={form.banner}
        onupload={(res) => (form.banner = res)}
        remove={edit ? () => client().deleteCommunityBanner({ id: edit }) : async () => {}}
        onremove={() => (form.banner = undefined)}
      >
        {#snippet target(toggle)}
          <button
            onclick={toggle}
            type="button"
            class="cursor-pointer h-full btn-secondary border-none! w-full"
          >
            {#if form.banner}
              <img
                src={form.banner}
                class="w-full object-cover h-full bg-white dark:bg-zinc-900 pointer-events-none z-0"
                height="192"
                alt="User banner"
              />
            {/if}
            <div class="grid place-items-center z-10 absolute inset-0">
              <Icon src={DocumentPlus} size="32" solid />
            </div>
          </button>
        {/snippet}
      </FileUpload>
    </div>
    <div class="relative w-max -mt-8 dark">
      <Button
        class="absolute -bottom-2 -right-2 z-10 pointer-events-none"
        rounding="pill"
        size="square-lg"
        elevation="medium"
      >
        <Icon src={DocumentPlus} size="24" solid class="text-zinc-400" />
      </Button>
      <FileUpload
        upload={edit
          ? (file: File) => client().uploadCommunityIcon({ id: edit }, { image: file })
          : uploadStrategy.default}
        preview={form.icon}
        onupload={(res) => (form.icon = res)}
        remove={edit ? () => client().deleteCommunityIcon({ id: edit }) : async () => {}}
        onremove={() => (form.icon = undefined)}
      >
        {#snippet target(toggle)}
          <button onclick={toggle} type="button" class="cursor-pointer">
            <Avatar
              width={72}
              url={form.icon}
              alt={form.name}
              circle={false}
              class={['relative hover:brightness-90 rounded-3xl!']}
            />
          </button>
        {/snippet}
      </FileUpload>
    </div>
    <h2 class={['text-2xl flex flex-row']}>
      <FreeTextInput
        required
        bind:value={form.displayName}
        class="w-max tracking-tight font-medium"
        minlength={3}
        onchange={() => {
          form.displayName = form.displayName?.replace('\n', '')
        }}
        placeholder="Community"
        label={$t('form.profile.displayName')}
      />
    </h2>
    <TextInput
      required
      bind:value={form.name}
      class="w-max"
      minlength={3}
      oninput={() => {
        form.name = form.name?.replace('\n', '').replace(' ', '_').toLowerCase()
      }}
      placeholder={$t('form.name')}
      label={$t('form.name')}
    >
      {#snippet prefix()}
        !
      {/snippet}
      {#snippet suffix()}
        <div class="pr-2">
          @{profile.current.instance}
        </div>
      {/snippet}
    </TextInput>

    <MarkdownEditor
      images={false}
      bind:value={form.sidebar}
      label={$t('form.profile.bio')}
      previewButton
    />
  </Material>

  <Switch bind:checked={form.nsfw}>{$t('post.badges.nsfw')}</Switch>
  <Switch bind:checked={form.postsLockedToModerators}>Only moderators can post</Switch>
  <Select label="Visibility" class="w-max" bind:value={form.visibility}>
    <Option icon={GlobeAlt} value="public">Public</Option>
    <Option icon={MapPin} value="local_only">Local Only</Option>
  </Select>

  <div class="space-y-1">
    <Label>{$t('form.profile.languages.title')}</Label>
    <Material rounding="xl" color="uniform" class="dark:bg-zinc-950">
      {#if site.data}
        <div class="flex gap-2 flex-wrap flex-row">
          <Menu class="gap-px">
            {#snippet target(attachment)}
              <button {@attach attachment} type="button">
                <Badge color="blue-subtle">
                  <Icon src={Plus} micro size="14" />
                  {$t('common.add')}
                </Badge>
              </button>
            {/snippet}
            {#each site.data.all_languages.filter((l) => !form.languages?.includes(l.id)) as language (language.id)}
              <MenuButton
                class="min-h-4 py-0"
                onclick={() => {
                  form.languages = [...(form.languages ?? []), language.id]
                }}
              >
                {language.name}
              </MenuButton>
            {/each}
          </Menu>
          {#each form.languages ?? [] as languageId, index (languageId)}
            {@const language = site.data.all_languages.find((l) => l.id == languageId)}
            <button
              type="button"
              class="hover:brightness-150 transition-all"
              onclick={() => {
                form.languages?.splice(index, 1)
              }}
            >
              <Badge class="cursor-pointer">{language?.name}</Badge>
            </button>
          {/each}
        </div>
      {/if}
    </Material>
  </div>

  <Button
    submit
    color="primary"
    size="lg"
    class="mt-auto"
    loading={form.submitting}
    disabled={form.submitting}
  >
    {edit ? $t('common.save') : $t('form.submit')}
  </Button>
</form>
