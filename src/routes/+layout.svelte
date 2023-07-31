<script lang="ts">
  import Navbar from '$lib/components/ui/Navbar.svelte'
  import '../style/app.css'
  import { navigating } from '$app/stores'
  import nProgress from 'nprogress'
  import 'nprogress/nprogress.css'
  import ToastContainer from '$lib/components/ui/toasts/ToastContainer.svelte'
  import Moderation from '$lib/components/lemmy/moderation/Moderation.svelte'
  import { userSettings } from '$lib/settings.js'
  import { user } from '$lib/lemmy.js'
  import Button from '$lib/components/input/Button.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { Home, Icon } from 'svelte-hero-icons'

  nProgress.configure({
    minimum: 0.4,
    trickleSpeed: 200,
    showSpinner: false,
  })

  $: {
    if ($navigating) {
      if (typeof document != 'undefined') {
        nProgress.start()
        document?.documentElement?.classList?.toggle('wait', true)
      }
    }
    if (!$navigating) {
      if (typeof document != 'undefined') {
        nProgress.done()
        document?.documentElement?.classList?.toggle('wait', false)
      }
    }
  }
</script>

<div class="flex flex-col">
  <Navbar />
  <ToastContainer />
  <Moderation />
  <div
    class="flex flex-row w-full max-w-full gap-4 divide-x dark:divide-zinc-800 divide-slate-200 flex-1"
  >
    <nav
      class="hidden lg:flex flex-col p-4 overflow-auto sticky top-16 bottom-0 flex-1 gap-1 max-h-[calc(100vh-4rem)]"
    >
      <Button href="/" color="tertiary" alignment="left">
        <Icon src={Home} solid size="20" />
        Frontpage
      </Button>
      {#if $user}
        {#each $user.follows.map((f) => f.community) as follow}
          <Button
            color="tertiary"
            alignment="left"
            href="/c/{follow.name}@{new URL(follow.actor_id).hostname}"
          >
            <Avatar
              url={follow.icon}
              alt={follow.name}
              width={20}
              slot="icon"
            />
            {follow.title}
          </Button>
        {/each}
      {/if}
    </nav>
    <main class="p-4 mx-auto flex-[4]">
      <slot />
    </main>
  </div>
</div>
