<script lang="ts">
  import {
    ToastType,
    type Toast,
    toasts,
  } from '$lib/components/ui/toasts/toasts'
  import {
    InformationCircle,
    ExclamationTriangle,
    ExclamationCircle,
    CheckCircle,
    Icon,
    XMark,
  } from 'svelte-hero-icons'
  import { fly } from 'svelte/transition'

  export let toast: Toast
</script>

<div
  class="{toast.type} relative w-80 rounded-md overflow-hidden flex flex-row items-center"
  transition:fly={{
    duration: 300,
    y: 8,
    opacity: 0,
  }}
>
  <Icon
    size="20"
    solid
    class="relative m-2 ml-4 flex-shrink-0"
    src={toast.type == ToastType.info
      ? InformationCircle
      : toast.type == ToastType.success
      ? CheckCircle
      : toast.type == ToastType.warning
      ? ExclamationTriangle
      : toast.type == ToastType.error
      ? ExclamationCircle
      : ExclamationCircle}
  />
  <div class="flex flex-col p-4 pl-0 break-words max-w-full">
    {#if toast.title}
      <h1 class="text-base font-bold">{toast.title}</h1>
    {/if}
    <p class="text-sm">{toast.content}</p>
  </div>
  <button
    on:click={() => {
      toasts.update((toasts) => toasts.filter((t) => t.id != toast.id))
    }}
    class="rounded-lg ml-auto w-max transition-colors hover:bg-slate-200 hover:dark:bg-zinc-800 p-2 m-2"
  >
    <Icon src={XMark} size="16" mini />
  </button>
</div>
