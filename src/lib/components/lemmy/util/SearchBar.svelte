<script lang="ts">
  import { goto } from '$app/navigation'
  import { TextInput } from 'mono-svelte'

  let query: string = ''
  let loading = false

  function search() {
    loading = true
    goto(`/search?q=${query}`).then(() => (loading = false))
  }
</script>

<form on:submit|preventDefault={search} class="w-full h-full {$$props.class}">
  <TextInput
    bind:value={query}
    class="w-full h-full {$$props.class}"
    placeholder="Search"
    autofocus
  />
</form>
<slot {search} {loading} />
