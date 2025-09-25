<script lang="ts">
  import { Disclosure } from 'mono-svelte'
  import { Minus, Plus, Icon } from 'svelte-hero-icons'
  import type { ClassValue } from 'svelte/elements'
  interface Props {
    open?: boolean
    icon?: boolean
    class?: ClassValue
    title?: import('svelte').Snippet<[boolean | undefined]>
    extended?: import('svelte').Snippet
    content?: import('svelte').Snippet
    children?: import('svelte').Snippet
  }

  let {
    open = $bindable(false),
    icon = true,
    class: clazz = '',
    title,
    extended,
    content,
    children,
  }: Props = $props()
</script>

<Disclosure {extended} bind:open class={['gap-2', clazz]}>
  {#snippet summary()}
    <div
      class={[
        'font-medium w-full text-left flex flex-row items-center justify-between hover:text-primary-900',
        'dark:hover:text-primary-100 transition-colors z-0 group relative cursor-pointer',
      ]}
    >
      <div class="flex flex-row gap-1 items-center w-full">
        {@render title?.(open)}
      </div>
      {#if icon}
        <div
          class={[
            'ml-auto',
            !open && 'rotate-90',
            'transition-transform duration-300 ease-out',
          ]}
        >
          <Icon src={open ? Minus : Plus} size="15" micro class={[]} />
        </div>
      {/if}
      <div
        class="inset-0 -z-10 opacity-0 absolute bg-slate-200/50 dark:bg-zinc-900/50 rounded-full
      group-hover:opacity-100 group-hover:-inset-1 group-hover:-inset-x-2 transition-all"
      ></div>
    </div>
  {/snippet}
  {#if content}
    {@render content()}
  {:else}
    <div class="text-slate-900 dark:text-zinc-100 *:mt-2">
      {@render children?.()}
    </div>
  {/if}
</Disclosure>
