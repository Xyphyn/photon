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

  const site = {
    ...data.site?.site_view.site,
  }

  const local_site = {
    ...data.site?.site_view.local_site,
  }
  const h = {
    fart: 'hey',
  }

  async function save() {
    if (!$profile?.jwt) return

    saving = true
    const { jwt } = $profile

    try {
      await getClient().editSite({
        auth: jwt,
        name: site.name,
        description: site.description,
        sidebar: site.sidebar,
        legal_information: local_site.legal_information,
        enable_downvotes: local_site.enable_downvotes,
        enable_nsfw: local_site.enable_nsfw,
        registration_mode: local_site.registration_mode,
        community_creation_admin_only: local_site.community_creation_admin_only,
        require_email_verification: local_site.require_email_verification,
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
  {#if site}
    <TextInput bind:value={site.name} label="Name" />
    <TextInput bind:value={site.description} label="Description" />
    <MarkdownEditor previewButton bind:value={site.sidebar} label="Sidebar" />
  {/if}
  {#if local_site}
    <MarkdownEditor
      previewButton
      bind:value={local_site.legal_information}
      label="Legal"
    />
    <Checkbox
      checked={local_site.enable_downvotes ?? true}
      on:change={(e) => {
        local_site.enable_downvotes = !local_site.enable_downvotes
      }}
    >
      Enable downvotes
    </Checkbox>
    <Checkbox
      checked={local_site.enable_nsfw ?? true}
      on:change={(e) => {
        local_site.enable_nsfw = !local_site.enable_nsfw
      }}
    >
      Enable NSFW
    </Checkbox>
    <SelectMenu
      label="Registration mode"
      alignment="top-left"
      options={['Closed', 'RequireApplication', 'Open']}
      optionNames={['Closed', 'Require Application', 'Open Registration']}
      selected={local_site.registration_mode ?? 'Open'}
      on:select={(e) => {
        // @ts-ignore
        local_site.registration_mode = e.detail
      }}
    />
    <Checkbox
      checked={local_site.community_creation_admin_only ?? true}
      on:change={(e) => {
        local_site.community_creation_admin_only =
          !local_site.community_creation_admin_only
      }}
    >
      Only admins can create communities
    </Checkbox>
    <Checkbox
      checked={local_site.require_email_verification ?? true}
      on:change={(e) => {
        local_site.require_email_verification =
          !local_site.require_email_verification
      }}
    >
      Require email verification
    </Checkbox>
    <Checkbox
      checked={local_site.application_email_admins ?? true}
      on:change={(e) => {
        local_site.application_email_admins =
          !local_site.application_email_admins
      }}
    >
      Email admins on receiving new applications
    </Checkbox>
    <Checkbox
      checked={local_site.reports_email_admins ?? true}
      on:change={(e) => {
        local_site.reports_email_admins = !local_site.reports_email_admins
      }}
    >
      Email admins on receiving new reports
    </Checkbox>
    <Checkbox
      checked={local_site.private_instance ?? true}
      on:change={(e) => {
        local_site.private_instance = !local_site.private_instance
      }}
    >
      Private instance
    </Checkbox>
    <Checkbox
      checked={local_site.hide_modlog_mod_names ?? true}
      on:change={(e) => {
        local_site.hide_modlog_mod_names = !local_site.hide_modlog_mod_names
      }}
    >
      Hide modlog mod names
    </Checkbox>
    <TextInput
      bind:value={local_site.slur_filter_regex}
      label="Slur filter regex"
      placeholder="(word1|word2)"
    />
    <Checkbox
      checked={local_site.federation_enabled ?? true}
      on:change={(e) => {
        local_site.federation_enabled = !local_site.federation_enabled
      }}
    >
      Federation enabled
    </Checkbox>
  {/if}
  <Button color="primary" size="lg" loading={saving} disabled={saving} submit>
    Save
  </Button>
</form>
