<script lang="ts">
  import { Button } from 'mono-svelte'
  import { Icon, QuestionMarkCircle, type IconSource } from 'svelte-hero-icons'
  import Avatar from '../../Avatar.svelte'

  export let action: {
    name: string
    desc?: string
    handle?: () => any
    href?: string
    shortcut?: string
    icon: string | IconSource
  }
</script>

<Button
  href={action.href}
  on:click={action.handle}
  alignment="left"
  color="tertiary"
  size="lg"
  class="focus:bg-slate-200 focus:dark:bg-zinc-800"
>
  {#if typeof action.icon === 'string'}
    <Avatar url={action.icon} width={20} />
  {:else}
    <Icon src={action.icon ?? QuestionMarkCircle} size="20" />
  {/if}
  {action.name}
</Button>
