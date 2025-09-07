<script lang="ts">
  import { profile } from '$lib/auth.svelte.js'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { t } from '$lib/i18n/translations'
  import { client, site } from '$lib/client/lemmy.svelte'
  import { errorMessage } from '$lib/lemmy/error'
  import { placeholders } from '$lib/util.svelte.js'
  import type { CommentResponse } from '$lib/client/types'
  import { Button, Menu, MenuButton, toast } from 'mono-svelte'
  import { Icon, Language, XMark } from 'svelte-hero-icons'
  import type { ClassValue, HTMLTextareaAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLTextareaAttributes, 'oncancel'> {
    postId: number
    parentId?: number | undefined
    locked?: boolean
    banned?: boolean
    rows?: number
    placeholder?: string | undefined
    value?: string
    actions?: boolean
    tools?: boolean
    preview?: boolean
    class?: ClassValue
    required?: boolean
    id?: string
    label?: string
    oncomment?: (comment: CommentResponse) => void
    onconfirm?: (value: string) => void
    oncancel?: (cancel: boolean) => void
  }

  let {
    postId,
    parentId = undefined,
    locked = false,
    banned = false,
    rows = 7,
    placeholder = undefined,
    value = $bindable(''),
    actions = true,
    preview: previewAction = true,
    oncancel,
    oncomment,
    ...rest
  }: Props = $props()

  let loading = $state(false)
  let preview = false
  let language: number | undefined = $state()

  async function submit() {
    if (!profile.current?.user || !profile.current?.jwt || value == '') return

    loading = true

    try {
      const response = await client().createComment({
        content: value,
        post_id: postId,
        parent_id: parentId,
      })
      oncomment?.(response)

      value = ''
    } catch (err) {
      console.error(err)
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })
    }

    loading = false
  }
</script>

<form
  onsubmit={e => {
    e.preventDefault()
    submit()
  }}
  class="flex flex-col gap-2 relative"
>
  {#if preview}
    <div
      class="bg-slate-100 dark:bg-zinc-900 px-3 py-2.5 h-64 border
      border-slate-300 dark:border-zinc-700 rounded-md overflow-auto text-sm resize-y"
    >
      <Markdown source={value} />
    </div>
  {:else}
    <MarkdownEditor
      {...rest}
      {rows}
      placeholder={locked
        ? $t('comment.locked')
        : banned
          ? $t('comment.banned')
          : (placeholder ?? placeholders.get('comment'))}
      bind:value
      disabled={locked || loading || banned}
      previewButton={previewAction}
    >
      <Menu>
        {#snippet target(attachment)}
          <Button
            {@attach attachment}
            size="custom"
            rounding="xl"
            class="w-7.5 h-7.5"
            color={language != undefined ? 'primary' : 'ghost'}
            title={$t('form.profile.languages.title')}
          >
            <Icon src={Language} size="14" micro />
          </Button>
        {/snippet}

        {#if site.data}
          <MenuButton
            class="min-h-[16px] py-0"
            onclick={() => (language = undefined)}
          >
            <Icon src={XMark} size="16" micro />
            {$t('form.post.unset')}
          </MenuButton>
          {#each site.data?.all_languages as languageOption}
            <MenuButton
              class="min-h-[16px] py-0"
              onclick={() => {
                language = languageOption.id
              }}
            >
              {languageOption.name}
            </MenuButton>
          {/each}
        {/if}
      </Menu>
      <div class="flex-1"></div>
      {#if actions}
        <Button
          size="custom"
          title={$t('common.cancel')}
          onclick={() => oncancel?.(true)}
          color="tertiary"
          class="w-8 h-8"
          rounding="xl"
        >
          <Icon
            src={XMark}
            size="16"
            micro
            class="text-slate-600 dark:text-zinc-400"
          />
        </Button>
        <Button
          submit
          color="primary"
          rounding="xl"
          {loading}
          disabled={locked || loading || banned}
        >
          {$t('form.submit')}
        </Button>
      {/if}
    </MarkdownEditor>
  {/if}
</form>
