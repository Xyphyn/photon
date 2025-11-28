<script lang="ts">
  import { client, site } from '$lib/api/client.svelte'
  import { PiefedClient } from '$lib/api/piefed/adapter'
  import type { PostView } from '$lib/api/types'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import MarkdownEditor from '$lib/app/markdown/MarkdownEditor.svelte'
  import { settings } from '$lib/app/settings.svelte'
  import { placeholders } from '$lib/app/util.svelte'
  import Duration from '$lib/ui/form/Duration.svelte'
  import FreeTextInput from '$lib/ui/form/FreeTextInput.svelte'
  import ObjectAutocomplete from '$lib/ui/form/ObjectAutocomplete.svelte'
  import MultiSelect from '$lib/ui/form/Switch.svelte'
  import Avatar from '$lib/ui/generic/Avatar.svelte'
  import ErrorContainer, { pushError } from '$lib/ui/info/ErrorContainer.svelte'
  import { CommonList, Header } from '$lib/ui/layout'
  import EndPlaceholder from '$lib/ui/layout/EndPlaceholder.svelte'
  import { publishedToDate } from '$lib/ui/util/date'
  import {
    Badge,
    Button,
    ButtonGroup,
    Label,
    Material,
    modal,
    Option,
    Select,
    Spinner,
    Switch,
    TextArea,
    TextInput,
    TextLoader,
  } from 'mono-svelte'
  import type { Snippet } from 'svelte'
  import {
    ChatBubbleBottomCenterText,
    Check,
    Icon,
    Language,
    Photo,
    Plus,
    Sparkles,
    Tag,
    Trash,
    XMark,
  } from 'svelte-hero-icons/dist'
  import { autofillPost, PostFormState } from './postform.svelte'

  interface Props {
    editPost?: number
    init?: PostFormState
    title?: Snippet
    onsubmit?: (post: PostView) => void
  }

  let { editPost, init, title, onsubmit }: Props = $props()

  let form = $state<PostFormState>(
    init ?? new PostFormState({ type: 'normal' }),
  )

  let extendedCommunity = $derived.by(() => {
    const api = client()
    if (!(api instanceof PiefedClient)) return undefined

    if (form.community?.id) {
      return api.getCommunity({ id: form.community.id })
    } else return undefined
  })

  let loading = $state<boolean>(false)
  let uploadImage = $state(false)

  async function autofill(
    url: URL,
  ): Promise<{ title?: string; body?: string }> {
    const res = await autofillPost(url)

    if (settings.forms.autosubmitAutofill) {
      form.title = res.title || form.title
      form.body = res.body || form.body
      history?.back?.()
    }

    return res
  }
</script>

