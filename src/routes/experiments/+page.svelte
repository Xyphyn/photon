<script>
  import Switch from '$lib/components/input/Switch.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import { userSettings } from '$lib/settings'
</script>

<svelte:head>
  <title>Experiments</title>
</svelte:head>

<div class="flex flex-col gap-4">
  <h1 class="text-3xl font-bold">Experiments</h1>
  <Card class="flex flex-col gap-2 p-4 text-sm">
    <h1 class="text-lg font-bold">New comment design</h1>
    <span>Makes comment actions look slightly different.</span>
    <Switch bind:enabled={$userSettings.newComments} />
  </Card>
</div>
