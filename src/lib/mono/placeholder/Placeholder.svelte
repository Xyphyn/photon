<script lang="ts">
	import { Icon, type IconSource } from 'svelte-hero-icons'
	export let icon: IconSource | undefined = undefined
	export let title: string | undefined = undefined
	export let description: string | undefined = undefined
</script>

<div class="text-slate-700 dark:text-zinc-300 flex flex-col justify-center items-center gap-2">
	{#if icon || $$slots.icon}
		<div class="border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 p-3 rounded-full">
			{#if $$slots.icon}
				<slot name="icon" />
			{:else if icon}
				<Icon src={icon} size="28" />
			{/if}
		</div>
	{/if}
	<div class="flex flex-col gap-1 text-center">
		<h1 class="text-slate-900 dark:text-zinc-100 text-lg font-medium">
			{#if $$slots.title}
				<slot name="title" />
			{:else if title}
				{title}
			{/if}
		</h1>
		{#if description || $$slots.description}
			<p class="text-sm text-center font-normal">
				{#if $$slots.description}
					<slot name="description" />
				{:else if description}
					{description}
				{/if}
			</p>
		{/if}
	</div>
	<slot />
</div>
