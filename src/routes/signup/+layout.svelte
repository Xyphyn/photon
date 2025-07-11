<script lang="ts">
  import { t } from '$lib/i18n/translations'
  import { Button } from 'mono-svelte'
  import { ArrowLeft, Icon } from 'svelte-hero-icons'

  let { children } = $props()
</script>

<div
  class="fixed inset-0 bg-slate-50 dark:bg-zinc-925 z-50 p-8 sm:p-16 lg:p-24 overflow-auto"
>
  {@render children?.()}
</div>
