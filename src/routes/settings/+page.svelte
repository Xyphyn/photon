<script lang="ts">
  import { defaultSettings, userSettings } from '$lib/settings'
  import Setting from './Setting.svelte'
  import MultiSelect from '$lib/components/input/Switch.svelte'
  import Sort from '$lib/components/lemmy/Sort.svelte'
  import { Disclosure, Material, Switch, TextInput, toast } from 'mono-svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'
  import Link from '$lib/components/input/Link.svelte'
  import {
    ArrowPath,
    ChatBubbleOvalLeftEllipsis,
    ChevronDown,
    ChevronRight,
    GlobeAmericas,
    Icon,
    Plus,
    Trash,
  } from 'svelte-hero-icons'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { removalTemplate } from '$lib/components/lemmy/moderation/moderation.js'
  import { Button, Checkbox, Select } from 'mono-svelte'
  import ViewSelect from '$lib/components/lemmy/ViewSelect.svelte'
  import { LINKED_INSTANCE_URL } from '$lib/instance.js'
  import { removeItem } from '$lib/util.js'
  import Section from './Section.svelte'
  import ToggleSetting from './ToggleSetting.svelte'

  let data = {
    loading: false,
  }
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<h1 class="text-3xl font-bold flex justify-between">
  Settings <Button
    on:click={() => {
      toast({
        content: 'Are you sure you want to reset your settings to the default?',
        action: () => ($userSettings = defaultSettings),
      })
    }}
    class="font-normal"
  >
    <Icon src={ArrowPath} mini size="16" slot="prefix" />
    Reset to default
  </Button>
</h1>

