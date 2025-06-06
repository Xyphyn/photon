<script lang="ts">
  import Toast from './Toast.svelte'
  import { flip } from 'svelte/animate'
  import { toasts } from './toasts.js'
  import { backInOut, backOut, expoOut } from 'svelte/easing'
</script>

<div
  class="fixed right-0 bottom-0 flex flex-col items-end justify-end z-200 p-4
  group overflow-hidden h-screen min-w-96 pointer-events-none gap-4"
>
  {#each $toasts as toast, index (toast.id)}
    <div
      animate:flip={{ duration: 500, easing: expoOut }}
      class="pointer-events-auto transition-all
      duration-300"
    >
      <Toast {toast} />
    </div>
  {/each}
</div>
