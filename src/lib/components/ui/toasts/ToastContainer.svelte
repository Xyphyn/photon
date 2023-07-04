<script lang="ts">
  import Toast from '$lib/components/ui/toasts/Toast.svelte'
  import { flip } from 'svelte/animate'
  import { expoInOut } from 'svelte/easing'
  import { toasts } from '$lib/components/ui/toasts/toasts'
</script>

<div
  class="fixed right-0 top-0 flex flex-col gap-4 z-50 p-4 overflow-hidden h-screen min-w-[24rem] items-end pointer-events-none"
>
  {#each $toasts as toast (toast.id)}
    <div
      animate:flip={{ duration: 500, easing: expoInOut }}
      class="pointer-events-auto"
    >
      <Toast {toast} />
    </div>
  {/each}
</div>
