<script lang="ts">
  import { profile } from '$lib/auth.js'
  import Button from '$lib/components/input/Button.svelte'
  import Checkbox from '$lib/components/input/Checkbox.svelte'
  import SelectMenu from '$lib/components/input/SelectMenu.svelte'
  import TextArea from '$lib/components/input/TextArea.svelte'
  import TextInput from '$lib/components/input/TextInput.svelte'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import { getClient } from '$lib/lemmy.js'
  import type { EditSite } from 'lemmy-js-client'
  import type { PageData } from './$types.js'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'

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
        auth: jwt,
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
    <Checkbox bind:checked={formData.enable_downvotes} defaultValue={true}>
      Enable downvotes
    </Checkbox>
    <Checkbox checked={formData.enable_nsfw} defaultValue={true}>
      Enable NSFW
    </Checkbox>
    <SelectMenu
      label="Registration mode"
      alignment="top-left"
      options={['Closed', 'RequireApplication', 'Open']}
      optionNames={['Closed', 'Require Application', 'Open Registration']}
      selected={formData.registration_mode ?? 'Open'}
      on:select={(e) => {
        // @ts-ignore
        formData.registration_mode = e.detail
      }}
    />
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
  {/if}
  <Button color="primary" size="lg" loading={saving} disabled={saving} submit>
    Save
  </Button>
</form>
