<script lang="ts">
  import { userSettings } from '$lib/settings'
</script>

<h1
  class="text-3xl font-bold flex items-center gap-2 {$userSettings.font ==
  'satoshi/nunito'
    ? 'font-display'
    : ''} {$$props.class ?? ''}"
>
  <slot />
</h1>