<div class="flex flex-col gap-4" style="scroll-behavior: smooth;">
  <Section title="Photon">
    <Setting>
      <span slot="title">Post style</span>
      <ViewSelect showLabel={false} />
      <p slot="description">
        {#if $userSettings.view == 'list'}
          Show posts in a list, with post bodies and compact images.
        {:else if $userSettings.view == 'cozy'}
          Card view, but without a background.
        {:else if $userSettings.view == 'compact'}
          Show posts in a list, without post bodies and with tighter spacing.
        {:else if $userSettings.view == 'card'}
          Show posts in cards, with large images.
        {/if}
      </p>
    </Setting>
    <Setting optionClass="flex-[2] max-w-full flex-wrap min-w-0">
      <span slot="title">Default sort</span>
      <span slot="description">The default sort to use for feeds.</span>
      <div class="flex max-[500px]:flex-col flex-wrap gap-4 w-max max-w-full">
        <div class="max-w-full">
          <Select bind:value={$userSettings.defaultSort.feed}>
            <span slot="label" class="flex items-center gap-1">
              <Icon src={GlobeAmericas} size="16" mini />
              Location
            </span>
            <option value="All">All</option>
            <option value="Local">Local</option>
            <option value="Subscribed">Subscribed</option>
          </Select>
        </div>
        <div class="max-w-full">
          <Sort
            bind:selected={$userSettings.defaultSort.sort}
            navigate={false}
          />
        </div>
        <div class="max-w-full">
          <Select bind:value={$userSettings.defaultSort.comments}>
            <span slot="label" class="flex items-center gap-1">
              <Icon src={ChatBubbleOvalLeftEllipsis} size="14" mini />
              Comments
            </span>

            <option value="Hot">Hot</option>
            <option value="Top">Top</option>
            <option value="New">New</option>
          </Select>
        </div>
      </div>
    </Setting>
    <Setting>
      <span slot="title">Vote style</span>
      <MultiSelect
        options={[false, true]}
        optionNames={['Combined', 'Separate']}
        bind:selected={$userSettings.separateVotes}
      />
    </Setting>
    <ToggleSetting
      bind:checked={$userSettings.displayNames}
      title="Use display name"
      description="Show a user's display name instead of their account username."
    />
    <ToggleSetting
      bind:checked={$userSettings.newWidth}
      title="Limit layout width"
      description="Improve readability by limiting main content width."
    />
    <ToggleSetting
      bind:checked={$userSettings.randomPlaceholders}
      title="Random placeholders"
      description="Show a random placeholder for forms for comments, posts, etc."
    />
    <ToggleSetting
      bind:checked={$userSettings.randomPlaceholders}
      title="Expand Images"
      description="Clicking on a post's image brings you to an expanded view rather than
      sending you to the post page."
    />
    <Setting>
      <span slot="title">Thumbnail Alignment</span>
      <span slot="description">
        Where thumbnails should be on the post in list/compact view.
      </span>
      <MultiSelect
        options={[true, false]}
        optionNames={['Left', 'Right']}
        bind:selected={$userSettings.leftAlign}
      />
    </Setting>
    {#if LINKED_INSTANCE_URL}
      <ToggleSetting
        title={'Remove "Powered by Photon"'}
        description="Remove the massive 120x16 div in the top left corner."
        bind:checked={$userSettings.hidePhoton}
      />
    {/if}
  </Section>

  <Section title="Lemmy">
    <ToggleSetting
      bind:checked={$userSettings.markPostsAsRead}
      title="Mark read posts"
      description="Mark a post as read when you click on it."
    />
    <ToggleSetting
      bind:checked={$userSettings.markReadPosts}
      title="Fade read posts"
      description="Fade the title of posts you've already read."
    />
    <ToggleSetting
      bind:checked={$userSettings.nsfwBlur}
      title="NSFW blur"
      description="Blur images and remove post bodies of NSFW content."
    />
    <Setting>
      <span slot="title">Hide Posts</span>
      <span slot="description">
        <p>Hide certain types of posts.</p>
        <p>
          Looking to hide read posts? That was moved to your <Link
            href="/profile/settings"
            highlight
          >
            profile settings.
          </Link>
        </p>
      </span>
      <div class="flex flex-row items-center gap-4 flex-wrap">
        <Checkbox bind:checked={$userSettings.hidePosts.deleted}>
          Deleted
        </Checkbox>
        <Checkbox bind:checked={$userSettings.hidePosts.removed}>
          Removed
        </Checkbox>
      </div>
    </Setting>
    <Setting>
      <span slot="title">Font</span>
      <span slot="description">What font Photon should use.</span>
      <MultiSelect
        options={['inter', 'system', 'browser']}
        optionNames={['Inter', 'System UI', 'Browser Font']}
        bind:selected={$userSettings.font}
      />
    </Setting>
    <Setting>
      <span slot="title">Show instances</span>
      <span slot="description">Show items' instances.</span>
      <div class="flex flex-row flex-wrap items-center gap-4">
        <Checkbox bind:checked={$userSettings.showInstances.user}>
          Users
        </Checkbox>
        <Checkbox bind:checked={$userSettings.showInstances.comments}>
          Comments
        </Checkbox>
        <Checkbox bind:checked={$userSettings.showInstances.community}>
          Communities
        </Checkbox>
      </div>
    </Setting>
  </Section>

  <Section title="Moderation">
    <Setting>
      <span slot="title">Removal reply presets</span>
      <span slot="description">
        <p>Presets to use for "Reply reason" in a submission removal.</p>
        <ul class="leading-6">
          <li>Syntax:</li>
          <li>
            <code>{'{{reason}}'}</code>
            : The provided reason
          </li>
          <li>
            <code>{'{{post}}'}</code>
            : The title of the post
          </li>
          <li>
            <code>{'{{community}}'}</code>
            : The community the submission was removed in.
          </li>
          <li>
            <code>{'{{username}}'}</code>
            : The username of the creator of the submission.
          </li>
        </ul>
      </span>
      {#each $userSettings.moderation.presets as preset, index}
        <Material color="distinct" padding="md" class="py-3 w-full">
          <details>
            <summary
              class="cursor-pointer inline-flex flex-row items-center w-full gap-1"
            >
              <Icon src={ChevronDown} mini size="16" slot="prefix" />
              {preset.title}
              <Button
                size="square-md"
                class="ml-auto"
                on:click={() => {
                  $userSettings.moderation.presets.splice(index, 1)
                  $userSettings.moderation.presets =
                    $userSettings.moderation.presets
                }}
              >
                <Icon src={Trash} size="16" mini slot="prefix" />
              </Button>
            </summary>
            <div class="flex flex-col gap-3 mt-2">
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
                beforePreview={(input) =>
                  removalTemplate(input, {
                    postTitle: '<Example post>',
                    communityLink: '[!community@example.com]()',
                    reason: '<Being a meanie>',
                    username: '@Bob',
                  })}
              />
            </div>
          </details>
        </Material>
      {/each}
      <Button
        on:click={() => {
          $userSettings.moderation.presets = [
            ...$userSettings.moderation.presets,
            {
              title: `Preset ${$userSettings.moderation.presets.length + 1}`,
              content:
                'Your submission in *{{post}}* was removed for *{{reason}}*.',
            },
          ]
        }}
      >
        <Icon src={Plus} mini size="16" slot="prefix" />
        Add Preset
      </Button>
    </Setting>
  </Section>

  <Section title="Other">
    <ToggleSetting
      bind:checked={$userSettings.debugInfo}
      title="Debug info"
      description="Display debug information"
    />
  </Section>
</div>
