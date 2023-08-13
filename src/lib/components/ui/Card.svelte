<script lang="ts">
  type CardColor = 'default' | 'warning' | 'error'
  export let cardColor: CardColor = 'default'

  export let elevation: 0 | 1 = 1

  const getColor = (color: CardColor) => {
    switch (color) {
      case 'default':
        return elevation == 0
          ? 'border border-slate-200 dark:border-zinc-900 bg-slate-100 dark:bg-zinc-950'
          : 'border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
      case 'warning':
        return 'border border-yellow-300 dark:bg-yellow-950/30 dark:border-yellow-900 bg-yellow-50'
    }
  }

  let clazz = ''
  export { clazz as class }
</script>

<div
  class="break-words
    {getColor(cardColor)} rounded-md {clazz}"
  {...$$restProps}
>
  <slot />
</div>
