<script lang="ts">
  type CardColor = 'default' | 'warning' | 'error'
  export let cardColor: CardColor = 'default'

  const getColor = (color: CardColor) => {
    switch (color) {
      case 'default':
        return 'border border-slate-200 dark:border-zinc-800 dark:bg-zinc-900'
      case 'warning':
        return 'border border-yellow-300 dark:bg-yellow-950/30 dark:border-yellow-900 bg-yellow-50'
    }
  }

  let clazz = ''
  export { clazz as class }
</script>

<div
  class="bg-white break-words
    {getColor(cardColor)} rounded-md {clazz}"
  {...$$restProps}
>
  <slot />
</div>
