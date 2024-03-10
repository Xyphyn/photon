<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'
  import { client } from '$lib/lemmy.js'
  import type { Community, Post, PostView } from 'lemmy-js-client'
  import { Switch, toast } from 'mono-svelte'
  import { Check, Icon, Photo, BookOpen, ArrowPath } from 'svelte-hero-icons'
  import { profile } from '$lib/auth.js'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { placeholders, uploadImage } from '$lib/util.js'
  import { Checkbox, TextInput } from 'mono-svelte'
  import { getSessionStorage, setSessionStorage } from '$lib/session.js'
  import ObjectAutocomplete from '$lib/components/lemmy/ObjectAutocomplete.svelte'
  import { Button } from 'mono-svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'

  export let edit = false

  /**
   * The post to edit
   */
  export let editingPost: Post | undefined = undefined

  export let passedCommunity: Community | undefined = undefined

  export let data: {
    community: Community | null
    title: string
    body: string
    image: FileList | null
    url: string | undefined
    nsfw: boolean
    loading: boolean
  } = {
    community: null,
    title: '',
    body: '',
    image: null,
    url: undefined,
    nsfw: false,
    loading: false,
  }

  let saveDraft = edit ? false : true
  let communitySearch = passedCommunity?.name ?? ''
  let isUploadingImageViaUrlInput = false
  
  let communities: Community[] = []

  const dispatcher = createEventDispatcher<{ submit: PostView }>()

  onMount(async () => {
    if (editingPost) {
      data.url = editingPost.url ?? ''
      data.body = editingPost.body ?? ''
      data.title = editingPost.name
    }

    if (passedCommunity) {
      data.community = passedCommunity
      communitySearch = passedCommunity.name
      console.log(communitySearch)
    } else {
      const list = await client().listCommunities({
        type_: 'All',
        sort: 'Active',
        limit: 40,
      })

      communities = list.communities.map((c) => c.community)
    }
  })

  onDestroy(() => {
    if (saveDraft) setSessionStorage('postDraft', data)
  })

  async function submit() {
    if ((!data.community) && !edit) {
      toast({
        type: 'warning',
        content: 'You need to set a community.',
      })
      return
    }
    if (!data.title || !$profile?.jwt) return
    if (data.url && data.url != '') {
      try {
        new URL(data.url)
      } catch (err) {
        toast({
          content: 'Invalid URL',
          type: 'warning',
        })
        return
      }
    }

    data.loading = true

    try {
      if (edit) {
        if (!editingPost) {
          throw new Error('Post is being edited but editingPost is null')
        }

        const post = await client().editPost({
          name: data.title,
          body: data.body,
          url: data.url || undefined,
          post_id: editingPost.id,
          nsfw: data.nsfw,
        })

        if (!post) throw new Error('Failed to edit post')

        console.log(`Edited post ${post?.post_view.post.id}`)

        dispatcher('submit', post.post_view)
      } else {
        let image = data.image
          ? await uploadImage(data.image[0], $profile.instance, $profile.jwt)
          : undefined
        data.url = image || data.url || undefined
        const post = await client().createPost({
          community_id: data.community!.id,
          name: data.title,
          body: data.body,
          url: data.url,
          nsfw: data.nsfw,
        })

        if (!post) throw new Error('Failed to upload post')

        console.log(`Uploaded post ${post?.post_view.post.id}`)

        saveDraft = false
        dispatcher('submit', post.post_view)
      }
    } catch (err) {
      toast({ content: err as any, type: 'error' })
      data.loading = false
    }
  }

  let uploadingImage = false

  const handlePaste = async (event: ClipboardEvent) => {
    if (!$profile?.jwt) return
    const file = event.clipboardData?.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const image = file
    isUploadingImageViaUrlInput = true
    const uploaded = await uploadImage(
        image,
        $profile.instance,
        $profile.jwt
      )
    data.url = uploaded
    isUploadingImageViaUrlInput = false
  }

  const generateTitle = async (url: string | undefined) => {
    if (!url) return
    generation.loading = true
    try {
      const res = await client().getSiteMetadata({
        url: url,
      })

      // for backup
      const oldData = { ...data }

      if (res.metadata.title) data.title = res.metadata.title
      if (res.metadata.description) data.body = res.metadata.description

      toast({
        content: `Generated title and body from that website. Would you like to undo this action?`,
        type: 'info',
        action: () => (data = oldData),
        duration: 15 * 1000,
      })
    } catch (e) {
      toast({
        content: 'There was no usable title or description of that website.',
      })
    }
    generation.loading = false
  }

  const canGenerateTitle = (url: string | undefined) => {
    if (!url) return false
    try {
      new URL(url)
    } catch (e) {
      return false
    }
    return true
  }

  let generation = {
    loading: false,
    generatable: false,
    title: '',
  }

  $: generation.generatable = canGenerateTitle(data.url)
