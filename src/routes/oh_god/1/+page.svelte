<script lang="ts">
  import { fade } from 'svelte/transition'
  import what from './what.png'
</script>

<div class="z-[300] fixed top-0 left-0 w-screen h-screen bg-black">
  <img
    src={what}
    alt="god save us"
    in:fade|global={{ duration: 20 * 1000 }}
    class="w-full h-full"
  />
</div>
