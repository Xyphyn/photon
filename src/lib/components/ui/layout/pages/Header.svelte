<script lang="ts">
  const sizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  }

  interface Props {
    pageHeader?: boolean
    style?: string
    class?: string
    size?: keyof typeof sizes
    children?: import('svelte').Snippet
    extended?: import('svelte').Snippet
  }

  let {
    pageHeader = false,
    style = '',
    class: clazz = '',
    size = 'lg',
    children,
    extended,
  }: Props = $props()
</script>

<div
  class={[
    pageHeader &&
      `w-[calc(100%+1.5rem)] sm:w-[calc(100%+3rem)]
  bg-slate-50 dark:bg-zinc-950 -m-4 sm:-m-6 mb-0 sm:mb-0 sm:p-6 p-3
   border-b border-slate-200 dark:border-zinc-800 margin`,
  ]}
  {style}
>
  <h1
    class={[sizes[size], 'flex gap-2 w-full tracking-tight font-medium', clazz]}
  >
    {@render children?.()}
  </h1>
  {#if extended}
    <div class="mt-4">
      {@render extended?.()}
    </div>
  {/if}
</div>

<style>
  .margin {
    margin-top: -12rem;
    padding-top: 12rem;
  }

  @media screen and (min-width: 1024px) {
    .margin {
      margin-top: -8rem;
      padding-top: 8rem;
    }
  }
</style>
