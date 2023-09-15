<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'
  import { getClient, uploadImage } from '$lib/lemmy.js'
  import type { Community, Post, PostView } from 'lemmy-js-client'
  import { toast } from 'mono-svelte'
  import { Check, Icon, Photo } from 'svelte-hero-icons'
  import { profile } from '$lib/auth.js'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { placeholders } from '$lib/util.js'
  import { Checkbox, TextInput } from 'mono-svelte'
  import { getSessionStorage, setSessionStorage } from '$lib/session.js'
  import ObjectAutocomplete from '$lib/components/lemmy/ObjectAutocomplete.svelte'
  import { Button } from 'mono-svelte'

  export let edit = false

  /**
   * The post to edit
   */
  export let editingPost: Post | undefined = undefined

  export let passedCommunity:
    | {
        id: number
        name: string
      }
    | undefined = undefined

  export let data: {
    community: number | null
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

  let communities: Community[] = []

  const dispatcher = createEventDispatcher<{ submit: PostView }>()

  onMount(async () => {
    if (editingPost) {
      data.url = editingPost.url ?? ''
      data.body = editingPost.body ?? ''
      data.title = editingPost.name
    }

    if (passedCommunity) {
      data.community = passedCommunity.id
      communitySearch = passedCommunity.name
    } else {
      const list = await getClient().listCommunities({
        auth: $profile?.jwt,
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
    if ((!data.community || communitySearch == '') && !edit) {
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

        const post = await getClient().editPost({
          auth: $profile.jwt,
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
        let image = data.image ? await uploadImage(data.image[0]) : undefined
        data.url = image || data.url || undefined
        const post = await getClient().createPost({
          auth: $profile.jwt,
          community_id: data.community!,
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
    }
  }

  let uploadingImage = false
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

<form on:submit|preventDefault={submit} class="flex flex-col gap-4 h-full">
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
            class="text-green-600 ml-auto inline"
          />
        {/if}
      </div>
      <ObjectAutocomplete
        bind:q={communitySearch}
        bind:items={communities}
        jwt={$profile?.jwt}
        listing_type="All"
        on:select={(e) => {
          const c = e.detail
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
    />
    <Button
      size="square-md"
      on:click={() => (uploadingImage = !uploadingImage)}
      style="width: 46px !important; height: 42px; padding: 0;"
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
  <Checkbox bind:checked={data.nsfw}>NSFW</Checkbox>
  <div class="mt-auto" />
  {#if !edit}
    <Button
      on:click={() => {
        const draft = getSessionStorage('postDraft')
        if (draft && !edit) {
          // @ts-ignore
          draft.loading = false
          // @ts-ignore
          data = draft
        }
      }}
      size="lg"
      disabled={!getSessionStorage('postDraft')}
    >
      Restore from draft
    </Button>
  {/if}
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
