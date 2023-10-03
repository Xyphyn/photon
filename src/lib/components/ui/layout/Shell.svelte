<script lang="ts">
  import { routes } from '$lib/util.js'

  export let route: { id: string } | undefined = undefined

  $: title = route ? routes[(route.id as keyof typeof routes) ?? ''] : ''
</script>
