<script lang="ts">
  import { removalTemplate } from '$lib/components/lemmy/moderation/moderation.js'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import Expandable from '$lib/components/ui/Expandable.svelte'
  import { t } from '$lib/i18n/translations'
  import { settings } from '$lib/settings.svelte'
  import { Button, TextInput } from 'mono-svelte'
  import { Icon, Plus, Trash } from 'svelte-hero-icons'
  import Setting from '../Setting.svelte'
  import CommonList from '$lib/components/ui/layout/CommonList.svelte'
</script>

<CommonList>
  <Setting icon={Trash} adaptive={false}>
    {#snippet title()}
      <span>{$t('settings.moderation.replyPresets.title')}</span>
    {/snippet}
    {#snippet description()}
      <span>
        <p>{$t('settings.moderation.replyPresets.description')}</p>
        <ul class="leading-6">
          <li>{$t('settings.moderation.replyPresets.syntax')}</li>
          <li>
            <code>{'{{reason}}'}</code>
          </li>
          <li>
            <code>{'{{post}}'}</code>
          </li>
          <li>
            <code>{'{{community}}'}</code>
          </li>
          <li>
            <code>{'{{username}}'}</code>
          </li>
        </ul>
      </span>
    {/snippet}
  </Setting>
  {#each settings.moderation.presets as preset, index (preset)}
    <li>
      <Expandable>
        {#snippet title()}
          {preset.title}
        {/snippet}
        <div class="flex flex-col gap-3">
          <TextInput
            label="Title"
            bind:value={preset.title}
            placeholder="Reason 1"
          />
          <MarkdownEditor
            bind:value={preset.content}
            label="Content"
            images={false}
            previewButton
            beforePreview={input =>
              removalTemplate(input, {
                postTitle: '<Example post>',
                communityLink: '[!community@example.com]()',
                reason: '<Being a meanie>',
                username: '@Bob',
              })}
          />

          <Button
            color="danger"
            rounding="pill"
            onclick={() => {
              settings.moderation.presets.splice(index, 1)
              settings.moderation.presets = settings.moderation.presets
            }}
            class="w-max"
          >
            <Icon src={Trash} size="16" mini />
            {$t('common.remove')}
          </Button>
        </div>
      </Expandable>
    </li>
  {/each}
  <li>
    <Button
      color="none"
      class="w-full p-2"
      onclick={() => {
        settings.moderation.presets = [
          ...settings.moderation.presets,
          {
            title: `Preset ${settings.moderation.presets.length + 1}`,
            content:
              'Your submission in *{{post}}* was removed for *{{reason}}*.',
          },
        ]
      }}
    >
      {#snippet prefix()}
        <Icon src={Plus} micro size="16" />
      {/snippet}
      Add Preset
    </Button>
  </li>
</CommonList>
