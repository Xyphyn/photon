<script lang="ts" context="module">
  const wrapClass = {
    wrap: '',
    'no-wrap': 'overflow-hidden overflow-ellipsis whitespace-nowrap',
  }
</script>

<script lang="ts">
  export let wrap: keyof typeof wrapClass = 'wrap'

  let clazz: string = ''
  export { clazz as class }
  $: classes = `${wrapClass[wrap]} ${clazz ?? ''}`
</script>

<span class={classes}>
  <slot />
</span>
