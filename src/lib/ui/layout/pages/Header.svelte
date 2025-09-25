<script lang="ts">
  import { t } from '$lib/app/i18n'

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

<header
  class={[
    pageHeader &&
      `w-[calc(100%+1.5rem)] sm:w-[calc(100%+3rem)]
  bg-slate-100 dark:bg-zinc-950 -mx-3 sm:-mx-6 sm:px-6 sm:pb-6 px-4 pb-4 -mt-64 pt-64
   border-b border-slate-200 dark:border-zinc-900 margin z-0 mb-3 sm:mb-6`,
  ]}
  {style}
  aria-label={$t('aria.element.pageHeader')}
>
  {#if children}
    <h1
      class={[
        sizes[size],
        'flex gap-2 w-full tracking-tight font-medium',
        clazz,
      ]}
    >
      {@render children?.()}
    </h1>
  {/if}
  {#if extended}
    <div class="flex flex-col gap-3 mt-3">
      {@render extended?.()}
    </div>
  {/if}
</header>
