<script lang="ts">
  import { client, site } from '$lib/api/client.svelte'
  import { t } from '$lib/app/i18n'
  import MarkdownEditor from '$lib/app/markdown/MarkdownEditor.svelte'
  import { loader } from '$lib/app/util.svelte'
  import { proxify } from '$lib/app/util/reactivity.svelte'
  import { uploadStrategy } from '$lib/ui/form/files/file-upload.svelte'
  import FileUpload from '$lib/ui/form/files/FileUpload.svelte'
  import MultiSelect from '$lib/ui/form/Switch.svelte'
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
  import { DocumentPlus, Icon, Plus } from 'svelte-hero-icons/dist'

  let { data } = $props()

  let form = $derived(
    proxify({
      ...data.site.site_view.local_site,
      ...data.site.site_view.site,
      discussion_languages: data.site.discussion_languages,
    }),
  )

  let loading = $state(false)

  const save = () =>
    loader(
      (v) => (loading = v),
      () => client().editSite(form!),
      () =>
        toast({
          content: $t('toast.updatedSite'),
          type: 'success',
        }),
    )
</script>

<svelte:head>
  <title>{$t('routes.admin.title')}</title>
</svelte:head>

<form
  class="flex flex-col gap-4"
  onsubmit={(e) => {
    e.preventDefault()
    save()
  }}
