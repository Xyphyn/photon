<script lang="ts">
  import { goto } from '$app/navigation'
  import { profile } from '$lib/auth.svelte'
  import TextProps from '$lib/components/ui/text/TextProps.svelte'
  import { t } from '$lib/i18n/translations'
  import { deleteItem, markAsRead } from '$lib/lemmy/contentview'
  import { communityLink, userLink } from '$lib/lemmy/generic'
  import { setSessionStorage } from '$lib/session'
  import { settings } from '$lib/settings.svelte'
  import { instanceToURL } from '$lib/util.svelte'
  import type { PostView } from 'lemmy-js-client'
  import { Button, MenuButton, MenuDivider, toast } from 'mono-svelte'
  import {
    ArrowTopRightOnSquare,
    Eye,
    EyeSlash,
    Flag,
    GlobeAmericas,
    Icon,
    MapPin,
    Newspaper,
    PencilSquare,
    Share,
    Trash,
    UserCircle,
    XMark,
  } from 'svelte-hero-icons'
  import { report } from '../../moderation/moderation'
  import { hidePost } from '../helpers'

  interface Props {
    post: PostView
    onhide?: (hide: boolean) => void
    editing: boolean
  }

  let localShare = $state(false)

  let { post, onhide, editing = $bindable() }: Props = $props()
</script>

<MenuDivider>{$t('post.actions.more.creator')}</MenuDivider>
<MenuButton link href={userLink(post.creator)}>
  {#snippet prefix()}
    <Icon src={UserCircle} size="16" micro class="shrink-0" />
  {/snippet}
  <TextProps wrap="no-wrap">
    {post.creator.name}
  </TextProps>
</MenuButton>
<MenuButton link href={communityLink(post.community)}>
  {#snippet prefix()}
    <Icon src={Newspaper} size="16" micro class="shrink-0" />
  {/snippet}
  <TextProps wrap="no-wrap">
    {post.community.title}
  </TextProps>
</MenuButton>
<MenuDivider>
  {$t('post.actions.more.actions')}
</MenuDivider>
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
<MenuButton
  onclick={() => {
    if (navigator.share)
      navigator.share?.({
        url: localShare
          ? `${instanceToURL(profile.current.instance)}/post/${post.post.id}`
          : post.post.ap_id,
      })
    else
      navigator.clipboard.writeText(
        localShare
          ? `${instanceToURL(profile.current.instance)}/post/${post.post.id}`
          : post.post.ap_id,
      )
    toast({ content: $t('toast.copied') })
  }}
  class="flex-1 py-0!"
>
  {#snippet prefix()}
    <Icon src={Share} size="16" micro />
  {/snippet}
  {$t('post.actions.more.share')}
  <div class="flex-1"></div>
  {#if !post.post.local}
    <div class="flex gap-1">
      <Button
        color={!localShare ? 'primary' : 'secondary'}
        size="square-sm"
        rounding="pill"
        onclick={() => (localShare = false)}
        title={$t('filter.location.global')}
      >
        <Icon src={GlobeAmericas} size="16" micro />
      </Button>
      <Button
        color={localShare ? 'primary' : 'secondary'}
        size="square-sm"
        rounding="pill"
        onclick={() => (localShare = true)}
        title={$t('filter.location.local')}
      >
        <Icon src={MapPin} size="16" micro />
      </Button>
    </div>
  {/if}
</MenuButton>
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
        <Icon src={Flag} width={16} micro />
      {/snippet}
      {$t('moderation.report')}
    </MenuButton>
  {/if}
{/if}
