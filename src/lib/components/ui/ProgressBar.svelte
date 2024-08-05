<script lang="ts">
  import { expoOut } from 'svelte/easing'
  import { tweened } from 'svelte/motion'

  export let progress: number = 0

  let tween = tweened(progress, { easing: expoOut })

  $: tween.set(progress)
</script>

<div
  class="bg-primary-900 dark:bg-primary-100 h-1 rounded-full"
  style="width: {$tween * 100}%;"
/>
