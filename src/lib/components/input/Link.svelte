<script lang="ts">
    import { Color } from '$lib/ui/colors.js'

    export let color: Color = Color.secondary
    export let href = ''
</script>

<a
    {href}
    class="px-2 py-1 rounded-md {color} flex flex-row items-center
    justify-center text-sm transition-all"
>
    <slot name="icon" />
    <slot />
</a>
