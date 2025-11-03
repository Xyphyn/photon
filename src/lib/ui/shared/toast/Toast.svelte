<script lang="ts">
  import Markdown from '$lib/app/markdown/Markdown.svelte'
  import { Spinner } from 'mono-svelte'
  import {
    Check,
    CheckCircle,
    ExclamationCircle,
    ExclamationTriangle,
    Icon,
    InformationCircle,
    XMark,
  } from 'svelte-hero-icons/dist'
  import { expoOut } from 'svelte/easing'
  import { fly, scale } from 'svelte/transition'
  import { type Toast, toastColors, toasts } from './toasts'

  interface Props {
    toast: Toast
  }

  let { toast }: Props = $props()
</script>

<div
  class={[
    toastColors[toast.type],
    'relative rounded-2xl overflow-hidden flex flex-row items-center gap-1 px-2 py-2 backdrop-blur-xl',
    'bg-white dark:bg-zinc-925 shadow-lg',
    toast.long ? 'w-full max-w-lg' : 'w-80',
  ]}
  in:fly={{
    y: 8,
    easing: expoOut,
  }}
  out:scale={{
    start: 0.97,
    easing: expoOut,
  }}
>
  {#if toast.loading}
    <div class="relative m-2 ml-4 shrink-0">
      <Spinner width={20} />
    </div>
  {:else}
    <Icon
      size="28"
      mini
      class={['relative self-center shrink-0 p-1 rounded-lg']}
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
  <div class="flex flex-col break-words max-w-full text-inherit">
    {#if toast.title}
      <h1 class="text-base font-semibold">{toast.title}</h1>
    {/if}
    <Markdown
      source={toast.content}
      class={toast.long ? 'text-[15px]' : 'text-sm font-medium'}
    />
  </div>
  <div class="absolute top-0 right-0 flex items-center gap-1 m-1">
    {#if toast.action}
      <button
        onclick={() => {
          toast.action?.()
          toasts.update((toasts) => toasts.filter((t) => t.id != toast.id))
        }}
        class="rounded-lg w-max transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800 p-1 cursor-pointer"
      >
        <Icon src={Check} size="20" micro />
      </button>
    {/if}
    <button
      onclick={() => {
        toasts.update((toasts) => toasts.filter((t) => t.id != toast.id))
      }}
      class="rounded-lg w-max transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800 p-1 cursor-pointer text-slate-600 dark:text-zinc-400"
    >
      <Icon src={XMark} size="16" micro />
    </button>
  </div>
</div>
