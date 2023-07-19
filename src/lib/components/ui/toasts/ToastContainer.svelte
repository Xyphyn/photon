<script lang="ts">
  import Toast from '$lib/components/ui/toasts/Toast.svelte'
  import { flip } from 'svelte/animate'
  import { toasts } from '$lib/components/ui/toasts/toasts'
</script>

<div
  class="fixed right-0 bottom-0 flex flex-col items-end justify-end z-50 p-4
  group
  overflow-hidden h-screen min-w-[24rem] pointer-events-none"
>
  {#each $toasts as toast, index (toast.id)}
    <div
      animate:flip={{ duration: 300 }}
      class="pointer-events-auto -mt-8 transition-all group-hover:pt-12
      duration-300"
    >
      <Toast {toast} />
    </div>
  {/each}
</div>
