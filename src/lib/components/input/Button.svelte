<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import { Color } from '$lib/ui/colors.js'

    export let color: Color = Color.secondary
    export let loading = false

    const dispatch = createEventDispatcher()
</script>

<button
    on:click={(e) => dispatch('click', e)}
    class="px-3 py-1.5 rounded-md {color} text-sm transition-all"
>
    <div
        class="flex flex-row items-center justify-center gap-2"
        class:opacity-0={loading}
    >
        <slot name="icon" />
        <slot />
    </div>
    <div class="mx-auto my-auto" class:hidden={!loading}>loading...</div>
</button>
