<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import { getClient, authData, uploadImage } from '$lib/lemmy.js'
  import type { Community, Post, PostView } from 'lemmy-js-client'
  import TextInput from '$lib/components/input/TextInput.svelte'
  import TextArea from '$lib/components/input/TextArea.svelte'
  import SelectMenu from '$lib/components/input/SelectMenu.svelte'
  import Dots from '$lib/components/ui/loader/Dots.svelte'
  import FileInput from '$lib/components/input/FileInput.svelte'
  import Button from '$lib/components/input/Button.svelte'
  import { ToastType, toast } from '$lib/components/ui/toasts/toasts.js'
  import { goto } from '$app/navigation'
  import SearchInput from '$lib/components/input/SearchInput.svelte'
  import { Check, Icon } from 'svelte-hero-icons'

  export let edit = false

  /**
   * The post to edit
   */
  export let editingPost: Post | undefined = undefined

  let data: {
    community: number | null
    title: string
    body: string
    image: FileList | null
    url: string | undefined
    loading: boolean
  } = {
    community: null,
    title: '',
    body: '',
    image: null,
    url: undefined,
    loading: false,
  }

  const placeholders = [
    'Is starting nuclear warfare illegal?',
    'A cool photo I took before the destruction of mankind!',
    'AITA for ending all contention and causing world peace?',
    'BREAKING NEWS: Police break into gun shop, find weapons',
    'How do I make sure my pet rock stays alive?',
    'My cat just invented a time machine, what do I do?',
    'Unpopular opinion: world peace and global happiness would be beneficial to humanity',
    'LPT: The smaller weights are easier to lift than the bigger weights in a gym',
    'javascript bad',
    'ELI5: What is 4 + 8?',
  ]

  const placeholder =
    placeholders[Math.floor(Math.random() * placeholders.length)]

  const placeholder2 =
    placeholders[Math.floor(Math.random() * placeholders.length)]

  let communities: Community[] = []

  const dispatcher = createEventDispatcher<{ submit: PostView }>()

  onMount(async () => {
    if (editingPost) {
      data.url = editingPost.url ?? ''
      data.body = editingPost.body ?? ''
      data.title = editingPost.name
    }

    const list = await getClient().listCommunities({
      auth: $authData?.token,
      type_: 'Subscribed',
      sort: 'Active',
      limit: 40,
    })

    communities = list.communities.map((c) => c.community)
  })

  async function submit() {
    if (!data.community && !edit) {
      toast({
        type: ToastType.warning,
        content: 'You need to set a community.',
      })
      return
    }
    if (!data.title || !$authData) return

    data.loading = true

    try {
      if (edit) {
        if (!editingPost) {
          throw new Error('Post is being edited but editingPost is null')
        }

        const post = await getClient().editPost({
          auth: $authData.token,
          name: data.title,
          body: data.body,
          url: data.url || undefined,
          post_id: editingPost.id,
        })

        if (!post) throw new Error('Failed to edit post')

        console.log(`Edited post ${post?.post_view.post.id}`)

        dispatcher('submit', post.post_view)
      } else {
        let image = data.image ? await uploadImage(data.image[0]) : undefined
        data.url = image || data.url || undefined
        const post = await getClient().createPost({
          auth: $authData.token,
          community_id: data.community!,
          name: data.title,
          body: data.body,
          url: data.url,
        })

        if (!post) throw new Error('Failed to upload post')

        console.log(`Uploaded post ${post?.post_view.post.id}`)

        dispatcher('submit', post.post_view)
      }
    } catch (err) {
      toast({ content: err as any, type: ToastType.error })
    }
  }

  let communitySearch = ''
</script>

<form on:submit|preventDefault={submit} class="flex flex-col gap-4">
  <slot name="formtitle">
    <h1 class="font-bold text-xl">
      {edit ? 'Edit' : 'Create'} Post
    </h1>
  </slot>
  {#if !edit}
    <div>
      <div class="flex flex-row">
        <span class="block my-1 font-bold text-sm">
          Community <span class="text-red-500">*</span>
        </span>
        {#if data.community}
          <Icon
            src={Check}
            mini
            size="20"
            class="text-green-400 ml-auto inline"
          />
        {/if}
      </div>
      <SearchInput
        options={communities}
        on:search={async () => {
          const results = await getClient().search({
            q: communitySearch,
            auth: $authData?.token,
            type_: 'Communities',
            limit: 20,
            listing_type: 'Subscribed',
            sort: 'Active',
          })

          communities = results.communities.map((c) => c.community)
        }}
        debounceTime={600}
        extractName={(c) => c.title}
        bind:query={communitySearch}
        extractSelected={(c) => {
          if (!c) {
            data.community = null
            return
          }

          data.community = c.id
          communitySearch = `${c.name}@${new URL(c.actor_id).hostname}`
        }}
      />
    </div>
  {/if}
  <TextInput required label="Title" bind:value={data.title} {placeholder} />
  <TextInput
    label="URL"
    bind:value={data.url}
    placeholder="https://notascam.com"
  />
  <TextArea
    rows={6}
    label="Body"
    bind:value={data.body}
    placeholder={placeholder2}
  />
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
    color="primary"
    loading={data.loading}
    size="lg"
    disabled={data.loading}
  >
    Submit
  </Button>
</form>
