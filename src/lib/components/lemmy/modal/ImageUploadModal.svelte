<script lang="ts">
  import { profile } from '$lib/auth.js'
  import { uploadImage } from '$lib/util.js'
  import { ImageInput, toast } from 'mono-svelte'
  import { Button, Modal } from 'mono-svelte'
  import { createEventDispatcher } from 'svelte'

  export let open: boolean
  export let image: FileList | null = null
  export let output: string | undefined = undefined
  let loading = false

  const dispatcher = createEventDispatcher<{ upload: string }>()

  async function upload() {
    if (!$profile?.jwt || image == null) return

    loading = true

    try {
      const uploaded = await uploadImage(
        image[0],
        $profile.instance,
        $profile.jwt
      )

      if (!uploaded) throw new Error('Image upload returned undefined')

      dispatcher('upload', uploaded)
      output = uploaded
      loading = false
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    }

    loading = false
  }
</script>

<Modal bind:open bind:output>
  <span slot="title">Upload image</span>
  <form class="flex flex-col gap-4" on:submit|preventDefault={upload}>
    <ImageInput accept="image/jpeg,image/png,image/webp" bind:files={image} />
    <Button {loading} disabled={loading} submit color="primary" size="lg">
      Upload
    </Button>
  </form>
</Modal>
