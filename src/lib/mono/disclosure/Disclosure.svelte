<script lang="ts">
	import { backOut, expoOut } from 'svelte/easing'
	import { slide } from 'svelte/transition'

	export let open: boolean = false
</script>

<div {...$$restProps} class={$$props.class}>
	<button on:click={() => (open = !open)} class="w-full">
		<slot name="summary" {open} />
	</button>
	{#if open}
		<div transition:slide={{ axis: 'y', easing: expoOut, duration: 300 }}>
			<slot {open} />
		</div>
	{/if}
</div>
