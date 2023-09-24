<script lang="ts">
  import { defaultSettings, userSettings } from '$lib/settings'
  import Setting from './Setting.svelte'
  import MultiSelect from '$lib/components/input/Switch.svelte'
  import Sort from '$lib/components/lemmy/Sort.svelte'
  import { Disclosure, Material, TextInput, toast } from 'mono-svelte'
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

<div
  class="flex flex-row md:divide-x divide-slate-200 dark:divide-zinc-800"
  style="scroll-behavior: smooth;"
>
  <nav class="hidden md:flex flex-col gap-2 w-64 pr-4 pt-4 sticky top-16 h-max">
    <SectionTitle>Navigation</SectionTitle>
    <Button href="#ui" alignment="left" color="tertiary">UI</Button>
    <Button href="#posts" alignment="left" color="tertiary">Posts</Button>
    <Button href="#instances" alignment="left" color="tertiary">
      Instances
    </Button>
    <Button href="#other" alignment="left" color="tertiary">Other</Button>
  </nav>
  <div class="flex flex-col md:flex-1 md:pl-4 min-w-0">
    <SectionTitle id="ui" class="mt-4">UI</SectionTitle>
    <Setting>
      <span slot="title">Post style</span>
      <ViewSelect />
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
    <Setting>
      <span slot="title">Random placeholders</span>
      <span slot="description">
        Show a random placeholder for forms for comments, posts, etc.
      </span>
      <Checkbox bind:checked={$userSettings.randomPlaceholders}>
        {$userSettings.randomPlaceholders ? 'Enabled' : 'Disabled'}
      </Checkbox>
    </Setting>
    <Setting>
      <span slot="title">Limit Layout Width</span>
      <span slot="description">
        Improve readability by limiting main content width.
      </span>
      <Checkbox bind:checked={$userSettings.newWidth}>
        {$userSettings.newWidth ? 'Enabled' : 'Disabled'}
      </Checkbox>
    </Setting>

    <Setting>
      <span slot="title">Default sort</span>
      <span slot="description">The default sort to use for feeds.</span>
      <div class="flex flex-wrap flex-row gap-4 w-full">
        <div class="max-w-full">
          <Select bind:value={$userSettings.defaultSort.feed} class="w-28">
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
      <span slot="title">Use display name</span>
      <span slot="description">
        Show a user's display name instead of their account username.
      </span>

      <Checkbox bind:checked={$userSettings.displayNames}>
        {$userSettings.displayNames ? 'Enabled' : 'Disabled'}
      </Checkbox>
    </Setting>

    <SectionTitle class="mt-4" id="posts">Posts</SectionTitle>
    <Setting>
      <span slot="title">Fade read posts</span>
      <span slot="description">
        Fade the title of posts you've already read.
      </span>
      <Checkbox bind:checked={$userSettings.markReadPosts}>
        {$userSettings.markReadPosts ? 'Enabled' : 'Disabled'}
      </Checkbox>
    </Setting>
    <Setting>
      <span slot="title">NSFW blur</span>
      <span slot="description">
        Blur images and remove post bodies of NSFW content.
      </span>
      <Checkbox bind:checked={$userSettings.nsfwBlur}>
        {$userSettings.nsfwBlur ? 'Enabled' : 'Disabled'}
      </Checkbox>
    </Setting>
    <Setting>
      <span slot="title">Expand Images</span>
      <span slot="description">
        Clicking on an image brings you to an expanded view rather than sending
        you to the post page.
      </span>
      <Checkbox bind:checked={$userSettings.expandImages}>
        {$userSettings.expandImages ? 'Enabled' : 'Disabled'}
      </Checkbox>
    </Setting>
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
      <Setting>
        <span slot="title">
          Remove original project's credit because you don't like the creator as
          a person
        </span>
        <span slot="description">
          Disable the "Powered by Photon" in the top left corner, thus
          decreasing visibility of the original project and limiting discovery.
          The creator of Photon intentionally made it unobtrusive, but if you
          want to remove it because a 120x16 div bothers you so much, you have
          that option.
        </span>
        <Checkbox bind:checked={$userSettings.hidePhoton}>
          {$userSettings.hidePhoton ? 'Enabled' : 'Disabled'}
        </Checkbox>
      </Setting>
    {/if}

    <SectionTitle class="mt-4" id="instances">Instances</SectionTitle>
    <Setting>
      <span slot="title">Show instances</span>
      <span slot="description">Show items' instances.</span>
      <span
        class="flex gap-0 px-3 py-2 bg-slate-100 dark:bg-zinc-800 rounded-md w-max"
      >
        Xylight
        <span class="opacity-50">@example.com</span>
      </span>
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

    <SectionTitle class="mt-4" id="moderation">Moderation</SectionTitle>
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
        <Material color="distinct" padding="md" class="py-3">
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

    <SectionTitle class="mt-4" id="other">Other</SectionTitle>
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
      <span slot="title">Debug Info</span>
      <span slot="description">
        Show an option to show debug information. (in posts and such)
      </span>

      <Checkbox bind:checked={$userSettings.debugInfo}>
        {$userSettings.debugInfo ? 'Enabled' : 'Disabled'}
      </Checkbox>
    </Setting>
  </div>
</div>
