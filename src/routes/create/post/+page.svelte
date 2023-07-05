<script lang="ts">
  import { goto } from '$app/navigation'
  import Button from '$lib/components/input/Button.svelte'
  import FileInput from '$lib/components/input/FileInput.svelte'
  import SelectMenu from '$lib/components/input/SelectMenu.svelte'
  import TextArea from '$lib/components/input/TextArea.svelte'
  import TextInput from '$lib/components/input/TextInput.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import Loading from '$lib/components/ui/Loading.svelte'
  import { ToastType, addToast } from '$lib/components/ui/toasts/toasts.js'
  import { authData, buildBaseUrl, getClient } from '$lib/lemmy.js'
  import { Color } from '$lib/ui/colors.js'
  import type { Community } from 'lemmy-js-client'
  import { list } from 'postcss'
  import { onMount } from 'svelte'

  let data: {
    community: number | null
    title: string
    body: string
    image: FileList | null
    loading: boolean
  } = {
    community: null,
    title: '',
    body: '',
    image: null,
    loading: false,
  }

  async function uploadImage(
    image: FileList | null | undefined
  ): Promise<string | undefined> {
    if (!image || !$authData) return

    try {
      const res = await getClient().uploadImage({
        image: image[0],
        auth: $authData.token,
      })

      if (!res.url) {
        throw new Error('Failed to upload image')
      }

      return res.url
    } catch (err) {
      throw new Error('Failed to upload image.')
    }
  }

  async function submit() {
    if (!data.community || !data.title || !$authData) return

    data.loading = true

    try {
      let image = data.image ? await uploadImage(data.image) : undefined

      const post = await getClient().createPost({
        auth: $authData.token,
        community_id: data.community,
        name: data.title,
        body: data.body,
        url: image,
      })

      if (!post) throw new Error('Failed to upload post')

      console.log(`Uploading post ${post?.post_view.post.id}`)

      goto(`/post/${post?.post_view.post.id}`)
    } catch (err) {
      addToast('Error', err as any, ToastType.error)
    }

    data.loading = false
  }

  const placeholders = [
    'Is starting nuclear warfare illegal?',
    'A cool photo I took before the destruction of mankind!',
    'AITA for ending all contention and causing world peace?',
    'BREAKING NEWS: Police break into gun shop, find weapons',
  ]

  const placeholder =
    placeholders[Math.floor(Math.random() * placeholders.length)]

  const placeholder2 =
    placeholders[Math.floor(Math.random() * placeholders.length)]

  let communities: Community[] | undefined

  onMount(async () => {
    if (!$authData) {
      goto('/login')
      return
    }

    const list = await getClient().listCommunities({
      auth: $authData.token,
      type_: 'Subscribed',
      sort: 'New',
      limit: 40,
    })

    communities = list.communities.map((c) => c.community)
  })
</script>

<svelte:head>
  <title>Create post</title>
</svelte:head>

<Card class="p-6 max-w-xl mx-auto">
  <form on:submit|preventDefault={submit} class="flex flex-col gap-4">
    <h1 class="font-bold text-xl">Create Post</h1>
    <div>
      <span class="block my-1 font-bold text-sm">
        Community <span class="text-red-500">*</span>
      </span>
      {#if communities}
        <SelectMenu
          bind:selected={data.community}
          options={communities.map((c) => c.id)}
          optionNames={new Map(communities.map((c) => [c.id, c.title]))}
        />
      {:else}
        <Loading />
      {/if}
    </div>
    <TextInput required label="Title" bind:value={data.title} {placeholder} />
    <TextArea label="Body" bind:value={data.body} placeholder={placeholder2} />
    <div>
      <span class="block my-1 font-bold text-sm">Image</span>
      <FileInput
        accept="image/jpeg,image/png,image/webp"
        image
        bind:files={data.image}
      />
    </div>
    <Button
      submit
      color={Color.accent}
      large
      loading={data.loading}
      disabled={data.loading}
    >
      Submit
    </Button>
  </form>
</Card>