>
  <Header pageHeader>{$t('routes.admin.config.title')}</Header>
  {#if form}
    <TextInput bind:value={form.name} label={$t('form.name')} />
    <TextInput bind:value={form.summary} label={$t('form.description')} />
    <MarkdownEditor
      previewButton
      bind:value={form.sidebar}
      label={$t('routes.admin.config.sidebar')}
    />
    <MarkdownEditor
      previewButton
      bind:value={form.legal_information}
      label={$t('routes.legal.title')}
    />
    <div>
      <Label>{$t('routes.admin.config.icon')}</Label>
      <FileUpload
        upload={uploadStrategy.siteIcon}
        preview={form.icon}
        onupload={(res) => (form.icon = res)}
        remove={() => client().deleteSiteIcon()}
        onremove={() => (form.icon = undefined)}
      >
        {#snippet target(toggle)}
          <button
            class="flex flex-col items-center justify-center px-8 py-4 mx-auto w-full rounded-xl border border-slate-200 dark:border-zinc-800 border-dashed hover:border-slate-300 hover:dark:border-zinc-700 cursor-pointer min-h-36 transition-colors bg-white dark:bg-zinc-950 relative"
            type="button"
            onclick={toggle}
          >
            {#if form.icon}
              <img
                src={form.icon}
                alt=""
                class="rounded-md mx-auto h-full max-h-32 object-contain"
              />
            {:else}
              <Icon src={DocumentPlus} class="text-slate-400 dark:text-zinc-500" size="36" solid />
              <p class="text-slate-600 dark:text-zinc-400 font-medium">
                {$t('common.attach')}
              </p>
            {/if}
          </button>
        {/snippet}
      </FileUpload>
    </div>

    <div>
      <Label>{$t('routes.admin.config.banner')}</Label>
      <FileUpload
        upload={uploadStrategy.siteBanner}
        preview={form.banner}
        onupload={(res) => (form.banner = res)}
        remove={() => client().deleteSiteBanner()}
        onremove={() => (form.banner = undefined)}
      >
        {#snippet target(toggle)}
          <button
            class="flex flex-col items-center justify-center px-8 py-4 mx-auto w-full rounded-xl border border-slate-200 dark:border-zinc-800 border-dashed hover:border-slate-300 hover:dark:border-zinc-700 cursor-pointer min-h-36 transition-colors bg-white dark:bg-zinc-950 relative"
            type="button"
            onclick={toggle}
          >
            {#if form.banner}
              <img
                src={form.banner}
                alt=""
                class="rounded-md mx-auto h-full max-h-32 object-contain"
              />
            {:else}
              <Icon src={DocumentPlus} class="text-slate-400 dark:text-zinc-500" size="36" solid />
              <p class="text-slate-600 dark:text-zinc-400 font-medium">
                {$t('common.attach')}
              </p>
            {/if}
          </button>
        {/snippet}
      </FileUpload>
    </div>

    <Select
      label={$t('routes.admin.config.registration.label')}
      bind:value={form.registration_mode}
      class="w-max"
    >
      <Option value="open">
        {$t('routes.admin.config.registration.open')}
      </Option>
      <Option value="require_application">
        {$t('routes.admin.config.registration.application')}
      </Option>
      <Option value="require_invitation">
        {$t('routes.admin.config.registration.invitation')}
      </Option>
      <Option value="closed">
        {$t('routes.admin.config.registration.closed')}
      </Option>
    </Select>
    {#if form.registration_mode == 'require_application'}
      <MarkdownEditor
        previewButton
        label={$t('routes.admin.config.applicationQuestion')}
        bind:value={form.application_question}
      />
    {/if}

    <Switch bind:checked={form.community_creation_admin_only}>
      {$t('routes.admin.config.adminCommunityOnly')}
    </Switch>
    <Switch bind:checked={form.email_verification_required}>
      {$t('routes.admin.config.requireVerifyEmail')}
    </Switch>
    <Switch bind:checked={form.application_email_admins}>
      {$t('routes.admin.config.emailAdminsOnApplication')}
    </Switch>
    <Switch bind:checked={form.reports_email_admins}>
      {$t('routes.admin.config.emailAdminsOnReport')}
    </Switch>

    <Select
      label={$t('routes.admin.config.listingType.label')}
      bind:value={form.default_post_listing_type}
    >
      <Option value="all">{$t('routes.admin.config.listingType.all')}</Option>
      <Option value="local">
        {$t('routes.admin.config.listingType.local')}
      </Option>
    </Select>

    <Select label={$t('routes.admin.config.postSortType')} bind:value={form.default_post_sort_type}>
      <Option value="active">Active</Option>
      <Option value="hot">Hot</Option>
      <Option value="new">New</Option>
      <Option value="old">Old</Option>
      <Option value="top">Top</Option>
      <Option value="most_comments">Most Comments</Option>
      <Option value="new_comments">New Comments</Option>
      <Option value="controversial">Controversial</Option>
      <Option value="scaled">Scaled</Option>
    </Select>

    <Select
      label={$t('routes.admin.config.commentSortType')}
      bind:value={form.default_comment_sort_type}
    >
      <Option value="hot">Hot</Option>
      <Option value="top">Top</Option>
      <Option value="new">New</Option>
      <Option value="old">Old</Option>
      <Option value="controversial">Controversial</Option>
    </Select>

    <Select
      label={$t('routes.admin.config.postListingMode')}
      bind:value={form.default_post_listing_mode}
    >
      <Option value="list">List</Option>
      <Option value="card">Card</Option>
      <Option value="small_card">Small Card</Option>
    </Select>

    <div class="flex flex-col gap-2">
      <Label>{$t('routes.admin.config.votes.title')}</Label>
      <MultiSelect bind:selected={form.post_upvotes} options={['all', 'local', 'disable']}>
        {$t('routes.admin.config.votes.postUpvotes')}
      </MultiSelect>
      <MultiSelect bind:selected={form.post_downvotes} options={['all', 'local', 'disable']}>
        {$t('routes.admin.config.votes.postDownvotes')}
      </MultiSelect>
      <MultiSelect bind:selected={form.comment_upvotes} options={['all', 'local', 'disable']}>
        {$t('routes.admin.config.votes.commentUpvotes')}
      </MultiSelect>
      <MultiSelect bind:selected={form.comment_downvotes} options={['all', 'local', 'disable']}>
        {$t('routes.admin.config.votes.commentDownvotes')}
      </MultiSelect>
    </div>

    <Switch
      bind:checked={() => !form.nsfw_content_disallowed, (v) => (form.nsfw_content_disallowed = !v)}
    >
      {$t('routes.admin.config.nsfwEnabled')}
    </Switch>
    <TextInput bind:value={form.content_warning} label={$t('routes.admin.config.contentWarning')} />
    <Switch bind:checked={form.private_instance}>
      {$t('routes.admin.config.private')}
    </Switch>
    <TextInput
      bind:value={form.slur_filter_regex}
      label={$t('routes.admin.config.slurFilter')}
      placeholder="(word1|word2)"
    />
    <Switch bind:checked={form.federation_enabled}>
      {$t('routes.admin.config.federation')}
    </Switch>
    <Switch bind:checked={form.federation_signed_fetch}>
      {$t('routes.admin.config.federationSignedFetch')}
    </Switch>
    <Switch bind:checked={form.oauth_registration}>
      {$t('routes.admin.config.oauthRegistration')}
    </Switch>
    <Switch bind:checked={form.email_notifications_disabled}>
      {$t('routes.admin.config.emailNotificationsDisabled')}
    </Switch>

    <div class="space-y-1">
      <Label>{$t('form.profile.languages.title')}</Label>
      <p>{$t('form.profile.languages.description')}</p>
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
            {#each form.discussion_languages ?? [] as languageId, index (languageId)}
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
  {/if}
  <Button color="primary" size="lg" {loading} disabled={loading} submit>
    {$t('common.save')}
  </Button>
</form>
