<script lang="ts">
  import { navigating } from '$app/state'
  import { t } from '$lib/i18n/translations'
  import { Button, TextInput } from 'mono-svelte'
  import { Icon, MagnifyingGlass } from 'svelte-hero-icons'

  interface Props {
    query?: string | null
  }

  let { query = $bindable() }: Props = $props()

  let searchElement = $state<HTMLInputElement>()
</script>

<div
  class="flex gap-2 flex-row items-center w-full text-base h-10 drop-shadow-xl"
>
  <TextInput
    bind:value={query}
    bind:element={searchElement}
    name="q"
    placeholder={$t('routes.search.query')}
    size="lg"
    class="flex-1 rounded-full! h-full text-base!"
  />
  <Button
    submit
    color="primary"
    size="custom"
    class="shrink-0 h-full aspect-square shadow-md"
    title="Search"
    rounding="pill"
    loading={navigating.to?.route.id == '/search'}
  >
    {#snippet prefix()}
      <Icon src={MagnifyingGlass} size="16" micro />
    {/snippet}
  </Button>
</div>
