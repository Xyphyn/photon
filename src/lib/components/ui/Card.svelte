<script lang="ts">
  type CardColor = 'default' | 'warning' | 'error'
  export let cardColor: CardColor = 'default'

  const getColor = (color: CardColor) => {
    switch (color) {
      case 'default':
        return 'border border-slate-200 dark:border-zinc-800 dark:bg-zinc-900'
      case 'warning':
        return 'border border-yellow-300 bg-yellow-50'
    }
  }

  let clazz = ''
  export { clazz as class }
</script>

<div
  class="bg-white break-words
    p-1 {getColor(cardColor)} rounded-xl {clazz}"
>
  <slot />
</div>
