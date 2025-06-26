<script lang="ts">
  import { profile } from '$lib/auth.svelte'
  import { publishedToDate } from '$lib/components/util/date'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import { t } from '$lib/i18n/translations'
  import { instance } from '$lib/instance.svelte'
  import { client } from '$lib/lemmy.svelte'
  import { instanceToURL } from '$lib/util.svelte'
  import type { LocalImage, Person } from 'lemmy-js-client'
  import { action, Button, modal, toast } from 'mono-svelte'
  import { ArrowDownTray, Icon, Trash } from 'svelte-hero-icons'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'

  let loading = $state(false)

  async function deleteImage(image: LocalImage) {
    if (!profile.data?.jwt) return

    try {
      loading = true
      const res = await client().deleteImage({
        token: image.pictrs_delete_token,
        filename: image.pictrs_alias,
      })

      ondelete?.(res)
    } catch (e) {
      toast({ content: e as string, type: 'error' })
    }
    loading = false
  }

  interface Props {
    image: LocalImage
    user?: Person
    ondelete?: (res: boolean) => void
  }

  let { image, user, ondelete }: Props = $props()
</script>

<div class="flex flex-col gap-1">
  <img
    src="{instanceToURL(instance.data)}/pictrs/image/{image.pictrs_alias}"
    width="500"
    height="500"
    class="aspect-square w-full h-full object-cover rounded-xl"
    alt="pictrs"
  />
  {#if user}
    <UserLink {user} />
  {/if}
  <div class="flex items-center gap-2">
    <RelativeDate
      class="text-sm text-slate-700 dark:text-zinc-300"
      date={publishedToDate(image.published)}
    />
    <Button
      title={$t('routes.profile.media.download')}
      href="{instanceToURL(instance.data)}/pictrs/image/{image.pictrs_alias}"
      size="square-md"
      class="ml-auto"
    >
      {#snippet prefix()}
        <Icon src={ArrowDownTray} size="16" mini />
      {/snippet}
    </Button>
    <Button
      title={$t('post.actions.more.delete')}
      onclick={() => {
        modal({
          title: $t('routes.theme.preset.delete.confirm'),
          body: '',
          actions: [
            action({
              close: true,
              content: $t('common.cancel'),
            }),
            action({
              type: 'danger',
              action: () => deleteImage(image),
              close: true,
              content: $t('post.actions.more.delete'),
            }),
          ],
        })
      }}
      size="square-md"
      {loading}
      disabled={loading}
    >
      {#snippet prefix()}
        <Icon src={Trash} size="16" mini color="text-red-500" />
      {/snippet}
    </Button>
  </div>
</div>
