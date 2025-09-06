<script lang="ts">
  import { goto } from '$app/navigation'
  import { profile } from '$lib/auth.svelte'
  import { t } from '$lib/i18n/translations'
  import { deleteItem, markAsRead } from '$lib/lemmy/contentview'
  import { setSessionStorage } from '$lib/session'
  import { settings } from '$lib/settings.svelte'
  import { instanceToURL } from '$lib/util.svelte'
  import type { PostView } from '$lib/client/types'
  import { Button, Menu, MenuButton, toast } from 'mono-svelte'
  import {
    ArrowTopRightOnSquare,
    EllipsisHorizontal,
    Eye,
    EyeSlash,
    Flag,
    GlobeAlt,
    Icon,
    MapPin,
    PencilSquare,
    Share,
    Trash,
    XMark,
  } from 'svelte-hero-icons'
  import { report } from '../../moderation/moderation'
  import { hidePost } from '../helpers'

  interface Props {
    post: PostView
    onhide?: (hide: boolean) => void
    editing: boolean
  }

  let { post, onhide, editing = $bindable() }: Props = $props()

  function share(global: boolean = true) {
    const link = global
      ? post.post.ap_id
      : `${instanceToURL(profile.current.instance)}/post/${post.post.id}`

    if (navigator.share)
      navigator.share?.({
        url: link,
      })
    else {
      navigator.clipboard.writeText(link)
      toast({ content: $t('toast.copied') })
    }
  }
</script>

{#if profile.current?.user && profile.current?.jwt && profile.current.user.local_user_view.person.id == post.creator.id}
  <MenuButton onclick={() => (editing = true)}>
    {#snippet prefix()}
      <Icon src={PencilSquare} size="16" micro />
    {/snippet}
    {$t('post.actions.more.edit')}
  </MenuButton>
{/if}
{#if profile.current?.jwt}
  <MenuButton
    onclick={async () => {
      if (profile.current?.jwt)
        post.read = await markAsRead(post.post, !post.read)
    }}
  >
    {#snippet prefix()}
      <Icon src={post.read ? EyeSlash : Eye} size="16" micro />
    {/snippet}
    {post.read
      ? $t('post.actions.more.markUnread')
      : $t('post.actions.more.markRead')}
  </MenuButton>
{/if}
<div class="flex flex-row">
  <MenuButton
    onclick={() => share()}
    class={['flex-1', !post.post.local && 'rounded-r-lg']}
  >
    {#snippet prefix()}
      <Icon src={Share} size="16" micro />
    {/snippet}
    {$t('post.actions.more.share')}
  </MenuButton>
  {#if !post.post.local}
    <Menu>
      {#snippet target(attachment)}
        <Button
          {@attach attachment}
          aria-label={$t('post.actions.more.label')}
          color="tertiary"
          size="custom"
          class="w-6 h-6 self-center"
          data-autoclose="false"
        >
          {#snippet prefix()}
            <Icon
              src={EllipsisHorizontal}
              size="16"
              micro
              class="text-slate-600 dark:text-zinc-400"
            />
          {/snippet}
        </Button>
      {/snippet}
      <MenuButton onclick={() => share(true)}>
        {#snippet prefix()}
          <Icon src={GlobeAlt} size="16" micro />
        {/snippet}
        {$t('filter.location.global')}
      </MenuButton>
      <MenuButton onclick={() => share(false)}>
        {#snippet prefix()}
          <Icon src={MapPin} size="16" micro />
        {/snippet}
        {$t('filter.location.local')}
      </MenuButton>
    </Menu>
  {/if}
</div>
{#if profile.current?.jwt}
  <MenuButton
    onclick={() => {
      setSessionStorage('postDraft', {
        body: `${
          settings.crosspostOriginalLink
            ? `cross-posted from: ${post.post.ap_id}`
            : ``
        }\n${
          post.post.body ? '>' + post.post.body.split('\n').join('\n> ') : ''
        }`,
        url: post.post.url,
        title: post.post.name,
        loading: false,
        nsfw: post.post.nsfw,
        community: null,
        image: null,
      })

      goto('/create/post?crosspost=true')
    }}
  >
    {#snippet prefix()}
      <Icon src={ArrowTopRightOnSquare} size="16" micro />
    {/snippet}
    {$t('post.actions.more.crosspost')}
  </MenuButton>
  {#if profile.current.user && post.creator.id == profile.current.user.local_user_view.person.id}
    <MenuButton
      onclick={async () => {
        if (profile.current?.jwt)
          post.post.deleted = await deleteItem(post, !post.post.deleted)
      }}
      color="danger-subtle"
    >
      {#snippet prefix()}
        <Icon src={Trash} size="16" micro />
      {/snippet}
      {post.post.deleted
        ? $t('post.actions.more.restore')
        : $t('post.actions.more.delete')}
    </MenuButton>
  {/if}
  {#if profile.current.user?.local_user_view.person.id != post.creator.id}
    <MenuButton
      onclick={async () => {
        if (!profile.current?.jwt) return
        const hidden = await hidePost(
          post.post.id,
          !post.hidden,
          profile.current?.jwt,
        )
        post.hidden = hidden
        if (hidden) onhide?.(hidden)
      }}
      color="danger-subtle"
    >
      {#snippet prefix()}
        <Icon src={XMark} size="16" micro />
      {/snippet}
      {post.hidden
        ? $t('post.actions.more.unhide')
        : $t('post.actions.more.hide')}
    </MenuButton>
    <MenuButton onclick={() => report(post)} color="danger-subtle">
      {#snippet prefix()}
        <Icon src={Flag} size="16" micro />
      {/snippet}
      {$t('moderation.report')}
    </MenuButton>
  {/if}
{/if}
