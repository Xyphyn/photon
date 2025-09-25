<script lang="ts">
  import { Badge, Button, Menu, MenuButton } from 'mono-svelte'
  import {
    CheckCircle,
    ChevronUpDown,
    Icon,
    QuestionMarkCircle,
    UserGroup,
  } from 'svelte-hero-icons'
  import Avatar from '../Avatar.svelte'
  import { profile, type ProfileInfo } from '$lib/app/auth.svelte'
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { t } from '$lib/app/i18n'
  import { DEFAULT_CLIENT_TYPE } from '$lib/api/base'
  import { LINKED_INSTANCE_URL } from '$lib/app/instance.svelte'

  let { profiles }: { profiles: ProfileInfo[] } = $props()

  function switchTo(id: number) {
    profile.meta.profile = id

    goto(page.url, {
      invalidateAll: true,
    })
  }
</script>

<Menu placement="bottom">
  {#snippet target(attachment)}
    <Button
      {@attach attachment}
      color="tertiary"
      alignment="left"
      size="md"
      rounding="xl"
      class="flex flex-row gap-2! items-center"
      aria-label={$t('aria.sidebar.accounts')}
    >
      {#snippet prefix()}
        <Avatar
          url={profile.current.avatar}
          alt={profile.current.username}
          width={24}
        />
      {/snippet}
      <div class="flex-1">
        <div class="font-medium">{profile.current.username}</div>
        {#if !LINKED_INSTANCE_URL}
          <div class="text-xs text-slate-500 dark:text-zinc-500">
            <span class="capitalize">
              {profile.current.client?.name ?? DEFAULT_CLIENT_TYPE.name}
            </span>
            • {profile.current.instance}
          </div>
        {/if}
      </div>
      {#snippet suffix()}
        <Icon
          src={ChevronUpDown}
          size="16"
          micro
          class="block justify-self-end"
        />
      {/snippet}
    </Button>
  {/snippet}
  {#each profiles as p}
    {@const selected = profile.meta.profile == p.id}
    <MenuButton
      onclick={() => switchTo(p.id)}
      class={[selected && 'bg-slate-100! dark:bg-zinc-800!', 'gap-2!']}
    >
      {#snippet prefix()}
        <Avatar url={p.avatar} alt={p.username} width={24} />
      {/snippet}
      <div>
        <div class="font-medium text-sm">{p.username}</div>
        {#if !LINKED_INSTANCE_URL}
          <div class="text-xs text-slate-500 dark:text-zinc-500">
            <span class="capitalize">
              {p.client?.name ?? DEFAULT_CLIENT_TYPE.name}
            </span>
            • {p.instance}
          </div>
        {/if}
      </div>
      <div class="flex-1"></div>
      {#if !p.jwt}
        <Badge color="gray-subtle" class="p-1!">
          <Icon src={QuestionMarkCircle} size="16" micro />
        </Badge>
      {/if}
      {#if selected}
        <Icon
          src={CheckCircle}
          class="text-primary-900 dark:text-primary-100"
          size="16"
          micro
        />
      {/if}
    </MenuButton>
  {/each}
  <MenuButton href="/accounts" icon={UserGroup}>
    {$t('account.accounts')}
  </MenuButton>
</Menu>
