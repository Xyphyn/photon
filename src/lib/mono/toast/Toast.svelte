<script lang="ts">
  import { Spinner } from '../index.js'
  import { expoOut } from 'svelte/easing'
  import { type Toast, toasts, toastColors } from './toasts.js'
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
  import Markdown from '$lib/components/markdown/Markdown.svelte'

  interface Props {
    toast: Toast
  }

  let { toast }: Props = $props()
</script>

<div
  class={[
    toastColors[toast.type],
    'relative rounded-2xl overflow-hidden flex flex-row items-center gap-2 px-3 py-3 backdrop-blur-lg',
    toast.long ? 'w-full max-w-lg' : 'w-80',
  ]}
  transition:fly={{
    duration: 600,
    y: 8,
    opacity: 0,
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
      class={[
        'relative self-center shrink-0 p-1 rounded-full',
        toast.type == 'info'
          ? 'bg-slate-200 dark:bg-zinc-50 text-slate-700 dark:text-zinc-700'
          : toast.type == 'success'
            ? 'bg-green-400 dark:bg-green-300 dark:text-green-900 text-green-50'
            : toast.type == 'warning'
              ? 'bg-yellow-400 dark:bg-yellow-300 dark:text-yellow-900 text-yellow-50'
              : 'bg-red-400 dark:bg-red-300 dark:text-red-900 text-red-50',
      ]}
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
  <div
    class="flex flex-col break-words max-w-full text-slate-900 dark:text-zinc-50"
  >
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
          toasts.update(toasts => toasts.filter(t => t.id != toast.id))
        }}
        class="rounded-lg w-max transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800 p-1 cursor-pointer"
      >
        <Icon src={Check} size="20" micro />
      </button>
    {/if}
    <button
      onclick={() => {
        toasts.update(toasts => toasts.filter(t => t.id != toast.id))
      }}
      class="rounded-lg w-max transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800 p-1 cursor-pointer"
    >
      <Icon src={XMark} size="20" micro />
    </button>
  </div>
</div>
