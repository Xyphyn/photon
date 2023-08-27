<script lang="ts">
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import StickyCard from '$lib/components/ui/StickyCard.svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import {
    Calendar,
    ChatBubbleOvalLeftEllipsis,
    Envelope,
    Icon,
    NoSymbol,
    PencilSquare,
    ShieldCheck,
    ShieldExclamation,
    UserPlus,
  } from 'svelte-hero-icons'
  import Button from '$lib/components/input/Button.svelte'
  import CommentItem from '$lib/components/lemmy/comment/CommentItem.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { isCommentView } from '$lib/lemmy/item.js'
  import { getClient } from '$lib/lemmy.js'
  import { isBlocked } from '$lib/lemmy/user.js'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import Modal from '$lib/components/ui/modal/Modal.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import TextArea from '$lib/components/input/TextArea.svelte'
  import { profile } from '$lib/auth.js'
  import { ban, isAdmin } from '$lib/components/lemmy/moderation/moderation.js'
  import Menu from '$lib/components/ui/menu/Menu.svelte'
  import ShieldIcon from '$lib/components/lemmy/moderation/ShieldIcon.svelte'
  import MenuButton from '$lib/components/ui/menu/MenuButton.svelte'
  import { searchParam } from '$lib/util.js'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'

  export let data

  let blocking = false

  async function blockUser(block: number) {
    if (!$profile?.user || !$profile?.jwt) throw new Error('Unauthenticated')

    blocking = true
    try {
      const blocked = isBlocked($profile.user, block)

      await getClient().blockPerson({
        auth: $profile.jwt,
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

  let loadingMessage = false
  let messaging = false
  let message = ''

  async function sendMessage() {
    if (!$profile?.jwt || message == '') return

    loadingMessage = true

    try {
      await getClient().createPrivateMessage({
        auth: $profile.jwt,
        content: message,
        recipient_id: data.person_view.person.id,
      })

      toast({
        content: 'Successfully sent that person a message.',
        type: 'success',
      })

      messaging = false
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    }

    loadingMessage = false
  }
</script>

<svelte:head>
  <title>{data.person_view.person.name}</title>
</svelte:head>

{#if $profile?.user}
  <Modal bind:open={messaging}>
    <h1 class="text-2xl font-bold" slot="title">Message</h1>
    <form on:submit|preventDefault={sendMessage} class="flex flex-col gap-4">
      <p class="inline-flex flex-row gap-2 items-center">
        Sending <UserLink avatar user={data.person_view.person} /> a message
      </p>
      <TextArea
        bind:value={message}
        label="Message"
        placeholder="your hair looks nice today"
        rows={4}
      />
      <Button
        color="primary"
        size="lg"
        submit
        loading={loadingMessage}
        disabled={loadingMessage}
      >
        Send
      </Button>
    </form>
  </Modal>
{/if}

<div class="flex flex-col-reverse xl:flex-row gap-4 max-w-full w-full">
  <div class="flex flex-col gap-4 max-w-full w-full min-w-0">
    <div class="flex flex-row gap-4 flex-wrap">
      <MultiSelect
        options={['New', 'TopAll', 'Old']}
        optionNames={['New', 'Top', 'Old']}
        selected={data.sort}
        on:select={(e) => searchParam($page.url, 'sort', e.detail, 'page')}
      />
      <MultiSelect
        options={['all', 'posts', 'comments']}
        optionNames={['All', 'Posts', 'Comments']}
        selected={data.type}
        on:select={(e) => searchParam($page.url, 'type', e.detail, 'page')}
      />
    </div>
    {#if data.items.length == 0}
      <Placeholder
        icon={PencilSquare}
        title="No submissions"
        description="This user has no descriptions that match this filter."
      />
    {:else}
      {#each data.items as item (item.counts.id)}
        {#if isCommentView(item) && (data.type == 'all' || data.type == 'comments')}
          <CommentItem comment={item} />
        {:else if !isCommentView(item) && (data.type == 'all' || data.type == 'posts')}
          <Post post={item} />
        {/if}
      {/each}
    {/if}
    <Pageination
      page={data.page}
      on:change={(p) => searchParam($page.url, 'page', p.detail.toString())}
    />
  </div>

  <div class="mx-auto">
    <StickyCard>
      <Avatar
        width={64}
        url={data.person_view.person.avatar}
        alt={data.person_view.person.name}
      />
      <span class="flex flex-row items-center gap-1 text-sm">
        <Icon src={Calendar} width={16} height={16} mini />
        <span class="capitalize">
          <RelativeDate
            date={new Date(data.person_view.person.published + 'Z')}
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
      {#if $profile?.user && $profile.jwt && data.person_view.person.id != $profile.user.local_user_view.person.id}
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2 w-full">
            <Button
              size="lg"
              color="secondary"
              on:click={() => (messaging = true)}
              class="flex-1"
            >
              <Icon slot="icon" solid size="16" src={Envelope} />
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
                <Icon slot="icon" solid size="16" src={ShieldCheck} />
                Matrix User
              </Button>
            {/if}
          </div>
          <Button
            size="lg"
            color="danger"
            loading={blocking}
            disabled={blocking}
            on:click={() => blockUser(data.person_view.person.id)}
          >
            <Icon slot="icon" mini size="16" src={NoSymbol} />
            {isBlocked($profile.user, data.person_view.person.id)
              ? 'Unblock'
              : 'Block'}
          </Button>
        </div>
        {#if isAdmin($profile?.user)}
          <Menu let:toggleOpen class="ml-auto" alignment="bottom-right">
            <Button size="square-md" on:click={toggleOpen} slot="button">
              <ShieldIcon width={16} filled />
            </Button>
            {#if data.person_view.person.local}
              <MenuButton
                on:click={() => {
                  toast({
                    content: `Are you sure you want to ${
                      data.person_view.person.admin ? 'remove' : 'appoint'
                    } ${data.person_view.person.name} as an admin?`,
                    duration: 99999 * 1000,
                    type: 'info',
                    action: async () => {
                      if (!$profile?.jwt) return
                      await getClient()
                        .addAdmin({
                          auth: $profile.jwt,
                          added: !data.person_view.person.admin,
                          person_id: data.person_view.person.id,
                        })
                        .then(() => {
                          data.person_view.person.admin =
                            !data.person_view.person.admin
                        })
                        .catch(() => {
                          toast({
                            content: 'Failed to modify that user.',
                            type: 'error',
                          })
                        })
                    },
                  })
                }}
              >
                <Icon slot="icon" mini size="16" src={UserPlus} />
                {data.person_view.person.admin
                  ? 'Remove admin'
                  : 'Appoint as admin'}
              </MenuButton>
            {/if}
            <MenuButton
              color="dangerSecondary"
              on:click={() =>
                ban(data.person_view.person.banned, data.person_view.person)}
            >
              <Icon slot="icon" mini size="16" src={ShieldExclamation} />
              {data.person_view.person.banned ? 'Unban' : 'Ban'}
            </MenuButton>
          </Menu>
        {/if}
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
</div>
