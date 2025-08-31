<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { profile } from '$lib/auth.svelte.js'
  import CommentItem from '$lib/components/lemmy/comment/CommentItem.svelte'
  import Sort from '$lib/components/lemmy/dropdowns/Sort.svelte'
  import ItemList from '$lib/components/lemmy/generic/ItemList.svelte'
  import { ban, isAdmin } from '$lib/components/lemmy/moderation/moderation.js'
  import ShieldIcon from '$lib/components/lemmy/moderation/ShieldIcon.svelte'
  import PostItem from '$lib/components/lemmy/post/PostItem.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import EntityHeader from '$lib/components/ui/EntityHeader.svelte'
  import Expandable from '$lib/components/ui/Expandable.svelte'
  import CommonList from '$lib/components/ui/layout/CommonList.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import { formatRelativeDate } from '$lib/components/util/RelativeDate.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { client, getClient } from '$lib/lemmy.svelte.js'
  import { communityLink } from '$lib/lemmy/generic.js'
  import { isCommentView } from '$lib/lemmy/item.js'
  import { isBlocked } from '$lib/lemmy/user.js'
  import {
    Button,
    Menu,
    MenuButton,
    Modal,
    Option,
    removeToast,
    Select,
    toast,
  } from 'mono-svelte'
  import {
    AdjustmentsHorizontal,
    AtSymbol,
    EllipsisHorizontal,
    Envelope,
    Fire,
    Icon,
    Newspaper,
    NoSymbol,
    PencilSquare,
    ShieldExclamation,
  } from 'svelte-hero-icons'
  import type { PageData } from './$types'

  interface Props {
    data: PageData
    inline?: boolean
  }

  let { data, inline = false }: Props = $props()

  let sortForm = $state<HTMLFormElement>()

  async function blockUser(block: number) {
    if (!profile.current?.user || !profile.current?.jwt)
      throw new Error('Unauthenticated')

    try {
      const blocked = isBlocked(profile.current.user, block)

      await getClient().blockPerson({
        block: !blocked,
        person_id: block,
      })

      if (blocked) {
        const index = profile.current.user.person_blocks
          .map(p => p.target.id)
          .indexOf(block)
        profile.current.user.person_blocks.splice(index, 1)
      }

      toast({
        content: blocked ? $t('toast.unblockUser') : $t('toast.blockUser'),
        type: 'success',
      })

      goto(page.url, {
        invalidateAll: true,
      })
    } catch (err) {
      toast({
        content: err as string,
        type: 'error',
      })
    }
  }

  let purgingUser = $state(false)
  let purgeEnabled = $state(false)
  $effect(() => {
    if (purgingUser) {
      purgeEnabled = false
      setTimeout(() => {
        purgeEnabled = true
      }, 3000)
    }
  })

  async function purgeUser() {
    purgingUser = false
    const purgeToast = toast({ content: '', loading: true })

    try {
      await client().purgePerson({
        person_id: data.person_view.value.person.id,
      })
      removeToast(purgeToast)
      toast({ content: $t('toast.purgeUser'), type: 'success' })
    } catch (e) {
      toast({ content: e as string, type: 'error' })
    }
  }
</script>

<svelte:head>
  <title>{data.person_view.value.person.name}</title>
</svelte:head>

