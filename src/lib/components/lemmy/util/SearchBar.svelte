<script lang="ts">
  import { goto } from '$app/navigation'
  import { t } from '$lib/translations'
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
    placeholder={$t('nav.search')}
    autofocus
  />
</form>
<slot {search} {loading} />
