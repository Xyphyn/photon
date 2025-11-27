<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import { Button, Material } from 'mono-svelte'

  function getError(message: string): { string: string; code: boolean } {
    try {
      return { string: errorMessage(message), code: false }
    } catch {
      return { string: message, code: true }
    }
  }
</script>

<div
  class="flex flex-col gap-4 my-auto h-full justify-center max-w-xl w-full mx-auto"
>
  <Material rounding="3xl" padding="xl" color="error" class="space-y-2">
    <h1 class="text-4xl font-medium flex items-center flex-row gap-2 font-mono">
      {page.status}
    </h1>
    {#if page?.error?.message}
      {@const error = getError(page?.error?.message)}
      {#if error.code}
        <code class="rounded-md dark:bg-zinc-950! px-2 py-1 min-w-48">
          {error.string}
        </code>
      {:else}
        <p class="text-lg">
          {error.string}
        </p>
      {/if}
    {/if}
  </Material>
  <div class="flex items-center gap-2 px-4">
    <Button size="lg" onclick={() => goto(page.url, { invalidateAll: true })}>
      {$t('message.retry')}
    </Button>
    <Button href="/" size="lg">
      {$t('nav.home')}
    </Button>
  </div>
</div>
