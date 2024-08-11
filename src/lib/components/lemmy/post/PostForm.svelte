<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'
  import { client, site } from '$lib/lemmy.js'
  import type { Community, Language, Post, PostView } from 'lemmy-js-client'
  import { Select, Spinner, Switch, toast } from 'mono-svelte'
  import {
    Check,
    Icon,
    Photo,
    BookOpen,
    ArrowPath,
    Sparkles,
    ChatBubbleBottomCenterText,
  } from 'svelte-hero-icons'
  import { profile } from '$lib/auth.js'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { placeholders, uploadImage } from '$lib/util.js'
  import { Checkbox, TextInput } from 'mono-svelte'
  import { getSessionStorage, setSessionStorage } from '$lib/session.js'
  import ObjectAutocomplete from '$lib/components/lemmy/ObjectAutocomplete.svelte'
  import { Button } from 'mono-svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { t } from '$lib/translations'
  import { slide } from 'svelte/transition'
  import { feature } from '$lib/version'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'

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
    thumbnail?: string
    url?: string
    nsfw: boolean
    loading: boolean
    alt_text?: string
    language_id?: number
  } = {
    community: null,
    title: '',
    body: '',
    image: null,
    thumbnail: undefined,
    url: undefined,
    nsfw: false,
    loading: false,
    alt_text: undefined,
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
      data.nsfw = editingPost.nsfw
      data.alt_text = editingPost.alt_text
      data.thumbnail = editingPost.thumbnail_url
      data.language_id = editingPost.language_id
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
    // @ts-ignore
    if (saveDraft) setSessionStorage('postDraft', data)
  })

  async function submit() {
    if (!data.community && !edit) {
      toast({
        type: 'warning',
        content: $t('toast.needCommunity'),
      })
      return
    }
    if (!data.title || !$profile?.jwt) return
    if (data.url && data.url != '') {
      try {
        new URL(data.url)
      } catch (err) {
        toast({
          content: $t('toast.invalidURL'),
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
          alt_text: data.alt_text,
          custom_thumbnail: data.thumbnail,
          language_id: data.language_id ? Number(data.language_id) : undefined,
        })

        if (!post) throw new Error('Failed to edit post')

        console.log(`Edited post ${post?.post_view.post.id}`)

        dispatcher('submit', post.post_view)
      } else {
        const post = await client().createPost({
          community_id: data.community!.id,
          name: data.title,
          body: data.body,
          url: data.url || undefined,
          nsfw: data.nsfw,
          custom_thumbnail: data.thumbnail,
          alt_text: data.alt_text,
          language_id: data.language_id ? Number(data.language_id) : undefined,
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
      if (res.metadata.description)
        data.body = res.metadata.description
          .split('\n')
          .map((l) => `> ${l}`)
          .join('\n')

      toast({
        content: $t('toast.generatedTitle'),
        type: 'info',
        action: () => (data = oldData),
        duration: 15 * 1000,
      })
    } catch (e) {
      toast({
        content: $t('toast.failGenerateTitle'),
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

  let addAltText = false

  $: generation.generatable = canGenerateTitle(data.url)
</script>

{#if uploadingImage}
  {#await import('$lib/components/lemmy/modal/ImageUploadModal.svelte') then { default: UploadModal }}
    <UploadModal
      bind:open={uploadingImage}
      multiple={false}
      on:upload={(e) => {
        if (e.detail) data.url = e.detail[0]
        uploadingImage = false
      }}
    />
  {/await}
{/if}

<form on:submit|preventDefault={submit} class="flex flex-col gap-4 h-full">
  <slot name="formtitle">
    <Header class="font-bold text-xl">
      {edit ? $t('form.post.edit') : $t('form.post.create')}
    </Header>
  </slot>
  {#if !edit && data}
    {#if !data.community}
      <ObjectAutocomplete
        bind:q={communitySearch}
        bind:items={communities}
        jwt={$profile?.jwt}
        listing_type="All"
        label={$t('form.post.community')}
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
        <span class="font-medium text-sm">{$t('form.post.community')}</span>
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
    label={$t('form.post.title')}
    bind:value={data.title}
    placeholder={placeholders.get('post')}
  />
  <div class="flex gap-2 w-full items-end">
    <TextInput
      label={$t('form.post.url')}
      bind:value={data.url}
      placeholder={placeholders.get('url')}
      class="w-full"
    />
    <Button
      on:click={() => generateTitle(data.url)}
      style="height: 38px; {!generation.generatable
        ? 'width: 38px; padding: 0;'
        : ''}"
      class="flex-shrink-0"
      title={$t('form.post.generateTitle')}
      loading={generation.loading}
      disabled={!generation.generatable || generation.loading}
    >
      <Icon src={Sparkles} size="18" mini slot="prefix" />
      {#if generation.generatable}
        {$t('form.post.generateTitle')}
      {/if}
    </Button>
    <Button
      on:click={() => (addAltText = !addAltText)}
      style="width: 38px; height: 38px; padding: 0;"
      class="flex-shrink-0"
      title={$t('form.post.altText')}
    >
      <Icon src={ChatBubbleBottomCenterText} size="18" mini slot="prefix" />
    </Button>
    <Button
      on:click={() => (uploadingImage = !uploadingImage)}
      style="width: 38px; height: 38px; padding: 0;"
      class="flex-shrink-0"
      title={$t('form.post.uploadImage')}
    >
      <Icon src={Photo} size="18" mini slot="prefix" />
    </Button>
  </div>
  {#if addAltText}
    <div transition:slide={{ axis: 'y', duration: 150 }} class="w-full">
      <TextInput label={$t('form.post.altText')} bind:value={data.alt_text} />
    </div>
  {/if}
  <MarkdownEditor
    rows={8}
    label={$t('form.post.body')}
    bind:value={data.body}
    placeholder={placeholders.get('post')}
    previewButton
  />
  <Switch bind:checked={data.nsfw}>{$t('form.post.nsfw')}</Switch>
  {#if $site}
    <Select
      class="w-max"
      label={$t('settings.app.lang.title')}
      bind:value={data.language_id}
    >
      {#each $site?.all_languages as language}
        <option value={language.id.toString()}>{language.name}</option>
      {/each}
    </Select>
  {:else}
    <div style="height: 58px;">
      <Spinner width={24} />
    </div>
  {/if}
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
      {$t('form.submit')}
    </Button>

    {#if !edit}
      <Button
        on:click={() => {
          toast({ content: $t('toast.restoredFromDraft') })
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
