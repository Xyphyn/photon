<script lang="ts">
  import type { UploadImageResponse } from '$lib/api/types'
  import { t } from '$lib/app/i18n'
  import { formatBytes, loader } from '$lib/app/util.svelte'
  import { Button, Modal } from 'mono-svelte'
  import { untrack, type Snippet } from 'svelte'
  import { DocumentPlus, Icon } from 'svelte-hero-icons/dist'
  import { uploadStrategy } from './file-upload.svelte'

  interface Props {
    accept?: string
    preview?: string
    upload: (file: File) => Promise<UploadImageResponse>
    remove?: () => Promise<unknown>
    onupload?: (result?: string) => void
    onremove?: () => void
    target: Snippet<[() => void]>
  }

  let {
    accept = 'image/*',
    preview,
    upload = uploadStrategy.default,
    remove,
    onremove,
    target,
    onupload,
  }: Props = $props()

  export const toggleModal = () => (open = !open)
  export const prefill = (f: FileList) => {
    fileList = f
    open = true
  }

  let open = $state(false)
  let fileList = $state<FileList>()
  let file = $derived(fileList?.item(0) ?? undefined)
  let previewUrl = $derived(preview)
  let loading = $state({
    upload: false,
    remove: false,
  })

  let submit = (removing: boolean) =>
    loader(
      (v) => (removing ? (loading.remove = v) : (loading.upload = v)),
      async () => {
        if (!file || removing) {
          await remove?.()
          onremove?.()
          previewUrl = undefined
          return
        }
        const res = await upload(file)
        onupload?.(res.image_url)
      },
      toggleModal,
    )

  $effect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file)

      untrack(() => {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
      })

      previewUrl = objectUrl
    }
  })
</script>

{@render target(toggleModal)}

{#if open}
  <Modal bind:open title={$t('form.post.uploadImage')}>
    <form class="flex flex-col gap-2">
      <label>
        <div
          class="btn btn-secondary rounded-2xl items-center justify-center h-64 relative overflow-hidden"
          aria-label={$t('common.attach')}
        >
          {#if previewUrl}
            <img src={previewUrl} alt="" class="w-full h-full object-contain" />
            <Icon
              src={DocumentPlus}
              size="32"
              solid
              class="absolute top-0 right-0 z-10 text-slate-600 dark:text-zinc-400 m-4"
            />
          {:else}
            <Icon src={DocumentPlus} size="48" solid />
          {/if}
        </div>
        <input
          {accept}
          class="appearance-none hidden"
          type="file"
          bind:files={fileList}
          multiple={false}
        />
        <div class="font-mono text-slate-600 dark:text-zinc-400 text-xs">
          {#if file}
            {file.name} - {formatBytes(file.size)}
          {/if}
        </div>
      </label>
      <div class="flex flex-row gap-2 items-center *:flex-1">
        <Button
          disabled={file == null}
          onclick={() => submit(false)}
          color="primary"
          size="lg"
          loading={loading.upload}
        >
          {$t('form.submit')}
        </Button>
        {#if remove}
          <Button
            disabled={preview == null}
            onclick={() => submit(true)}
            color="danger"
            size="lg"
            loading={loading.remove}
          >
            {$t('common.remove')}
          </Button>
        {/if}
      </div>
    </form>
  </Modal>
{/if}
