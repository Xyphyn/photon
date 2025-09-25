<script lang="ts">
  import { goto } from '$app/navigation'
  import { profile } from '$lib/app/auth.svelte.js'
  import ImageInputUpload from '$comp/form/ImageInputUpload.svelte'
  import MarkdownEditor from '$lib/app/markdown/MarkdownEditor.svelte'
  import { t } from '$lib/app/i18n'
  import { client, site } from '$lib/api/client.svelte'
  import { errorMessage } from '$lib/lemmy/error'
  import { addSubscription } from '$lib/lemmy/user.js'
  import {
    Badge,
    Button,
    Label,
    MenuButton,
    Switch,
    TextInput,
    toast,
    Option,
    Select,
    Material,
    Menu,
  } from 'mono-svelte'
  import { GlobeAlt, Icon, MapPin, Plus } from 'svelte-hero-icons'
  import { Header } from '$comp/ui/layout'

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
      visibility: 'Public' | 'LocalOnly'
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
      visibility: 'Public',
      languages: undefined,
    }),
    formtitle,
  }: Props = $props()

  let formData = $state(passedFormData)

  async function submit() {
    if (!profile.current?.jwt) return
    if ((!edit && formData.name == '') || formData.displayName == '') return

    formData.submitting = true

    try {
      const res = edit
        ? await client().editCommunity({
            title: formData.displayName,
            description: formData.sidebar,
            nsfw: formData.nsfw,
            posting_restricted_to_mods: formData.postsLockedToModerators,
            icon: formData.icon,
            banner: formData.banner,
            community_id: edit,
            visibility: formData.visibility,
            discussion_languages: formData.languages,
          })
        : await client().createCommunity({
            name: formData.name,
            title: formData.displayName,
            description: formData.sidebar,
            nsfw: formData.nsfw,
            posting_restricted_to_mods: formData.postsLockedToModerators,
            icon: formData.icon,
            banner: formData.banner,
            visibility: formData.visibility,
            discussion_languages: formData.languages,
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

        addSubscription(res.community_view.community, true)
      }

      if (!edit)
        goto(
          `/c/${res.community_view.community.name}@${
            new URL(res.community_view.community.actor_id).hostname
          }`,
        )
    } catch (err) {
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })
    }

    formData.submitting = false
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
  <TextInput
    required
    label={$t('form.name')}
    bind:value={formData.name}
    oninput={() => {
      formData.name = formData.name.toLowerCase().replaceAll(' ', '_')
    }}
    disabled={edit != undefined}
  />
  <TextInput
    required
    label={$t('form.profile.displayName')}
    bind:value={formData.displayName}
  />
  <div class="flex flex-row gap-4 flex-wrap *:flex-1">
    <ImageInputUpload
      bind:imageUrl={formData.icon}
      label={$t('routes.admin.config.icon')}
    />
    <ImageInputUpload
      bind:imageUrl={formData.banner}
      label={$t('routes.admin.config.banner')}
    />
  </div>
  <MarkdownEditor
    previewButton
    label={$t('routes.admin.config.sidebar')}
    bind:value={formData.sidebar}
  />

  <Switch bind:checked={formData.nsfw}>{$t('post.badges.nsfw')}</Switch>
  <Switch bind:checked={formData.postsLockedToModerators}>
    Only moderators can post
  </Switch>
  <Select label="Visibility" class="w-max" bind:value={formData.visibility}>
    <Option icon={GlobeAlt} value="Public">Public</Option>
    <Option icon={MapPin} value="LocalOnly">Local Only</Option>
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
            {#each site.data.all_languages.filter((l) => !formData.languages?.includes(l.id)) as language (language.id)}
              <MenuButton
                class="min-h-[16px] py-0"
                onclick={() => {
                  formData.languages = [
                    ...(formData.languages ?? []),
                    language.id,
                  ]
                }}
              >
                {language.name}
              </MenuButton>
            {/each}
          </Menu>
          {#each formData.languages ?? [] as languageId, index (languageId)}
            {@const language = site.data.all_languages.find(
              (l) => l.id == languageId,
            )}
            <button
              type="button"
              class="hover:brightness-150 transition-all"
              onclick={() => {
                formData.languages?.splice(index, 1)
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
    loading={formData.submitting}
    disabled={formData.submitting}
  >
    {edit ? $t('common.save') : $t('form.submit')}
  </Button>
</form>
