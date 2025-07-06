<script lang="ts">
  import { Material, Popover } from 'mono-svelte'
  import { Icon, Sparkles } from 'svelte-hero-icons'
</script>

<Popover placement="left">
  {#snippet target()}
    <button
      class="potato p-4 rounded-full border border-slate-200 dark:border-zinc-800 cursor-pointer pointer-events-auto"
    >
      <Icon src={Sparkles} size="32" />
    </button>
  {/snippet}
  {#snippet popover()}
    <Material color="uniform" rounding="2xl">
      <h1 class="font-bold text-3xl">AI !!!!</h1>
    </Material>
  {/snippet}
</Popover>

<style>
  .potato {
    background: linear-gradient(
      30deg,
      color-mix(
        in srgb,
        var(--color-zinc-900) 90%,
        var(--color-purple-400) 10%
      ),
      color-mix(in srgb, var(--color-zinc-900) 90%, var(--color-blue-400) 10%)
    );
  }
</style>
