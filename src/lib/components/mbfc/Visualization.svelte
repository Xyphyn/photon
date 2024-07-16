<script lang="ts">
  type T = $$Generic

  export let data: T[]
  export let selected: T
  export let name: string
  export let alt: boolean = false
  export let width: number = 48
</script>

<div class="flex items-start gap-4 mx-auto mb-6">
  {#each data as rating, index}
    <div
      class="flex flex-col gap-2 items-center relative"
      style=" width: {width}px; height: {width}px;"
    >
      <div
        class="w-12 h-12 {alt
          ? 'bg-red-500'
          : 'bg-blue-500 border-blue-700'} opacity-50 transition-all cursor-pointer duration-100 {rating ==
        selected
          ? 'current-bias'
          : 'hover:opacity-100 rounded-full'}"
        style="filter: hue-rotate({index *
          30}deg); width: {width}px; height: {width}px;"
      ></div>
      {#if rating == selected}
        <span
          class="capitalize font-medium whitespace-nowrap max-w-max absolute -bottom-8 left-1/2 -translate-x-1/2"
        >
          {name}
        </span>
      {/if}
    </div>
  {/each}
</div>

<style>
  @keyframes spin {
    0% {
      transform: rotate(-180deg);
      opacity: 0.5;
      border-radius: 64px;
    }
    100% {
      transform: rotate(45deg);
      opacity: 1;
      border-radius: 12px;
    }
  }

  .current-bias {
    animation: spin 1s forwards cubic-bezier(0.075, 0.82, 0.165, 1);
  }
</style>
