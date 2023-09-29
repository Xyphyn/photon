<script lang="ts">
  import { goto } from '$app/navigation'
  import { profile } from '$lib/auth.js'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { ImageInput, toast } from 'mono-svelte'
  import { getClient } from '$lib/lemmy.js'
  import { addSubscription } from '$lib/lemmy/user.js'
  import { Button, Checkbox, TextInput } from 'mono-svelte'
  import { uploadImage } from '$lib/util.js'

  /**
   * The community ID to edit.
   */
  export let edit: number | undefined = undefined

  export let formData: {
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
    if ((!edit && formData.name == '') || formData.displayName == '') return

    formData.submitting = true

    try {
      let icon = formData.icon
        ? await uploadImage(formData.icon[0], $profile.instance, $profile.jwt)
        : undefined
      let banner = formData.banner
        ? await uploadImage(formData.banner[0], $profile.instance, $profile.jwt)
        : undefined

      const res = edit
        ? await getClient().editCommunity({
            title: formData.displayName,
            description: formData.sidebar,
            nsfw: formData.nsfw,
            posting_restricted_to_mods: formData.postsLockedToModerators,
            icon: icon,
            banner: banner,
            community_id: edit,
          })
        : await getClient().createCommunity({
            name: formData.name,
            title: formData.displayName,
            description: formData.sidebar,
            nsfw: formData.nsfw,
            posting_restricted_to_mods: formData.postsLockedToModerators,
            icon: icon,
            banner: banner,
          })

      toast({
        content: `Your community was ${edit ? 'saved' : 'created'}.`,
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

      if (!edit)
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

<form on:submit|preventDefault={submit} class="flex flex-col gap-4 h-full">
  <slot name="formtitle">
    <h1 class="text-2xl font-bold">Create Community</h1>
  </slot>
  <TextInput
    required
    label="Name"
    bind:value={formData.name}
    on:input={() => {
      formData.name = formData.name.toLowerCase().replaceAll(' ', '_')
    }}
    disabled={edit != undefined}
  />
  <TextInput required label="Display name" bind:value={formData.displayName} />
  <ImageInput label="Icon" bind:files={formData.icon} />
  <ImageInput label="Banner" bind:files={formData.banner} />
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
    {edit ? 'Save' : 'Create'}
  </Button>
</form>
