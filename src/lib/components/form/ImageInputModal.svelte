<script lang="ts">
  import { Button, Modal, TextInput } from 'mono-svelte'
  import Switch from '../input/Switch.svelte'
  import { t } from '$lib/i18n/translations'
  import ImageAttachForm from './ImageAttachForm.svelte'

  let {
    open = $bindable(),
    imageUrl: passedImageUrl = $bindable(),
  }: { open: boolean; imageUrl?: string } = $props()

  let imageUrl = $derived(passedImageUrl)
  let customUrl = $state(false)
</script>

<Modal bind:open title={$t('form.post.uploadImage')}>
  <div class="flex justify-between gap-1 flex-wrap">
    <Switch
      options={[false, true]}
      optionNames={[$t('common.attach'), $t('content.url')]}
      bind:selected={customUrl}
    />

    <Button
      onclick={() => {
        passedImageUrl = undefined
        open = false
      }}
      size="xs"
      rounding="xl"
    >
      {$t('common.remove')}
    </Button>
  </div>

  {#if customUrl}
    <form
      onsubmit={e => {
        e.preventDefault()
        if (!imageUrl) throw new Error('missing imageurl')

        if (URL.canParse != undefined) {
          if (!URL.canParse(imageUrl)) throw new Error('invalid URL')
        }

        passedImageUrl = imageUrl
        open = false
      }}
      class="contents"
    >
      <TextInput
        label={$t('content.url')}
        bind:value={imageUrl}
        pattern="http(s)?:\/\/(.*).(png|jpg|gif|avif|webp|jpeg|jxl|svg|bmp)"
      />
      <Button submit color="primary" size="lg">
        {$t('form.submit')}
      </Button>
    </form>
  {:else}
    <ImageAttachForm
      multiple={false}
      onupload={uploaded => {
        open = false
        passedImageUrl = uploaded[0]
      }}
    />
  {/if}
</Modal>
