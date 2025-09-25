<script lang="ts">
  import { photonify } from '$lib/app/markdown/renderers/plugins.js'
  import { TextInput } from 'mono-svelte'

  let link = $state('')

  let photonified = $derived(photonify(link))
</script>

<h1 class="font-bold text-2xl">Photonify links</h1>
<p>Convert a link from a Lemmy post to a Photon link.</p>

<div class="flex flex-row items-center flex-wrap gap-4">
  <TextInput
    label="Input"
    bind:value={link}
    placeholder="https://lemmy.world/post/1"
  />
  <TextInput label="Output" value={photonified} />
</div>
