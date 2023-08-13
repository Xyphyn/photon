<script lang="ts">
  export let data
</script>

<svelte:head>
  <title>{data.community.community_view.community.title}</title>
</svelte:head>

<slot />
