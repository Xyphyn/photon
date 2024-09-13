<script lang="ts">
	export let defaultValue: boolean = false
	export let checked: boolean | undefined = defaultValue
	export let inlineDescription: boolean = false
</script>

<label class="font-normal cursor-pointer text-sm flex flex-row items-baseline gap-2">
	<input type="checkbox" bind:checked class="cursor-pointer" />
	<div class="inline-flex {inlineDescription ? 'flex-row' : 'flex-col'} font-medium gap-1">
		<slot />
		{#if $$slots.description}
			<span class="font-normal text-slate-600 dark:text-zinc-400"><slot name="description" /></span>
		{/if}
	</div>
</label>
