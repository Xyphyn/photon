<script lang="ts">
  import Avatar from './Avatar.svelte'

  export let name: string
  export let label: string | undefined = undefined
  export let icon: string | undefined = undefined
</script>

<div class="flex flex-row gap-2 items-center">
  <Avatar url={icon} width={32} />
  <div class="flex flex-col">
    <span class="font-medium">{name}</span>
    <span class="text-sm">{label}</span>
  </div>
</div>
