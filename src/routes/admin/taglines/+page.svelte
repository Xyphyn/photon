<script lang="ts">
  import { preventDefault } from 'svelte/legacy'

  import { profile } from '$lib/auth.svelte.js'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { getClient } from '$lib/lemmy.svelte.js'
  import type { Tagline } from 'lemmy-js-client'
  import { Button, toast } from 'mono-svelte'
  import { Icon, Plus, Trash } from 'svelte-hero-icons'
  import { errorMessage } from '$lib/lemmy/error.js'

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

  <ul>
    {#each taglines as tagline (tagline)}
      <div class="flex py-3">
        <Markdown source={tagline} inline />

        <div class="flex gap-2 ml-auto">
          <Button
            onclick={() => {
              taglines.splice(
                taglines.findIndex(i => i == tagline),
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
    {/each}
  </ul>
  <form
    class="flex flex-col mt-auto gap-2 w-full"
    onsubmit={preventDefault(() => {
      if (newTagline == '' || !data.site) return

      taglines = [...taglines, newTagline]

      newTagline = ''
    })}
  >
    <MarkdownEditor bind:value={newTagline} images={false} />

    <Button size="lg" submit>
      {#snippet prefix()}
        <Icon src={Plus} size="16" mini />
      {/snippet}
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
      <div class="mt-4 max-w-xl w-full flex flex-col gap-2">
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

          <Button size="lg" submit>
            {#snippet prefix()}
              <Icon src={Plus} size="16" mini />
            {/snippet}
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
