<script lang="ts">
  export let small: boolean = false
</script>

<span
  {...$$restProps}
  class="{!small ? 'text-lg' : 'text-xs'} font-semibold {$$props.class}"
>
  <slot />
</span>
