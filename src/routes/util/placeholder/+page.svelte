<script lang="ts">
  import { placeholders } from '$lib/util.js'
  import { Button } from 'mono-svelte'

  let post = placeholders.get('post')
  let comment = placeholders.get('comment')
  let url = placeholders.get('url')
</script>

<h1 class="font-bold text-2xl">Placeholders</h1>
<p>
  Photon randomly generates placeholders for use in text inputs and stuff. If
  you have "Random Placeholders" disabled in settings, they will be empty.
</p>

<h2 class="font-bold text-xl mt-4">Posts</h2>
<p>
  {post}
</p>
<Button on:click={() => (post = placeholders.get('post'))} class="w-max">
  Generate
</Button>

<h2 class="font-bold text-xl mt-4">Comments</h2>
<p>
  {comment}
</p>
<Button on:click={() => (comment = placeholders.get('comment'))} class="w-max">
  Generate
</Button>

<h2 class="font-bold text-xl mt-4">Urls</h2>
<p>
  {url}
</p>
<Button on:click={() => (url = placeholders.get('url'))} class="w-max">
  Generate
</Button>
