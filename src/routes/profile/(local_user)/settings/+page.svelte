<script lang="ts">
  import { client, site } from '$lib/api/client.svelte'
  import type { SaveUserSettings } from '$lib/api/types'
  import { t } from '$lib/app/i18n'
  import MarkdownEditor from '$lib/app/markdown/MarkdownEditor.svelte'
  import { loader } from '$lib/app/util.svelte'
  import { UserModel } from '$lib/feature/user/user.svelte'
  import { uploadStrategy } from '$lib/ui/form/files/file-upload.svelte'
  import FileUpload from '$lib/ui/form/files/FileUpload.svelte'
  import FreeTextInput from '$lib/ui/form/FreeTextInput.svelte'
  import Avatar from '$lib/ui/generic/Avatar.svelte'
  import Fixate from '$lib/ui/generic/Fixate.svelte'
  import { Header } from '$lib/ui/layout'
  import {
    Badge,
    Button,
    Label,
    Material,
    Menu,
    MenuButton,
    Switch,
    TextInput,
    toast,
  } from 'mono-svelte'
  import { DocumentPlus, Icon, Plus } from 'svelte-hero-icons/dist'
  import type { PageData } from './$types'

  interface Props {
    inline?: boolean
    data: PageData
    children?: import('svelte').Snippet
  }

  let { inline = false, data, children }: Props = $props()

  let form = $state<SaveUserSettings>({
    ...data.local_user_view.local_user,
    discussion_languages: data.discussion_languages,
  })
  let person = $derived(
    new UserModel({ ...data.local_user_view, is_admin: data.local_user_view.local_user.admin }),
  )
  let loading = $state(false)

  export const save = () =>
    loader(
      (v) => (loading = v),
      () => client().saveUserSettings(form),
      () =>
        toast({
          content: $t('toast.saveSettings'),
          type: 'success',
        }),
    )
</script>

{#if !inline}
  <Header pageHeader>{$t('routes.profile.edit')}</Header>
{/if}
<form
  class="flex flex-col gap-4 h-full"
  onsubmit={(e) => {
    e.preventDefault()
    save()
  }}
>
  <Material color="uniform" padding="xl" rounding="3xl" class="space-y-4">
    <div class="relative overflow-hidden rounded-t-[inherit] -m-6 mask-b-from-0 h-48 z-0 group">
      <FileUpload
        upload={uploadStrategy.userBanner}
        preview={person.person.banner}
        onupload={(res) => (person.person.banner = res)}
        remove={() => client().deleteUserBanner()}
        onremove={() => (person.person.banner = undefined)}
      >
        {#snippet target(toggle)}
          <button
            onclick={toggle}
            type="button"
            class="cursor-pointer h-full btn-secondary border-none! w-full"
          >
            {#if person.person.banner}
              <img
                src={person.person.banner}
                class="w-full object-cover h-full bg-white dark:bg-zinc-900 pointer-events-none z-0"
                height="192"
                alt="User banner"
              />
            {/if}
            <div
              class={[
                'absolute inset-0 grid place-items-center bg-black/10 group-hover:opacity-100 transition-opacity',
                person.person.banner && 'opacity-0',
              ]}
            >
              <Icon src={DocumentPlus} size="32" solid />
            </div>
          </button>
        {/snippet}
      </FileUpload>
    </div>
    <div class="relative w-max -mt-8 group">
      <div
        class="absolute pointer-events-none z-10 inset-0 grid place-items-center bg-white/40 dark:bg-black/40 rounded-full aspect-square group-hover:opacity-100 transition-opacity"
      >
        <Icon src={DocumentPlus} size="24" solid class="text-black/80 dark:text-white/80" />
      </div>
      <FileUpload
        upload={uploadStrategy.userAvatar}
        preview={person.person.avatar}
        onupload={(res) => (person.person.avatar = res)}
        remove={() => client().deleteUserAvatar()}
        onremove={() => (person.person.avatar = undefined)}
      >
        {#snippet target(toggle)}
          <button onclick={toggle} type="button" class="cursor-pointer">
            <Avatar
              width={72}
              url={person.person.avatar}
              alt={person.person.name}
              circle
              class={['relative hover:brightness-90']}
            />
          </button>
        {/snippet}
      </FileUpload>
    </div>
    <div>
      <FreeTextInput
        required
        bind:value={() => form.display_name ?? person.person.name, (v) => (form.display_name = v)}
        class="w-max text-2xl font-medium tracking-tight"
        minlength={3}
        onchange={() => {
          form.display_name = form.display_name?.replace('\n', '')
        }}
        label={$t('form.profile.displayName')}
      />
    </div>

    <MarkdownEditor
      images={false}
      bind:value={form.bio}
      label={$t('form.profile.bio')}
      previewButton
    />
  </Material>
  {@render children?.()}
  <TextInput label={$t('form.profile.email')} bind:value={form.email} />
  <TextInput
    label={$t('form.profile.matrix')}
    bind:value={form.matrix_user_id}
    placeholder="@user:example.com"
  />
  <Switch bind:checked={form.show_nsfw}>
    {$t('form.profile.showNSFW')}
  </Switch>
  <Switch bind:checked={form.bot_account}>
    {$t('form.profile.bot')}
  </Switch>
  <Switch bind:checked={form.show_bot_accounts}>
    {$t('form.profile.showBots')}
  </Switch>
  <Switch bind:checked={form.show_read_posts}>
    {$t('form.profile.showRead')}
  </Switch>
  <div class="space-y-1">
    <Label id="languages">
      {$t('form.profile.languages.title')}
    </Label>
    <p>{$t('form.profile.languages.description')}</p>
    <Material rounding="xl" color="uniform" class="dark:bg-zinc-950">
      {#if site.data && form.discussion_languages}
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
            {#each site.data.all_languages.filter((l) => !form.discussion_languages?.includes(l.id)) as language (language.id)}
              <MenuButton
                class="min-h-4 py-0"
                onclick={() => {
                  form.discussion_languages?.push(language.id)
                }}
              >
                {language.name}
              </MenuButton>
            {/each}
          </Menu>
          {#each form.discussion_languages as languageId, index (languageId)}
            {@const language = site.data.all_languages.find((l) => l.id == languageId)}
            <button
              type="button"
              class="hover:brightness-150 transition-all"
              onclick={() => {
                form.discussion_languages?.splice(index, 1)
              }}
            >
              <Badge class="cursor-pointer">{language?.name}</Badge>
            </button>
          {/each}
        </div>
      {/if}
    </Material>
  </div>
</form>

<Fixate styling placement="bottom">
  <Button onclick={save} size="lg" color="primary" class="w-full" {loading} disabled={loading}>
    {$t('common.save')}
  </Button>
</Fixate>
