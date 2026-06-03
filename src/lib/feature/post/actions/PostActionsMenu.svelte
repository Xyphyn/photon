<script lang="ts">
  import { PiefedClient } from '$lib/api/piefed/adapter'
  import { profile } from '$lib/app/auth'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import { settings } from '$lib/app/settings.svelte'
  import { report } from '$lib/feature/moderation/moderation'
  import { MenuButton, toast } from 'mono-svelte'
  import {
    ArrowTopRightOnSquare,
    Eye,
    EyeSlash,
    Flag,
    PencilSquare,
    Trash,
    XMark,
  } from 'svelte-hero-icons/dist'
  import { type PostFormInit } from '../form/postform.svelte'
  import type { PostModel } from '../post.svelte'

  interface Props {
    post: PostModel
    onhide?: (hide: boolean) => void
    editing: boolean
  }

  let { post = $bindable(), onhide, editing = $bindable() }: Props = $props()

  function crosspostB64() {
    return JSON.stringify({
      body: `${settings.crosspostOriginalLink ? `cross-posted from: ${post.post.ap_id}` : ``}\n${
        post.post.body ? '>' + post.post.body.split('\n').join('\n> ') : ''
      }`,
      name: post.post.name,
      url: post.post.url,
      nsfw: post.post.nsfw,
    } as PostFormInit)
  }
</script>

{#if profile.current?.user && profile.current?.jwt && profile.current.user.local_user_view.person.id == post.creator.id}
  <MenuButton onclick={() => (editing = true)} icon={PencilSquare}>
    {$t('post.actions.more.edit')}
  </MenuButton>
{/if}
{#if profile.current?.jwt}
  <MenuButton onclick={() => post.markRead(!post.read)} icon={post.read ? EyeSlash : Eye}>
    {post.read ? $t('post.actions.more.markUnread') : $t('post.actions.more.markRead')}
  </MenuButton>
{/if}
{#if profile.current?.jwt}
  <MenuButton href="/create/post?crosspost={crosspostB64()}" icon={ArrowTopRightOnSquare}>
    {$t('post.actions.more.crosspost')}
  </MenuButton>
  {#if profile.current.user && post.creator.id == profile.current.user.local_user_view.person.id}
    <MenuButton onclick={post.delete} color="danger-subtle" icon={Trash}>
      {post.post.deleted ? $t('post.actions.more.restore') : $t('post.actions.more.delete')}
    </MenuButton>
  {/if}
  {#if profile.current.user?.local_user_view.person.id != post.creator.id}
    {#if !(profile.client instanceof PiefedClient)}
      <MenuButton
        onclick={async () => {
          post
            .hide()
            .then((r) => onhide?.(r.post_actions?.hidden_at != null))
            .catch((e) => toast({ content: errorMessage(e), type: 'error' }))
        }}
        color="danger-subtle"
        icon={XMark}
      >
        {post.hidden ? $t('post.actions.more.unhide') : $t('post.actions.more.hide')}
      </MenuButton>
    {/if}
    <MenuButton onclick={() => report(post)} color="danger-subtle" icon={Flag}>
      {$t('moderation.report')}
    </MenuButton>
  {/if}
{/if}
