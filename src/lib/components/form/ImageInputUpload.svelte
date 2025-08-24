<script lang="ts">
  import { t } from '$lib/i18n/translations'
  import { Label } from 'mono-svelte'
  import { DocumentPlus, Icon, Plus } from 'svelte-hero-icons'
  import ImageInputModal from './ImageInputModal.svelte'

  let {
    imageUrl: passedImageUrl = $bindable(),
    label,
  }: {
    imageUrl?: string
    label?: string
  } = $props()

  let imageUrl = $derived(passedImageUrl)

  let open = $state(false)
</script>

<div>
  <Label>{label}</Label>

  <button
    class={[
      'flex flex-col items-center justify-center px-8 py-4 mx-auto w-full rounded-xl',
      'border border-slate-200 dark:border-zinc-800 border-dashed hover:border-slate-300 hover:dark:border-zinc-700',
      'cursor-pointer min-h-36 transition-colors bg-white dark:bg-zinc-950 relative',
    ]}
    type="button"
    onclick={() => (open = !open)}
  >
    {#if imageUrl}
      <div>
        <Icon
          src={Plus}
          class="text-slate-400 dark:text-zinc-500 absolute top-0 left-0 m-2"
          size="20"
          micro
        />
      </div>
      <img src={imageUrl} alt="" class="rounded-md mx-auto h-full" />
    {:else}
      <Icon
        src={DocumentPlus}
        class="text-slate-400 dark:text-zinc-500"
        size="36"
        solid
      />
      <p class="text-slate-600 dark:text-zinc-400 font-medium">
        {$t('common.attach')}
      </p>
    {/if}
    <ImageInputModal bind:open bind:imageUrl={passedImageUrl} />
  </button>
</div>
