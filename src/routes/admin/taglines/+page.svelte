<script lang="ts">
  import { getClient } from '$lib/api/client.svelte'
  import type { Tagline } from '$lib/api/types'
  import { profile } from '$lib/app/auth.svelte'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import Markdown from '$lib/app/markdown/Markdown.svelte'
  import MarkdownEditor from '$lib/app/markdown/MarkdownEditor.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { CommonList, Header } from '$lib/ui/layout'
  import { Button, toast } from 'mono-svelte'
  import { Icon, Plus, Trash } from 'svelte-hero-icons/dist'
  import { preventDefault } from 'svelte/legacy'

  let { data } = $props()

  let taglines = $state([
    ...(data.site?.taglines.map((t: Tagline) => t.content) ?? []),
  ])
  let newTagline = $state('')

  let saving = $state(false)

  async function save() {
    if (!profile.current?.jwt) return

    saving = true

    try {
      await getClient().editSite({
        taglines: taglines,
      })
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

    saving = false
  }
</script>

{#if taglines.length > 0}
  <Header pageHeader class="justify-between">
    {$t('routes.admin.taglines.title')}<Button
      color="primary"
      onclick={save}
      loading={saving}
      disabled={saving}
      size="lg"
      class="h-max"
    >
      {$t('common.save')}
    </Button>
  </Header>

  <CommonList items={taglines}>
    {#snippet item(tagline)}
      <div class="flex">
        <Markdown source={tagline} inline />

        <div class="flex gap-2 ml-auto">
          <Button
            onclick={() => {
              taglines.splice(
                taglines.findIndex((i) => i == tagline),
                1,
              )

              // hack for reactivity
              taglines = taglines
            }}
            size="square-md"
          >
            <Icon src={Trash} mini size="16" />
          </Button>
        </div>
      </div>
    {/snippet}
  </CommonList>
  <form
    class="flex flex-col mt-auto gap-2 w-full"
    onsubmit={preventDefault(() => {
      if (newTagline == '' || !data.site) return

      taglines = [...taglines, newTagline]

      newTagline = ''
    })}
  >
    <MarkdownEditor bind:value={newTagline} images={false} />

    <Button size="lg" submit icon={Plus}>
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
      <div
        class="mt-4 max-w-xl w-full flex flex-col gap-2 text-slate-900 dark:text-zinc-50"
      >
        <form
          class="flex flex-col gap-2 w-full"
          onsubmit={preventDefault(() => {
            if (newTagline == '' || !data.site) return

            taglines = [...taglines, newTagline]

            newTagline = ''
          })}
        >
          <MarkdownEditor
            bind:value={newTagline}
            placeholder={$t('routes.admin.taglines.add')}
            images={false}
          />

          <Button size="lg" submit icon={Plus}>
            {$t('common.add')}
          </Button>
        </form>

        <Button onclick={save} color="primary" size="lg" class="w-full">
          {$t('common.save')}
        </Button>
      </div>
    </Placeholder>
  </div>
{/if}
