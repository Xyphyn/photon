<script lang="ts">
  import Button from '$lib/components/Button.svelte'

  let url = ''

  async function changeInstance() {
    try {
      new URL(`https://${url}`)
    } catch (error) {
      return
    }

    await fetch('/instance_url', {
      method: 'POST',
      body: url,
    })
  }
</script>

<form
  class="bg-slate-100 border border-slate-200 dark:border-zinc-800
  dark:bg-zinc-900 p-8 flex flex-col gap-4 rounded-md"
>
  <h1 class="font-bold text-lg">Change instance</h1>
  <p class="text-xs">(Must be exact URL )</p>
  <input bind:value={url} type="text" />
  <Button on:click={changeInstance}>change</Button>
</form>
