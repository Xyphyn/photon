<script lang="ts">
  import { goto } from '$app/navigation'
  import { profile } from '$lib/auth.svelte'
  import { client } from '$lib/client/lemmy.svelte'
  import { PiefedClient } from '$lib/client/piefed/piefed'
  import type { PostView } from '$lib/client/types'
  import { t } from '$lib/i18n/translations'
  import { deleteItem, markAsRead } from '$lib/lemmy/contentview'
  import { setSessionStorage } from '$lib/session'
  import { settings } from '$lib/settings.svelte'
  import { instanceToURL } from '$lib/util.svelte'
  import { Button, Menu, MenuButton, toast } from 'mono-svelte'
  import {
    ArrowTopRightOnSquare,
    EllipsisHorizontal,
    Eye,
    EyeSlash,
    Flag,
    GlobeAlt,
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
  <MenuButton onclick={() => (editing = true)} icon={PencilSquare}>
    {$t('post.actions.more.edit')}
  </MenuButton>
{/if}
{#if profile.current?.jwt}
  <MenuButton
    onclick={async () => {
      if (profile.current?.jwt)
        post.read = await markAsRead(post.post, !post.read)
    }}
    icon={post.read ? EyeSlash : Eye}
  >
    {post.read
      ? $t('post.actions.more.markUnread')
      : $t('post.actions.more.markRead')}
  </MenuButton>
{/if}
<div class="flex flex-row">
  <MenuButton
    onclick={() => share()}
    class={['flex-1', !post.post.local && 'rounded-r-lg']}
    icon={Share}
  >
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
          icon={EllipsisHorizontal}
        ></Button>
      {/snippet}
      <MenuButton onclick={() => share(true)} icon={GlobeAlt}>
        {$t('filter.location.global')}
      </MenuButton>
      <MenuButton onclick={() => share(false)} icon={MapPin}>
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
    icon={ArrowTopRightOnSquare}
  >
    {$t('post.actions.more.crosspost')}
  </MenuButton>
  {#if profile.current.user && post.creator.id == profile.current.user.local_user_view.person.id}
    <MenuButton
      onclick={async () => {
        if (profile.current?.jwt)
          post.post.deleted = await deleteItem(post, !post.post.deleted)
      }}
      color="danger-subtle"
      icon={Trash}
    >
      {post.post.deleted
        ? $t('post.actions.more.restore')
        : $t('post.actions.more.delete')}
    </MenuButton>
  {/if}
  {#if profile.current.user?.local_user_view.person.id != post.creator.id}
    {#if !(client() instanceof PiefedClient)}
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
        icon={XMark}
      >
        {post.hidden
          ? $t('post.actions.more.unhide')
          : $t('post.actions.more.hide')}
      </MenuButton>
    {/if}
    <MenuButton onclick={() => report(post)} color="danger-subtle" icon={Flag}>
      {$t('moderation.report')}
    </MenuButton>
  {/if}
{/if}
