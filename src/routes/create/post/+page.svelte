<script lang="ts">
  import { goto } from '$app/navigation'
  import { t } from '$lib/app/i18n'
  import { getSessionStorage, setSessionStorage } from '$lib/app/session'
  import PostForm from '$lib/feature/post/PostForm.svelte'
  import { onDestroy } from 'svelte'

  let { data } = $props()

  let community = getSessionStorage('lastSeenCommunity') as
    | { id: number; name: string }
    | undefined

  onDestroy(() => {
    setSessionStorage('lastSeenCommunity', undefined)
  })

  // TODO remove this

  let post = getSessionStorage('postDraft') as any
</script>

<svelte:head>
  <title>{$t('form.post.create')}</title>
</svelte:head>

<PostForm
  passedData={data.crosspost == true
    ? post
    : {
        body: '',
        community: null,
        image: null,
        loading: false,
        nsfw: false,
        title: '',
        url: undefined,
        flair_list: [],
      }}
  passedCommunity={community}
  onsubmit={(e) => goto(`/post/${e.post.id}`)}
>
  {#snippet formtitle()}{/snippet}
</PostForm>
