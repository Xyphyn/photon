<script lang="ts">
  import { profile } from '$lib/auth.js'
  import { ImageInput, toast } from 'mono-svelte'
  import { uploadImage } from '$lib/lemmy.js'
  import { Button, Modal } from 'mono-svelte'
  import { createEventDispatcher } from 'svelte'

  export let open: boolean
  export let image: FileList | null = null
  let loading = false

  const dispatcher = createEventDispatcher<{ upload: string }>()

  async function upload() {
    if (!$profile?.jwt || image == null) return

    loading = true

    try {
      const uploaded = await uploadImage(image[0])

      if (!uploaded) throw new Error('Image upload returned undefined')

      dispatcher('upload', uploaded)
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

<Modal bind:open>
  <span slot="title">Upload image</span>
  <form class="flex flex-col gap-4" on:submit|preventDefault={upload}>
    <ImageInput accept="image/jpeg,image/png,image/webp" bind:files={image} />
    <Button {loading} disabled={loading} submit color="primary" size="lg">
      Upload
    </Button>
  </form>
</Modal>
