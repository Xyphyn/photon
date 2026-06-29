<script lang="ts">
  import UserPage from '../../u/[name]/+page.svelte'

  let { data } = $props()
</script>

<UserPage {data} />
