<script lang="ts">
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import StickyCard from '$lib/components/ui/StickyCard.svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import {
    AdjustmentsHorizontal,
    Bars3BottomRight,
    Calendar,
    ChartBar,
    ChatBubbleOvalLeftEllipsis,
    EllipsisHorizontal,
    Envelope,
    Fire,
    Icon,
    NoSymbol,
    PencilSquare,
    ShieldCheck,
    ShieldExclamation,
  } from 'svelte-hero-icons'
  import CommentItem from '$lib/components/lemmy/comment/CommentItem.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { isCommentView } from '$lib/lemmy/item.js'
  import { client, getClient } from '$lib/lemmy.js'
  import { isBlocked } from '$lib/lemmy/user.js'
  import { Menu, MenuButton, Popover, removeToast, toast } from 'mono-svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import { profile } from '$lib/auth.js'
  import { ban, isAdmin } from '$lib/components/lemmy/moderation/moderation.js'
  import ShieldIcon from '$lib/components/lemmy/moderation/ShieldIcon.svelte'
  import { searchParam } from '$lib/util.js'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { Button, Modal, Select } from 'mono-svelte'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import PrivateMessageModal from '$lib/components/lemmy/modal/PrivateMessageModal.svelte'

  export let data

  let blocking = false

  async function blockUser(block: number) {
    if (!$profile?.user || !$profile?.jwt) throw new Error('Unauthenticated')

    blocking = true
    try {
      const blocked = isBlocked($profile.user, block)

      await getClient().blockPerson({
        block: !blocked,
        person_id: block,
      })

      if (blocked) {
        const index = $profile.user.person_blocks
          .map((p) => p.target.id)
          .indexOf(block)
        $profile.user.person_blocks.splice(index, 1)
      }

      toast({
        content: `Successfully ${blocked ? 'unblocked' : 'blocked'} that user.`,
        type: 'success',
      })

      goto($page.url, {
        invalidateAll: true,
      })
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    }
    blocking = false
  }

  let messaging = false

  let purgingUser = false
  let purgeEnabled = false
  $: if (purgingUser) {
    purgeEnabled = false
    setTimeout(() => {
      purgeEnabled = true
    }, 3000)
  }

  async function purgeUser() {
    purgingUser = false
    const purgeToast = toast({ content: 'Purging user...', loading: true })

    try {
      await client().purgePerson({
        person_id: data.person_view.person.id,
      })
      removeToast(purgeToast)
      toast({ content: 'Purged that user.', type: 'success' })
    } catch (e) {
      toast({ content: e as any, type: 'error' })
    }
  }
</script>

<svelte:head>
  <title>{data.person_view.person.name}</title>
</svelte:head>

