<script lang="ts">
  import { goto } from '$app/navigation'
  import { profile } from '$lib/auth.js'
  import Button from '$lib/components/input/Button.svelte'
  import Checkbox from '$lib/components/input/Checkbox.svelte'
  import FileInput from '$lib/components/input/FileInput.svelte'
  import TextArea from '$lib/components/input/TextArea.svelte'
  import TextInput from '$lib/components/input/TextInput.svelte'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import { getClient, uploadImage } from '$lib/lemmy.js'
  import { addSubscription } from '$lib/lemmy/user.js'

  let formData: {
    name: string
    displayName: string
    icon: FileList | null
    banner: FileList | null
    sidebar: string
    nsfw: boolean
    postsLockedToModerators: boolean
    submitting: boolean
  } = {
    name: '',
    displayName: '',
    icon: null,
    banner: null,
    sidebar: '',
    nsfw: false,
    postsLockedToModerators: false,
    submitting: false,
  }

  async function submit() {
    if (!$profile?.jwt) return
    if (formData.name == '' || formData.displayName == '') return

    formData.submitting = true

    try {
      let icon = formData.icon ? await uploadImage(formData.icon[0]) : undefined
      let banner = formData.banner
        ? await uploadImage(formData.banner[0])
        : undefined

      const res = await getClient().createCommunity({
        auth: $profile.jwt,
        name: formData.name,
        title: formData.displayName,
        description: formData.sidebar,
        nsfw: formData.nsfw,
        posting_restricted_to_mods: formData.postsLockedToModerators,
        icon: icon,
        banner: banner,
      })

      toast({
        content: 'Your community was created.',
        type: 'success',
      })

      if ($profile.user) {
        $profile.user = {
          ...$profile.user,
          moderates: [
            ...$profile.user.moderates,
            {
              community: res.community_view.community,
              moderator: $profile.user.local_user_view.person,
            },
          ],
        }

        addSubscription(res.community_view.community, true)
      }

      goto(
        `/c/${res.community_view.community.name}@${
          new URL(res.community_view.community.actor_id).hostname
        }`
      )
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    }

    formData.submitting = false
  }
</script>

<form
  on:submit|preventDefault={submit}
  class="flex flex-col gap-4 h-full max-w-2xl mx-auto"
>
  <h1 class="text-2xl font-bold">Create Community</h1>
  <TextInput
    required
    label="Name"
    bind:value={formData.name}
    on:input={() => {
      formData.name = formData.name.toLowerCase().replaceAll(' ', '_')
    }}
  />
  <TextInput required label="Display name" bind:value={formData.displayName} />
  <FileInput label="Icon" bind:files={formData.icon} image />
  <FileInput label="Banner" bind:files={formData.banner} image />
  <MarkdownEditor previewButton label="Sidebar" bind:value={formData.sidebar} />

  <Checkbox bind:checked={formData.nsfw}>NSFW</Checkbox>
  <Checkbox bind:checked={formData.postsLockedToModerators}>
    Only moderators can post
  </Checkbox>
  <Button
    submit
    color="primary"
    size="lg"
    class="mt-auto"
    loading={formData.submitting}
    disabled={formData.submitting}
  >
    Create
  </Button>
</form>
