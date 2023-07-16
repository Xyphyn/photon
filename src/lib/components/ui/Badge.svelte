<script lang="ts">
  export let label: string = ''

  let clazz = ''
  export { clazz as class }
</script>

<span
  class="px-1 py-0.5 rounded-md text-xs ml-auto font-bold {clazz}"
  aria-label={label}
  title={label}
>
  <slot />
</span>
