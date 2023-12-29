<script lang="ts">
  import { profile } from '$lib/auth.js'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { Label, toast } from 'mono-svelte'
  import { getClient } from '$lib/lemmy.js'
  import type { EditSite } from 'lemmy-js-client'
  import type { PageData } from './$types.js'
  import { Button, Checkbox, Select, TextInput } from 'mono-svelte'
    import ImageUploadModal from '$lib/components/lemmy/modal/ImageUploadModal.svelte';
    import { DocumentPlus, Icon } from 'svelte-hero-icons';

  export let data: PageData

  const formData: Omit<EditSite, 'auth'> | undefined = data.site
    ? {
        ...data.site.site_view.local_site,
        ...data.site.site_view.site,
      }
    : undefined

  async function save() {
    if (!$profile?.jwt) return

    saving = true
    const { jwt } = $profile

    try {
      await getClient().editSite({
        ...formData,
      })
      toast({
        content: 'Updated your site.',
        type: 'success',
      })
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    }

    saving = false
  }

  let saving = false

  let uploading = {
    icon: false,
    banner: false
  }
</script>

<svelte:head>
  <title>Administration</title>
</svelte:head>

<form class="flex flex-col gap-4" on:submit|preventDefault={save}>
  <h1 class="font-bold text-2xl">Site configuration</h1>
  {#if formData}
    <TextInput bind:value={formData.name} label="Name" />
    <TextInput bind:value={formData.description} label="Description" />
    <MarkdownEditor
      previewButton
      bind:value={formData.sidebar}
      label="Sidebar"
    />
    <MarkdownEditor
      previewButton
      bind:value={formData.legal_information}
      label="Legal"
    />
    <div class="flex flex-col gap-1">
      <Label>Icon</Label>
      <button type="button" on:click={() => uploading.icon = !uploading.icon} class="flex flex-col gap-4 bg-white dark:bg-black border border-slate-300 dark:border-zinc-800 p-4 w-full h-32 rounded-xl">
        {#if formData.icon}
          <img src={formData.icon} class="rounded-md mx-auto h-full" />
        {:else}
          <Icon src={DocumentPlus} size="48" class="text-slate-500 dark:text-zinc-500 mx-auto my-auto" />
        {/if}
      </button>
      {#if uploading.icon}
        <ImageUploadModal
          bind:open={uploading.icon}
          bind:output={formData.icon}
          on:upload={() => uploading.icon = false}
        />
      {/if}
    </div>
    <div class="flex flex-col gap-1">
      <Label>Banner</Label>
      <button type="button" on:click={() => uploading.banner = !uploading.banner} class="flex flex-col gap-4 bg-white dark:bg-black border border-slate-300 dark:border-zinc-800 p-4 w-full h-32 rounded-xl">
        {#if formData.banner}
          <img src={formData.banner} class="rounded-md mx-auto h-full" />
        {:else}
        <Icon src={DocumentPlus} size="48" class="text-slate-500 dark:text-zinc-500 mx-auto my-auto" />
        {/if}
      </button>
      {#if uploading.banner}
        <ImageUploadModal
          bind:open={uploading.banner}
          bind:output={formData.banner}
          on:upload={() => uploading.banner = false}
        />
      {/if}
    </div>
    <Checkbox bind:checked={formData.enable_downvotes} defaultValue={true}>
      Enable downvotes
    </Checkbox>
    <Checkbox checked={formData.enable_nsfw} defaultValue={true}>
      Enable NSFW
    </Checkbox>
    <Select
      label="Registration Mode"
      bind:value={formData.registration_mode}
      class="w-max"
    >
      <option value="Open">Open</option>
      <option value="RequireApplication">Require Application</option>
      <option value="Closed">Closed</option>
    </Select>
    {#if formData.registration_mode == 'RequireApplication'}
      <MarkdownEditor
        previewButton
        label="Application question"
        bind:value={formData.application_question}
      />
    {/if}
    <Checkbox
      bind:checked={formData.community_creation_admin_only}
      defaultValue={true}
    >
      Only admins can create communities
    </Checkbox>
    <Checkbox
      bind:checked={formData.require_email_verification}
      defaultValue={true}
    >
      Require email verification
    </Checkbox>
    <Checkbox
      bind:checked={formData.application_email_admins}
      defaultValue={true}
    >
      Email admins on receiving new applications
    </Checkbox>
    <Checkbox bind:checked={formData.reports_email_admins} defaultValue={true}>
      Email admins on receiving new reports
    </Checkbox>
    <Select
      label="Listing Type"
      bind:value={formData.default_post_listing_type}
      class="w-max"
    >
      <option value="All">All</option>
      <option value="Local">Local</option>
    </Select>
    <Checkbox bind:checked={formData.private_instance} defaultValue={true}>
      Private instance
    </Checkbox>
    <Checkbox bind:checked={formData.hide_modlog_mod_names} defaultValue={true}>
      Hide modlog mod names
    </Checkbox>
    <TextInput
      bind:value={formData.slur_filter_regex}
      label="Slur filter regex"
      placeholder="(word1|word2)"
    />
    <Checkbox bind:checked={formData.federation_enabled} defaultValue={true}>
      Federation enabled
    </Checkbox>
    <Checkbox bind:checked={formData.federation_debug} defaultValue={false}>
      Federation debug mode
    </Checkbox>
    <Checkbox bind:checked={formData.captcha_enabled} defaultValue={false}>
      Captcha enabled
    </Checkbox>
  {/if}
  <Button color="primary" size="lg" loading={saving} disabled={saving} submit>
    Save
  </Button>
</form>
