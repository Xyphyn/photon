<script lang="ts">
  import { ReactiveState } from '$lib/promise.svelte'
  import UserPage from '../../u/[name]/+page.svelte'
  let { data } = $props()
</script>

{#if data.user && data.sort && data.type && data.page}
  <UserPage
    inline
    data={{
      items: new ReactiveState(data.user.submissions),
      filters: new ReactiveState({
        page: data.page,
        sort: data.sort,
        type: data.type,
      }),
      person_view: {value: data.user.person_view},
      moderates: {value: data.user.moderates},
    }}
  />
{:else}
  User data is missing.
  <pre>
    {JSON.stringify(data)}
  </pre>
{/if}
