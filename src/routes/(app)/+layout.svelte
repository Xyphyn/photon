<script>
  import Moderation from '$lib/components/lemmy/moderation/Moderation.svelte'

  import Navbar from '$lib/components/ui/Navbar.svelte'
  import Sidebar from '$lib/components/ui/sidebar/Sidebar.svelte'
  import ToastContainer from '$lib/components/ui/toasts/ToastContainer.svelte'
</script>

<div class="flex flex-col min-h-screen">
  <slot name="navbar">
    <Navbar />
  </slot>
  <ToastContainer />
  <Moderation />
  <div
    class="flex flex-row h-full w-full max-w-full sm:divide-x dark:divide-zinc-900
    divide-slate-200 flex-1"
  >
    <Sidebar />
    <main
      class="p-3 lg:p-6 min-w-0 w-full flex-[3] sm:rounded-tl-lg
      border-slate-200 dark:border-zinc-900 border-t"
    >
      <slot />
    </main>
  </div>
</div>
