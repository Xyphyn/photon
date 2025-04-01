<script lang="ts">
  import { Spinner } from 'mono-svelte'
  import { fade } from 'svelte/transition'
</script>

<h1
  class="font-medium tracking-tight text-3xl md:text-4xl self-start justify-self-start"
>
  Photon Premium
</h1>
<div class="flex flex-col h-full justify-center items-center gap-2">
  <Spinner width={32} />
</div>
<div in:fade|global={{ duration: 20 * 1000, delay: 10 * 1000 }}>
  theres nothing here
</div>