</script>

{#if uploadingImage}
  {#await import('$lib/components/lemmy/modal/ImageUploadModal.svelte') then { default: UploadModal }}
    <UploadModal
      bind:open={uploadingImage}
      on:upload={(e) => {
        if (e.detail) data.url = e.detail
        uploadingImage = false
      }}
    />
  {/await}
{/if}

<form on:paste={event => handlePaste(event)} on:submit|preventDefault={submit} class="flex flex-col gap-4 h-full">
  <slot name="formtitle">
    <h1 class="font-bold text-xl">
      {edit ? 'Edit' : 'Create'} Post
    </h1>
  </slot>
  {#if !edit && data}
    {#if !data.community}
      <ObjectAutocomplete
        bind:q={communitySearch}
        bind:items={communities}
        jwt={$profile?.jwt}
        listing_type="All"
        label="Community"
        required
        on:select={(e) => {
          const c = e.detail
          if (!c) {
            data.community = null
            return
          }

          communitySearch = ''

          data.community = c
        }}
      />
    {:else}
      <div class="flex flex-col gap-1">
        <span class="font-medium text-sm">Community</span>
        <Button
          class="w-full !bg-white dark:!bg-black h-[38px]"
          on:click={() => (data.community = null)}
          alignment="left"
          size="sm"
        >
          <Avatar
            url={data.community.icon}
            alt={data.community.name}
            width={24}
            slot="prefix"
          />
          <div class="flex flex-col gap-0">
            <span class="text-xs">{data.community.name}</span>
            <span class="text-[10px] leading-3">
              {new URL(data.community.actor_id).hostname}
            </span>
          </div>
        </Button>
      </div>
    {/if}
  {/if}
  <TextInput
    required
    label="Title"
    bind:value={data.title}
    placeholder={placeholders.get('post')}
  />
  <div class="flex gap-2 w-full items-end">
    <TextInput
      label="URL"
      bind:value={data.url}
      placeholder={placeholders.get('url')}
      class="w-full"
      disabled={isUploadingImageViaUrlInput}
    />
    <Button
      on:click={() => generateTitle(data.url)}
      style="width: 38px; height: 38px; padding: 0;"
      class="flex-shrink-0"
      title="Generate title/body"
      loading={generation.loading}
      disabled={!generation.generatable || generation.loading}
    >
      <Icon src={BookOpen} size="18" mini slot="prefix" />
    </Button>
    <Button
      on:click={() => (uploadingImage = !uploadingImage)}
      style="width: 38px; height: 38px; padding: 0;"
      class="flex-shrink-0"
      title="Upload image"
      loading={isUploadingImageViaUrlInput}
    >
      <Icon src={Photo} size="18" mini slot="prefix" />
    </Button>
  </div>
  <MarkdownEditor
    rows={8}
    label="Body"
    bind:value={data.body}
    placeholder={placeholders.get('post')}
    previewButton
  />
  <Switch bind:checked={data.nsfw}>NSFW</Switch>
  <div class="mt-auto" />
  <div class="flex flex-row items-center gap-2">
    <Button
      submit
      color="primary"
      loading={data.loading}
      size="lg"
      disabled={data.loading}
      class="flex-1"
    >
      Submit
    </Button>

    {#if !edit}
      <Button
        on:click={() => {
          toast({ content: 'Restored from draft' })
          const draft = getSessionStorage('postDraft')
          if (draft && !edit) {
            // @ts-ignore
            draft.loading = false
            // @ts-ignore
            data = draft
          }
        }}
        size="square-lg"
        disabled={!getSessionStorage('postDraft')}
        title="Restore From Draft"
      >
        <Icon src={ArrowPath} size="16" mini />
      </Button>
    {/if}
  </div>
</form>
