<script lang="ts">
  import { profile } from '$lib/auth.svelte.js'
  import ImageInputUpload from '$lib/components/form/ImageInputUpload.svelte'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { getClient, site } from '$lib/lemmy.svelte.js'
  import { errorMessage } from '$lib/lemmy/error.js'
  import type { EditSite } from 'lemmy-js-client'
  import {
    Badge,
    Button,
    Material,
    Menu,
    MenuButton,
    Select,
    Switch,
    TextInput,
    toast,
  } from 'mono-svelte'
  import Option from 'mono-svelte/forms/select/Option.svelte'
  import { Icon, Plus } from 'svelte-hero-icons'
  import type { PageData } from './$types.js'

  interface Props {
    data: PageData
  }

  let { data: pageData }: Props = $props()
  let data = $state(pageData)

  const formData: Omit<EditSite, 'auth'> | undefined = $state(
    data.site
      ? {
          ...data.site.site_view.local_site,
          ...data.site.site_view.site,
          discussion_languages: data.site.discussion_languages,
        }
      : undefined,
  )

  async function save() {
    if (!profile.current?.jwt) return

    saving = true

    try {
      await getClient().editSite({
        ...formData,
      })
      toast({
        content: $t('toast.updatedSite'),
        type: 'success',
      })
    } catch (err) {
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })
    }

    saving = false
  }

  let saving = $state(false)
</script>

<svelte:head>
  <title>{$t('routes.admin.title')}</title>
</svelte:head>

<form
  class="flex flex-col gap-4"
  onsubmit={e => {
    e.preventDefault()
    save()
  }}
>
  <Header pageHeader>{$t('routes.admin.config.title')}</Header>
  {#if formData}
    <TextInput
      bind:value={() => formData.name ?? '', v => (formData.description = v)}
      label={$t('form.name')}
    />
    <TextInput
      bind:value={
        () => formData.description ?? '', v => (formData.description = v)
      }
      label={$t('form.description')}
    />
    <MarkdownEditor
      previewButton
      bind:value={() => formData.sidebar ?? '', v => (formData.sidebar = v)}
      label={$t('routes.admin.config.sidebar')}
    />
    <MarkdownEditor
      previewButton
      bind:value={
        () => formData.legal_information ?? '',
        v => (formData.legal_information = v)
      }
      label={$t('routes.legal.title')}
    />
    <ImageInputUpload
      label={$t('routes.admin.config.icon')}
      bind:imageUrl={formData.icon}
    />
    <ImageInputUpload
      label={$t('routes.admin.config.banner')}
      bind:imageUrl={formData.banner}
    />
    <Switch bind:checked={formData.enable_downvotes}>
      {$t('routes.admin.config.downvotesEnabled')}
    </Switch>
    <Switch bind:checked={formData.enable_nsfw}>
      {$t('routes.admin.config.nsfwEnabled')}
    </Switch>
    <Select
      label={$t('routes.admin.config.registration.label')}
      bind:value={formData.registration_mode}
      class="w-max"
    >
      <Option value="Open">
        {$t('routes.admin.config.registration.open')}
      </Option>
      <Option value="RequireApplication">
        {$t('routes.admin.config.registration.application')}
      </Option>
      <Option value="Closed">
        {$t('routes.admin.config.registration.closed')}
      </Option>
    </Select>
    {#if formData.registration_mode == 'RequireApplication'}
      <MarkdownEditor
        previewButton
        label={$t('routes.admin.config.applicationQuestion')}
        bind:value={formData.application_question}
      />
    {/if}
    <Switch bind:checked={formData.community_creation_admin_only}>
      {$t('routes.admin.config.adminCommunityOnly')}
    </Switch>
    <Switch bind:checked={formData.require_email_verification}>
      {$t('routes.admin.config.requireVerifyEmail')}
    </Switch>
    <Switch bind:checked={formData.application_email_admins}>
      {$t('routes.admin.config.emailAdminsOnApplication')}
    </Switch>
    <Switch bind:checked={formData.reports_email_admins}>
      {$t('routes.admin.config.emailAdminsOnReport')}
    </Switch>
    <Select
      label={$t('routes.admin.config.listingType.label')}
      bind:value={formData.default_post_listing_type}
      class="w-max"
    >
      <Option value="All">{$t('routes.admin.config.listingType.all')}</Option>
      <Option value="Local">
        {$t('routes.admin.config.listingType.local')}
      </Option>
    </Select>
    <Switch bind:checked={formData.private_instance}>
      {$t('routes.admin.config.private')}
    </Switch>
    <Switch bind:checked={formData.hide_modlog_mod_names}>
      {$t('routes.admin.config.hideModlogModNames')}
    </Switch>
    <TextInput
      bind:value={formData.slur_filter_regex}
      label={$t('routes.admin.config.slurFilter')}
      placeholder="(word1|word2)"
    />
    <Switch bind:checked={formData.federation_enabled}>
      {$t('routes.admin.config.federation')}
    </Switch>
    <Switch bind:checked={formData.federation_debug}>
      {$t('routes.admin.config.federationDebug')}
    </Switch>
    <Switch bind:checked={formData.captcha_enabled}>
      {$t('routes.admin.config.captcha.enabled')}
    </Switch>

    <div class="space-y-1">
      <SectionTitle>{$t('form.profile.languages.title')}</SectionTitle>
      <p>{$t('form.profile.languages.description')}</p>
      <Material rounding="xl" color="uniform" class="dark:bg-zinc-950">
        {#if site.data}
          <div class="flex gap-2 flex-wrap flex-row">
            <Menu class="gap-px">
              {#snippet target()}
                <button type="button">
                  <Badge color="blue-subtle">
                    <Icon src={Plus} micro size="14" />
                    {$t('common.add')}
                  </Badge>
                </button>
              {/snippet}
              {#each site.data.all_languages.filter(l => !formData.discussion_languages?.includes(l.id)) as language (language.id)}
                <MenuButton
                  class="min-h-[16px] py-0"
                  onclick={() => {
                    formData.discussion_languages?.push(language.id)
                  }}
                >
                  {language.name}
                </MenuButton>
              {/each}
            </Menu>
            {#each formData.discussion_languages ?? [] as languageId, index (languageId)}
              {@const language = site.data.all_languages.find(
                l => l.id == languageId,
              )}
              <button
                type="button"
                class="hover:brightness-150 transition-all"
                onclick={() => {
                  formData.discussion_languages?.splice(index, 1)
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
  <Button color="primary" size="lg" loading={saving} disabled={saving} submit>
    {$t('common.save')}
  </Button>
</form>
