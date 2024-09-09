<script lang="ts" context="module">
  const wrapClass = {
    wrap: '',
    'no-wrap': 'overflow-hidden overflow-ellipsis whitespace-nowrap',
  }
</script>

<script lang="ts">
  export let wrap: keyof typeof wrapClass = 'wrap'

  $: classes = `${wrapClass[wrap]} ${$$props.class ?? ''}`
</script>

<span class={classes}>
  <slot />
</span>
