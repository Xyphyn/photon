<script lang="ts">
  let { children } = $props()
</script>

<div class="fixed inset-0 bg-slate-100 dark:bg-zinc-950 z-50 overflow-auto max-h-screen">
  <div class="relative w-full h-full z-100">
    {@render children?.()}
  </div>
  <div class="glow"></div>
</div>

<style>
  @reference '../../app.css';
  .glow {
    --glow-color: var(--color-indigo-600);

    @variant dark {
      --glow-color: var(--color-indigo-400);
    }

    position: fixed;
    left: 50%;
    top: 0;
    translate: -50% 0%;
    z-index: 0;
    width: 128rem;
    height: 100%;
    background: radial-gradient(circle at top center, transparent 20%, var(--glow-color) 100%);
    background-size: 400%;
    background-position: 50% 100%;
  }
</style>