{#if client() instanceof PiefedClient && !editPost}
  <div class="mb-3">
    <MultiSelect
      options={['normal', 'poll']}
      optionNames={[
        $t('form.post.types.normal'),
        $t('form.post.types.poll'),
        $t('form.post.types.event'),
      ]}
      bind:selected={form.type}
    />
  </div>
{/if}

{#if uploadImage}
  {#await import('$lib/ui/form/ImageInputModal.svelte') then { default: UploadModal }}
    <UploadModal
      bind:open={uploadImage}
      bind:imageUrl={() => '', (v) => (form.url = v)}
    />
  {/await}
{/if}

{#snippet altText()}
  <TextArea bind:value={form.altText} />
{/snippet}

{#snippet flairs()}
  <Material color="uniform" class="flex flex-row gap-4 flex-wrap">
    {#await extendedCommunity}
      <div class="w-full h-full grid place-items-center">
        <Spinner />
      </div>
    {:then communityView}
      {#each communityView?.community_view.flair_list ?? [] as flair}
        {@const selected = form.flairList?.some((i) => i.id == flair.id)}
        <button
          class="rounded-full cursor-pointer hover:brightness-100 badge-tag-color"
          style="--tag-color: {flair.background_color}; --tag-text-color: {flair.text_color};"
          onclick={() => {
            if (selected) {
              const index = form.flairList.findIndex((i) => i.id == flair.id)
              if (index != -1) form.flairList.splice(index, 1)
            } else form.flairList.push(flair)
          }}
        >
          <Badge
            color={selected ? 'gray-subtle' : 'custom'}
            class="ring-white/20"
          >
            {#snippet icon()}
              <Icon src={selected ? Check : Plus} size="16" micro />
            {/snippet}
            {flair.flair_title}
          </Badge>
        </button>
      {/each}
    {/await}
  </Material>
{/snippet}

{#snippet autofillPostModal()}
  <svelte:boundary>
    {#if form.url}
      {#await autofill(new URL(form.url))}
        <div class="w-full h-48 grid place-items-center">
          <TextLoader>
            {$t('form.post.fetching')}
          </TextLoader>
        </div>
        <Button size="lg" color="secondary" onclick={history.back}>
          {$t('common.cancel')}
        </Button>
      {:then url}
        {#if !url}
          <!--cursed svelte template abuse. don't do this lads-->
          {history.back()}
        {/if}
        <Material color="info" class="space-y-2 h-48">
          <h2 class="text-xl font-display font-medium">{url.title}</h2>
          <p class="overflow-hidden text-ellipsis">{url.body ?? '...'}</p>
        </Material>
        <Button
          size="lg"
          color="primary"
          onclick={() => {
            form.title = url.title ?? form.title
            form.body = url.body ?? form.body
            history.back()
          }}
        >
          {$t('form.submit')}
        </Button>
      {:catch err}
        <ErrorContainer scope="-1" message={err} />
      {/await}
      <Switch class="mt-4" bind:checked={settings.forms.autosubmitAutofill}>
        {$t('form.post.autosubmit')}
      </Switch>
    {/if}
  </svelte:boundary>
{/snippet}

<form
  onsubmit={(e) => {
    e.preventDefault()
    loading = true

    form
      .submit(editPost)
      .then(onsubmit)
      .catch((err) =>
        pushError({ message: errorMessage(err as string), scope: 'post-form' }),
      )
      .then(() => (loading = false))
  }}
  class="flex flex-col gap-4 h-full"
>
  {#if title}
    {@render title()}
  {:else}
    <Header class="font-bold text-xl">
      {editPost ? $t('form.post.edit') : $t('form.post.create')}
    </Header>
  {/if}
  <ErrorContainer scope="post-form" />
  {#if !editPost}
    {#if !form.community}
      <ObjectAutocomplete
        listing_type="All"
        label={$t('form.post.community')}
        onselect={(i) => {
          form.community = i.community
        }}
        required
      />
    {:else}
      <div class="flex flex-col gap-1">
        <Label>{$t('form.post.community')}</Label>
        <Button
          class="w-full"
          onclick={() => (form.community = undefined)}
          alignment="left"
          size="sm"
          rounding="xl"
        >
          {#snippet prefix()}
            <Avatar
              url={form.community?.icon}
              alt={form.community?.name}
              width={24}
            />
          {/snippet}
          <div class="flex flex-col gap-0">
            <span class="text-sm">{form.community.name}</span>
            <span class="text-[10px] leading-3">
              {new URL(form.community?.actor_id).hostname}
            </span>
          </div>
        </Button>
      </div>
    {/if}
  {/if}

  <FreeTextInput
    required
    bind:value={form.title}
    placeholder={placeholders.get('post')}
    label={$t('form.post.title')}
    class="font-display font-medium text-2xl"
  />
  <MarkdownEditor
    label={$t('form.post.body')}
    bind:value={form.body}
    placeholder={placeholders.get('body')}
    previewButton
  />

  {#if form.type == 'normal'}
    <TextInput
      label={$t('form.post.url')}
      bind:value={form.url}
      placeholder={placeholders.get('url')}
    >
      {#snippet suffix()}
        <Button
          color="none"
          rounding="none"
          class="h-full border-l border-slate-200 dark:border-zinc-800 aspect-square hover:bg-slate-50 hover:dark:bg-zinc-900 rounded-[inherit]"
          size="custom"
          disabled={!form.url || !URL.canParse(form.url)}
          icon={Sparkles}
          aria-label={$t('form.post.generateTitle')}
          onclick={() =>
            modal({
              title: $t('form.post.generateTitle'),
              snippet: autofillPostModal,
              actions: [],
            })}
        />
      {/snippet}
    </TextInput>
  {/if}

  {#if form.type == 'poll' && form.poll}
    <div>
      <Label>{$t('post.poll.choices')}</Label>
      <CommonList>
        <!--eslint-disable-next-line @typescript-eslint/no-unused-vars-->
        {#each form.poll.choices as _, index}
          <li class="px-4 py-1 flex flex-row items-center xs">
            <div class="p-0! font-medium flex-1">
              <FreeTextInput
                bind:value={form.poll.choices[index].choice_text}
                class="w-full"
              />
            </div>
            <div>
              <Button
                onclick={() => form.poll?.choices.splice(index, 1)}
                size="square-md"
                aria-label={$t('post.actions.more.delete')}
              >
                <Icon src={Trash} size="16" mini />
              </Button>
            </div>
          </li>
        {/each}
        <li class="xs">
          <button
            onclick={() =>
              form.poll?.choices.push({
                choice_text: `Option ${form.poll?.choices.length + 1}`,
                id: Math.max(...form.poll.choices.map((i) => i.id)) + 1,
                num_votes: 0,
                sort_order: 2,
              })}
            type="button"
            class="font-medium w-full px-4 py-2! flex flex-row items-center gap-1 justify-center cursor-pointer"
          >
            <Icon src={Plus} size="16" micro />
            {$t('common.add')}
          </button>
        </li>
      </CommonList>
    </div>

    <EndPlaceholder margin="bottom-lg">
      <Select label={$t('post.poll.mode')} bind:value={form.poll!.mode}>
        <Option value="single">
          {$t('post.poll.single')}
        </Option>
        <Option value="multiple">
          {$t('post.poll.multiple')}
        </Option>
      </Select>
      {#snippet action()}
        {#if !editPost}
          <Duration
            bind:value={
              () => {
                return form.poll?.end_poll
                  ? Math.floor(
                      Date.now() -
                        publishedToDate(form.poll?.end_poll).getTime(),
                    )
                  : Date.now() + 24 * 60 * 60
              },
              (v) => {
                if (v == -1) form.poll!.end_poll = undefined
                else
                  form.poll!.end_poll = new Date(
                    Date.now() + v * 1000,
                  ).toISOString()
              }
            }
          />
        {/if}
      {/snippet}
    </EndPlaceholder>

    {#if settings.debugInfo}
      {form.poll?.end_poll}
    {/if}
  {/if}

  <div class="flex flex-row flex-wrap gap-2">
    <ButtonGroup
      orientation="horizontal"
      class="flex flex-row flex-wrap w-full"
    >
      {#if form.type == 'normal'}
        <Button
          onclick={() => {
            uploadImage = !uploadImage
          }}
          icon={Photo}
        >
          {$t('form.post.uploadImage')}
        </Button>
        {#if form.url && URL.canParse(form.url)}
          <Button
            class="animate-pop-in"
            color={(form.altText ?? '') != '' ? 'primary' : 'secondary'}
            onclick={() =>
              modal({ title: $t('form.post.altText'), snippet: altText })}
            icon={ChatBubbleBottomCenterText}
          >
            {$t('form.post.altText')}
          </Button>
        {/if}
      {/if}
      {#if form.language === undefined}
        <Button onclick={() => (form.language = '')} icon={Language}>
          {$t('form.post.setLanguage')}
        </Button>
      {/if}
      {#await extendedCommunity then communityView}
        {#if (communityView?.community_view.flair_list?.length || 0) > 0}
          <Button
            color={form.flairList.length > 0 ? 'primary' : 'secondary'}
            class="animate-pop-in"
            onclick={() =>
              modal({ title: $t('form.post.flair'), snippet: flairs })}
            icon={Tag}
          >
            {$t('form.post.flair')}
          </Button>
        {/if}
      {/await}
    </ButtonGroup>
  </div>

  {#if form.language !== undefined}
    {#if site.data}
      <Select
        class="w-max"
        label={$t('settings.app.lang.title')}
        bind:value={
          () => form.language,
          (v) => {
            if (v == '') form.language = undefined
            else form.language = v
          }
        }
      >
        <Option value="">
          <Icon src={XMark} size="16" micro />
          {$t('form.post.unset')}
        </Option>
        {#each site.data?.all_languages as language}
          <Option value={language.id.toString()}>{language.name}</Option>
        {/each}
      </Select>
    {:else}
      <div style="height: 58px;">
        <Spinner width={24} />
      </div>
    {/if}
  {/if}

  <Switch bind:checked={form.nsfw}>{$t('form.post.nsfw')}</Switch>

  <Button submit color="primary" {loading} size="lg" class="mt-auto">
    {$t('form.submit')}
  </Button>
</form>
