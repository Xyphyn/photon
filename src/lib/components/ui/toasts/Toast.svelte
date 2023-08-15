<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import Spinner from '$lib/components/ui/loader/Spinner.svelte'
  import {
    type Toast,
    toasts,
    toastColors,
  } from '$lib/components/ui/toasts/toasts'
  import {
    InformationCircle,
    ExclamationTriangle,
    ExclamationCircle,
    CheckCircle,
    Icon,
    XMark,
    Check,
  } from 'svelte-hero-icons'
  import { fly } from 'svelte/transition'

  export let toast: Toast
</script>

<div
  class="{toastColors[
    toast.type
  ]} relative w-80 rounded-md overflow-hidden flex flex-row items-center"
  transition:fly={{
    duration: 300,
    y: 8,
    opacity: 0,
  }}
>
  {#if toast.loading}
    <div class="relative m-2 ml-4 flex-shrink-0">
      <Spinner width={20} />
    </div>
  {:else}
    <Icon
      size="20"
      mini
      class="relative m-2 ml-4 flex-shrink-0"
      src={toast.type == 'info'
        ? InformationCircle
        : toast.type == 'success'
        ? CheckCircle
        : toast.type == 'warning'
        ? ExclamationTriangle
        : toast.type == 'error'
        ? ExclamationCircle
        : ExclamationCircle}
    />
  {/if}
  <div class="flex flex-col p-4 pl-0 break-words max-w-full">
    {#if toast.title}
      <h1 class="text-base font-bold">{toast.title}</h1>
    {/if}
    <p class="text-sm">{toast.content}</p>
  </div>
  <div class="ml-auto flex items-center gap-2 m-2">
    {#if toast.action}
      <button
        on:click={() => {
          toast.action?.()
          toasts.update((toasts) => toasts.filter((t) => t.id != toast.id))
        }}
        class="rounded-lg w-max transition-colors hover:bg-black/20 hover:dark:bg-white/20 p-2"
      >
        <Icon src={Check} size="16" mini />
      </button>
    {/if}
    <button
      on:click={() => {
        toasts.update((toasts) => toasts.filter((t) => t.id != toast.id))
      }}
      class="rounded-lg w-max transition-colors hover:bg-black/20 hover:dark:bg-white/20 p-2"
    >
      <Icon src={XMark} size="16" mini />
    </button>
  </div>
</div>
