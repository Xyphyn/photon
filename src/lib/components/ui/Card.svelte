<script lang="ts">
  type CardColor = 'default' | 'warning' | 'error'
  export let cardColor: CardColor = 'default'

  const getColor = (color: CardColor) => {
    switch (color) {
      case 'default':
        return 'border-slate-200 dark:border-zinc-800'
      case 'warning':
        return 'border border-yellow-300 dark:bg-yellow-950/30 dark:border-yellow-900 bg-yellow-50 rounded-md'
    }
  }

  let clazz = ''
  export { clazz as class }
</script>

<div
  class="break-words
    {getColor(cardColor)} {clazz}"
>
  <slot />
</div>
