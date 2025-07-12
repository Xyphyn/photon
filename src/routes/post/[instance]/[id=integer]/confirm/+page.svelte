<script lang="ts">
  import { goto } from '$app/navigation'
  import { resolveRoute } from '$app/paths'
  import { page } from '$app/state'
  import { profile } from '$lib/auth.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import ProfileButton from '$lib/components/ui/sidebar/ProfileButton.svelte'
  import SidebarButton from '$lib/components/ui/sidebar/SidebarButton.svelte'
  import { client } from '$lib/lemmy.svelte'
  import { errorMessage } from '$lib/lemmy/error'
  import { t } from '$lib/i18n/translations'
  import { toast } from 'mono-svelte'
  import Button from 'mono-svelte/button/Button.svelte'
  import Material from 'mono-svelte/materials/Material.svelte'
  import { Plus } from 'svelte-hero-icons'

  let loading = $state(false)
  const fetched = $state.snapshot(profile.current.instance)

  async function fetchOnHome() {
    loading = true
    try {
      const res = await client().resolveObject({
        q: `https://${page.params.instance}/post/${page.params.id}`,
      })

      if (res.post) {
        goto(
          resolveRoute(`/post/[instance]/[id]`, {
            instance: profile.current.instance,
            id: res.post.post.id.toString(),
          }),
        )
      }
    } catch (err) {
      toast({ content: errorMessage(err), type: 'error' })
    }
    loading = false
  }
</script>

<div class="w-full h-full flex flex-col justify-center mx-auto max-w-xl gap-6">
  <header class="space-y-1">
    <div
      class="font-mono bg-slate-100 dark:bg-zinc-950 rounded-xs p-0.5 px-1 w-max"
    >
      {page.params.instance}/post/{page.params.id}
    </div>
    <Header>
      {$t('routes.postRedirect.title')}
    </Header>
    <p>
      {$t('routes.postRedirect.description', {
        homeInstance: fetched,
      })}
    </p>
  </header>
  <div class="flex flex-row items-center gap-2 flex-wrap">
    {#if profile.current.jwt}
      <Button
        {loading}
        disabled={loading}
        size="md"
        rounding="pill"
        color="primary"
        onclick={fetchOnHome}
      >
        {$t('routes.postRedirect.actions.fetch', {
          homeInstance: fetched,
        })}
      </Button>
    {/if}
    <Button size="md" rounding="pill" onclick={() => history.back()}>
      {$t('routes.postRedirect.actions.back')}
    </Button>
  </div>
  {#if profile.meta.profiles}
    {@const filtered = profile.meta.profiles.filter(
      i => i.instance == page.params.instance,
    )}
    <div class="space-y-1">
      <div class="font-medium text-sm">
        {$t('routes.postRedirect.actions.switch', {
          destInstance: page.params.instance,
        })}
      </div>
      <Material
        color="uniform"
        padding="sm"
        rounding="2xl"
        class="dark:bg-zinc-950 max-h-96 overflow-auto"
      >
        {#each filtered as profile, index (profile.id)}
          <ProfileButton prof={profile} {index} />
        {/each}
        <SidebarButton
          href="/accounts/login/guest?redirect={page.url}"
          icon={Plus}
          class="rounded-lg"
        >
          {$t('account.addGuest')}
        </SidebarButton>
      </Material>
    </div>
  {/if}
</div>
