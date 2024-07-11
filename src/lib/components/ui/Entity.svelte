<script lang="ts">
  import Avatar from './Avatar.svelte'

  export let name: string
  export let label: string | undefined = undefined
  export let icon: string | undefined = undefined
</script>

<div class="flex flex-row gap-2 items-center">
  <slot name="icon">
    <Avatar url={icon} width={32} />
  </slot>
  <div class="flex flex-col">
    <span class="font-bold text-base">{name}</span>
    <span class="text-sm">{label}</span>
  </div>
</div>
