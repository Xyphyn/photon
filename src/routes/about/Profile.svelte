<script lang="ts">
  export let avatar: string | undefined = undefined

  export let name: string
  export let description: string

  export let link: string = '#'
</script>

<div class="flex flex-row items-center gap-2 {$$props.class}">
  {#if $$slots.avatar || avatar}
    {#if $$slots.avatar}
      <slot name="avatar" />
    {:else}
      <img
        src={avatar}
        alt="{name}'s profile"
        width={40}
        height={40}
        class="w-10 h-10 rounded-full"
      />
    {/if}
  {/if}
  <div class="flex flex-col">
    <a
      href={link}
      class="font-semibold text-lg"
      class:hover:underline={link != '#'}
    >
      {name}
    </a>
    <span class="text-slate-700 dark:text-zinc-300">{description}</span>
  </div>
</div>