{#if purgingUser}
  <Modal bind:open={purgingUser}>
    {#snippet customTitle()}
      Purging User
    {/snippet}
    <p>
      Purging user <span class="font-bold">
        {data.person_view.value.person.name}
      </span>
    </p>
    <p>
      Are you sure you want to do this? (The button will enable in 3 seconds.)
    </p>
    <div class="flex flex-row gap-2">
      <Button size="lg" onclick={() => (purgingUser = false)} class="flex-1">
        Cancel
      </Button>
      <Button
        size="lg"
        color="danger"
        onclick={purgeUser}
        disabled={!purgeEnabled}
        class="flex-1"
      >
        Purge
      </Button>
    </div>
  </Modal>
{/if}

<div class="flex flex-col gap-4 max-w-full w-full">
  {#if !inline}
    <Header pageHeader class="tracking-normal!">
      <div class="w-full">
        <EntityHeader
          avatarCircle
          avatar={data.person_view.value.person.avatar}
          name={data.person_view.value.person.display_name ||
            data.person_view.value.person.name}
          banner={data.person_view.value.person.banner}
          bio={data.person_view.value.person.bio}
          stats={[
            {
              name: $t('content.posts'),
              value: data.person_view.value.counts.post_count.toString(),
            },
            {
              name: $t('content.comments'),
              value: data.person_view.value.counts.comment_count.toString(),
            },
            {
              name: $t('stats.joined'),
              value: formatRelativeDate(
                publishedToDate(data.person_view.value.person.published),
                { style: 'short' },
              ).toString(),
              format: false,
            },
          ]}
        >
          {#snippet nameDetail()}
            <span class="text-sm flex gap-0 items-center w-max">
              @
              <UserLink
                showInstance
                user={data.person_view.value.person}
                displayName={false}
                class="font-normal"
              />
            </span>
          {/snippet}
          {#if (data.moderates.value ?? []).length > 0}
            <Expandable class="">
              {#snippet title()}
                {$t('routes.profile.moderates')}
                <hr
                  class="flex-1 w-full border-slate-200 dark:border-zinc-800 mx-3"
                />
              {/snippet}
              <ItemList
                items={data.moderates.value.map(m => ({
                  id: m.community.id,
                  name: m.community.title,
                  url: communityLink(m.community),
                  avatar: m.community.icon,
                  instance: new URL(m.community.actor_id).hostname,
                }))}
              />
            </Expandable>
          {/if}
          {#snippet actions()}
            {#if profile.current?.user && profile.current.jwt && data.person_view.value.person.id != profile.current.user.local_user_view.person.id}
              <div class="flex items-center gap-2 w-full flex-wrap">
                <Button
                  size="sm"
                  rounding="pill"
                  color="primary"
                  href="/inbox/messages/{data.person_view.value.person.id}"
                >
                  {#snippet prefix()}
                    <Icon micro size="16" src={Envelope} />
                  {/snippet}
                  {$t('content.message')}
                </Button>
                {#if data.person_view.value.person.matrix_user_id}
                  <Button
                    size="sm"
                    rounding="pill"
                    color="secondary"
                    href="https://matrix.to/#/{data.person_view.value.person
                      .matrix_user_id}"
                  >
                    {#snippet prefix()}
                      <Icon solid size="16" src={AtSymbol} />
                    {/snippet}
                    {$t('form.profile.matrix')}
                  </Button>
                {/if}
                {#if isAdmin(profile.current?.user)}
                  <Menu class="ml-auto" placement="bottom-end">
                    {#snippet target(attachment)}
                      <Button {@attach attachment} size="sm" rounding="pill">
                        <ShieldIcon width={16} filled />
                        {$t('moderation.label')}
                      </Button>
                    {/snippet}
                    <MenuButton
                      href="/modlog?user={data.person_view.value.person.id}"
                      color="success-subtle"
                    >
                      <Icon src={Newspaper} size="16" micro />
                      {$t('moderation.modlog.user')}
                    </MenuButton>
                    <MenuButton
                      color="danger-subtle"
                      onclick={() =>
                        ban(
                          data.person_view.value.person.banned,
                          data.person_view.value.person,
                        )}
                    >
                      {#snippet prefix()}
                        <Icon mini size="16" src={ShieldExclamation} />
                      {/snippet}
                      {data.person_view.value.person.banned ? 'Unban' : 'Ban'}
                    </MenuButton>
                    <MenuButton
                      color="danger-subtle"
                      onclick={() => (purgingUser = !purgingUser)}
                    >
                      {#snippet prefix()}
                        <Icon mini size="16" src={Fire} />
                      {/snippet}
                      Purge
                    </MenuButton>
                  </Menu>
                {/if}
                <Menu placement="bottom-end">
                  {#snippet target(attachment)}
                    <Button {@attach attachment} size="custom" class="h-8 w-8" rounding="pill">
                      {#snippet prefix()}
                        <Icon src={EllipsisHorizontal} size="16" mini />
                      {/snippet}
                    </Button>
                  {/snippet}
                  <MenuButton
                    color="danger-subtle"
                    onclick={() => blockUser(data.person_view.value.person.id)}
                  >
                    {#snippet prefix()}
                      <Icon mini size="16" src={NoSymbol} />
                    {/snippet}
                    {isBlocked(
                      profile.current.user,
                      data.person_view.value.person.id,
                    )
                      ? 'Unblock'
                      : 'Block'}
                  </MenuButton>
                </Menu>
              </div>
            {/if}
          {/snippet}
        </EntityHeader>
      </div>
      {#snippet extended()}
        <div class="flex flex-col gap-4 max-w-full w-full min-w-0">
          <form
            action={page.url.origin + page.url.pathname}
            method="GET"
            class="flex flex-row gap-4 flex-wrap"
            bind:this={sortForm}
          >
            <Select
              bind:value={data.filters.value.type}
              name="type"
              onchange={() => sortForm?.requestSubmit()}
            >
              {#snippet customLabel()}
                <span class="flex items-center gap-1">
                  <Icon src={AdjustmentsHorizontal} size="15" mini />
                  {$t('filter.type')}
                </span>
              {/snippet}
              <Option value="all">{$t('content.all')}</Option>
              <Option value="posts">{$t('content.posts')}</Option>
              <Option value="comments">{$t('content.comments')}</Option>
            </Select>
            <Sort
              bind:selected={data.filters.value.sort}
              onchange={() => sortForm?.requestSubmit()}
            />
          </form>
        </div>
      {/snippet}
    </Header>
  {/if}

  {#if data.items.value.length == 0}
    <Placeholder
      icon={PencilSquare}
      title="No submissions"
      description="This user has no submissions that match this filter."
    />
  {:else}
    <CommonList items={data.items.value}>
      {#snippet item(item)}
        {#if isCommentView(item)}
          <CommentItem comment={item} />
        {:else if !isCommentView(item)}
          <PostItem post={item} />
        {/if}
      {/snippet}
    </CommonList>
  {/if}
  <Pageination
    bind:page={data.filters.value.page}
    href={page => `?page=${page}`}
  />
</div>