{#if $profile?.user}
  <PrivateMessageModal
    bind:user={data.person_view.person}
    bind:open={messaging}
  />
{/if}

{#if purgingUser}
  <Modal bind:open={purgingUser}>
    <svelte:fragment slot="title">Purging User</svelte:fragment>
    <p>
      Purging user <span class="font-bold">
        {data.person_view.person.name}
      </span>
    </p>
    <p>
      Are you sure you want to do this? (The button will enable in 3 seconds.)
    </p>
    <div class="flex flex-row gap-2">
      <Button size="lg" on:click={() => (purgingUser = false)} class="flex-1">
        Cancel
      </Button>
      <Button
        size="lg"
        color="danger"
        on:click={purgeUser}
        disabled={!purgeEnabled}
        class="flex-1"
      >
        Purge
      </Button>
    </div>
  </Modal>
{/if}

<div class="flex flex-col-reverse gap-4 max-w-full w-full">
  <div class="flex flex-col gap-4 max-w-full w-full min-w-0">
    <div class="flex flex-row gap-4 flex-wrap justify-between">
      <Select
        bind:value={data.sort}
        on:change={() => searchParam($page.url, 'sort', data.sort, 'page')}
      >
        <span slot="label" class="flex items-center gap-1">
          <Icon src={ChartBar} size="14" mini />
          Sort
        </span>
        <option value="New">New</option>
        <option value="TopAll">Top</option>
        <option value="Old">Old</option>
      </Select>
      <Select
        bind:value={data.type}
        on:change={() => searchParam($page.url, 'type', data.type, 'page')}
      >
        <span slot="label" class="flex items-center gap-1">
          <Icon src={AdjustmentsHorizontal} size="15" mini />
          Type
        </span>
        <option value="all">All</option>
        <option value="posts">Posts</option>
        <option value="comments">Comments</option>
      </Select>
    </div>
    {#if data.items.length == 0}
      <Placeholder
        icon={PencilSquare}
        title="No submissions"
        description="This user has no submissions that match this filter."
      />
    {:else}
      <div
        class="!divide-y divide-slate-200 dark:divide-zinc-800 flex flex-col"
      >
        {#each data.items as item}
          {#if isCommentView(item) && (data.type == 'all' || data.type == 'comments')}
            <CommentItem comment={item} />
          {:else if !isCommentView(item) && (data.type == 'all' || data.type == 'posts')}
            <Post post={item} />
          {/if}
        {/each}
      </div>
    {/if}
    <Pageination
      page={data.page}
      on:change={(p) => searchParam($page.url, 'page', p.detail.toString())}
    />
  </div>

  <StickyCard class="px-0">
    <Avatar
      width={64}
      url={data.person_view.person.avatar}
      alt={data.person_view.person.name}
    />
    <span class="flex flex-row items-center gap-1 text-sm">
      <Icon src={Calendar} width={16} height={16} mini />
      <span class="capitalize">
        <RelativeDate
          date={publishedToDate(data.person_view.person.published)}
        />
      </span>
    </span>
    <div class="text-sm flex flex-row flex-wrap gap-3">
      <span class="flex flex-row items-center gap-1">
        <Icon src={PencilSquare} width={16} height={16} mini />
        <FormattedNumber number={data.person_view.counts.post_count} />
      </span>
      <span class="flex flex-row items-center gap-1">
        <Icon src={ChatBubbleOvalLeftEllipsis} width={16} height={16} mini />
        <FormattedNumber number={data.person_view.counts.comment_count} />
      </span>
    </div>
    {#if (data.moderates ?? []).length > 0}
      <div class="flex flex-col gap-2 max-w-full">
        <span class="font-bold">Moderates</span>
        <div
          class="flex items-center -space-x-1 flex-wrap hover:space-x-1 transition-all
    cursor-pointer"
        >
          {#each data.moderates as moderator}
            <Popover openOnHover placement="top" class="transition-all">
              <a
                class="block ring rounded-full ring-slate-50 dark:ring-zinc-950 transition-all"
                href="/c/{moderator.community.name}@{new URL(
                  moderator.community.actor_id
                ).hostname}"
                slot="target"
              >
                <Avatar
                  width={28}
                  url={moderator.community.icon}
                  alt={moderator.community.title}
                />
              </a>
              <span class="font-bold">{moderator.community.title}</span>
            </Popover>
          {/each}
        </div>
      </div>
    {/if}
    {#if $profile?.user && $profile.jwt && data.person_view.person.id != $profile.user.local_user_view.person.id}
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2 w-full">
          <Button
            size="lg"
            color="secondary"
            on:click={() => (messaging = true)}
            class="flex-1"
          >
            <Icon slot="prefix" solid size="16" src={Envelope} />
            Message
          </Button>
          {#if data.person_view.person.matrix_user_id}
            <Button
              size="lg"
              color="secondary"
              href="https://matrix.to/#/{data.person_view.person
                .matrix_user_id}"
              class="flex-1"
            >
              <Icon slot="prefix" solid size="16" src={ShieldCheck} />
              Matrix User
            </Button>
          {/if}
        </div>
        <div class="flex flex-row gap-2 ml-auto">
          {#if isAdmin($profile?.user)}
            <Menu class="ml-auto" placement="bottom-end">
              <Button size="square-md" slot="target">
                <ShieldIcon width={16} filled />
              </Button>
              <MenuButton
                color="danger-subtle"
                on:click={() =>
                  ban(data.person_view.person.banned, data.person_view.person)}
              >
                <Icon slot="prefix" mini size="16" src={ShieldExclamation} />
                {data.person_view.person.banned ? 'Unban' : 'Ban'}
              </MenuButton>
              <MenuButton
                color="danger-subtle"
                on:click={() => (purgingUser = !purgingUser)}
              >
                <Icon slot="prefix" mini size="16" src={Fire} />
                Purge
              </MenuButton>
            </Menu>
          {/if}
          <Menu placement="bottom-end">
            <Button size="square-md" slot="target">
              <Icon src={EllipsisHorizontal} slot="prefix" size="16" mini />
            </Button>
            <MenuButton
              color="danger-subtle"
              on:click={() => blockUser(data.person_view.person.id)}
            >
              <Icon slot="prefix" mini size="16" src={NoSymbol} />
              {isBlocked($profile.user, data.person_view.person.id)
                ? 'Unblock'
                : 'Block'}
            </MenuButton>
          </Menu>
        </div>
      </div>
    {/if}
    <div>
      <h1 class="font-bold text-lg">
        <UserLink badges user={data.person_view.person} />
      </h1>
      <span>{new URL(data.person_view.person.actor_id).hostname}</span>
    </div>
    {#if data.person_view.person.bio}
      <Markdown source={data.person_view.person.bio} />
    {/if}
  </StickyCard>
</div>
