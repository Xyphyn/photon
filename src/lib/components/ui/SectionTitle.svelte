<script lang="ts">
  export let small: boolean = false
  let clazz: string = ''
  export { clazz as class }
</script>

<span
  {...$$restProps}
  class="{!small ? 'text-lg' : 'text-xs'} font-semibold {clazz}"
>
  <slot />
</span>
