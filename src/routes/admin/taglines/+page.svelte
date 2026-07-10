<script lang="ts">
  import { client } from '$lib/api/client.svelte'
  import type { Tagline } from '$lib/api/types'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import Markdown from '$lib/app/markdown/Markdown.svelte'
  import MarkdownEditor from '$lib/app/markdown/MarkdownEditor.svelte'
  import { proxify } from '$lib/app/util/reactivity.svelte.js'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { CommonList, Header } from '$lib/ui/layout'
  import { Button, toast } from 'mono-svelte'
  import { Icon, Plus, Trash } from 'svelte-hero-icons/dist'
  import { preventDefault } from 'svelte/legacy'

  let { data } = $props()

  let taglines = $state<Tagline[]>(proxify(data.taglines))

  let newTagline = $state('')
  let adding = $state(false)

  async function addTagline() {
    if (newTagline == '') return
    adding = true
    try {
      const res = await client().createTagline({
        content: newTagline,
      })
      taglines = [...taglines, res.tagline]
      newTagline = ''
    } catch (err) {
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })
    } finally {
      adding = false
    }
  }

  async function deleteTagline(id: number) {
    try {
      await client().deleteTagline({ id })
      taglines = taglines.filter((t) => t.id !== id)
      toast({
        content: $t('toast.updatedSite'),
        type: 'success',
      })
    } catch (err) {
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })
    }
  }
</script>

{#if taglines.length > 0}
  <Header pageHeader>
    {$t('routes.admin.taglines.title')}
  </Header>

  <CommonList items={taglines}>
    {#snippet item(tagline)}
      <div class="flex">
        <Markdown source={tagline.content} inline />

        <div class="flex gap-2 ml-auto">
          <Button onclick={() => deleteTagline(tagline.id)} size="square-md">
            <Icon src={Trash} mini size="16" />
          </Button>
        </div>
      </div>
    {/snippet}
  </CommonList>
  <form class="flex flex-col mt-auto gap-2 w-full" onsubmit={preventDefault(addTagline)}>
    <MarkdownEditor bind:value={newTagline} images={false} />

    <Button size="lg" submit loading={adding} disabled={adding} icon={Plus}>
      {$t('common.add')}
    </Button>
  </form>
{:else}
  <div class="my-auto">
    <Placeholder
      icon={Plus}
      title={$t('routes.admin.taglines.empty.title')}
      description={$t('routes.admin.taglines.empty.description')}
    >
      <div class="mt-4 max-w-xl w-full flex flex-col gap-2 text-slate-900 dark:text-zinc-50">
        <form class="flex flex-col gap-2 w-full" onsubmit={preventDefault(addTagline)}>
          <MarkdownEditor
            bind:value={newTagline}
            placeholder={$t('routes.admin.taglines.add')}
            images={false}
          />

          <Button size="lg" submit loading={adding} disabled={adding} icon={Plus}>
            {$t('common.add')}
          </Button>
        </form>
      </div>
    </Placeholder>
  </div>
{/if}
