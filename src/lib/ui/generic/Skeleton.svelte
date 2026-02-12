<script lang="ts">
  const sizes = {
    sm: 'h-20',
    md: 'h-30',
    lg: 'h-36',
  }

  interface Props {
    size?: keyof typeof sizes
  }

  let { size = 'lg' }: Props = $props()
</script>

<div class={['skeleton flex flex-col gap-2 w-full', sizes[size]]}>
  <div class="w-2/3 h-1/6 rounded-lg"></div>
  <div class="w-full h-4/6 rounded-lg"></div>
  <div class="w-32 h-1/6 rounded-lg"></div>
</div>

<style>
  @reference '../../../app.css';

  @keyframes pulse {
    0% {
      background-position: 100%;
    }
    50% {
      background-position: 0%;
    }
    100% {
      background-position: -100%;
    }
  }

  .skeleton * {
    background: linear-gradient(
      to right,
      var(--color-slate-100),
      var(--color-slate-200),
      var(--color-slate-100)
    );
    border: 1px solid var(--color-slate-300);
    animation: pulse 1s infinite linear;

    @variant dark {
      border-color: var(--color-zinc-800);
      background-image: linear-gradient(
        to right,
        var(--color-zinc-925),
        var(--color-zinc-900),
        var(--color-zinc-925)
      ) !important;
    }
    background-size: 200%;
  }
</style>
