<script lang="ts">
  import Switch from '$lib/components/input/Switch.svelte'
  import { defaultSettings, userSettings } from '$lib/settings'
  import Setting from './Setting.svelte'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import Sort from '$lib/components/lemmy/Sort.svelte'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import Button from '$lib/components/input/Button.svelte'
  import { getInboxNotifications } from '$lib/auth.js'
  import Checkbox from '$lib/components/input/Checkbox.svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'
  import Link from '$lib/components/input/Link.svelte'
  import { ArrowLeftCircle, ArrowPath, Icon } from 'svelte-hero-icons'
  import TextArea from '$lib/components/input/TextArea.svelte'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { removalTemplate } from '$lib/components/lemmy/moderation/moderation.js'
  import { locale, locales } from 'svelte-i18n'

  const localeNames = {
    en: {
      name: '🇬🇧 English (1%)',
      translated: '5%',
    },
    es: {
      name: '🇪🇸 Espanol (1%)',
      translated: '1%',
    },
  }

  const getLocaleName = (name: string) =>
    // @ts-ignore
    localeNames[name] ?? { name: 'Browser Default', translated: '0%' }
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<div class="flex flex-col">
  <h1 class="text-3xl font-bold flex justify-between">
    Settings <Button
      on:click={() => {
        toast({
          content:
            'Are you sure you want to reset your settings to the default?',
          action: () => ($userSettings = defaultSettings),
        })
      }}
      class="font-normal"
    >
      <Icon src={ArrowPath} mini size="16" slot="icon" />
      Reset to default
    </Button>
  </h1>
  <SectionTitle class="mt-4">General</SectionTitle>
  <Setting>
    <span slot="title">Default sort</span>
    <span slot="description">The default sort to use for feeds.</span>
    <div class="flex flex-wrap flex-row gap-4 w-full">
      <div class="max-w-full">
        <span class="block my-1 font-bold">Feed</span>
        <MultiSelect
          options={['Subscribed', 'Local', 'All']}
          bind:selected={$userSettings.defaultSort.feed}
        />
      </div>
      <div class="max-w-full">
        <span class="block my-1 font-bold">Sort</span>
        <Sort bind:selected={$userSettings.defaultSort.sort} navigate={false} />
      </div>
      <div class="max-w-full">
        <span class="block my-1 font-bold">Comments</span>
        <MultiSelect
          options={['Hot', 'Top', 'New']}
          bind:selected={$userSettings.defaultSort.comments}
        />
      </div>
    </div>
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
    <Checkbox slot="title" bind:checked={$userSettings.displayNames}>
      Use display name
    </Checkbox>
    <span slot="description">
      Show a user's display name instead of their account username.
    </span>
  </Setting>
  <Setting>
    <Checkbox slot="title" bind:checked={$userSettings.randomPlaceholders}>
      Random placeholders
    </Checkbox>
    <span slot="description">
      Show a random placeholder for forms for comments, posts, etc.
    </span>
  </Setting>
  <Setting>
    <span slot="title">Language</span>
    <span slot="description">What language to set the UI to. (Beta)</span>
    <select bind:value={$userSettings.language}>
      {#each $locales as locale}
        <option value={locale}>
          {getLocaleName(locale)?.name}
        </option>
      {/each}
    </select>
  </Setting>

  <SectionTitle class="mt-4">UI</SectionTitle>
  <Setting>
    <Checkbox bind:checked={$userSettings.markReadPosts} slot="title">
      Mark read posts
    </Checkbox>
    <span slot="description">Fade the title of posts you've already read.</span>
  </Setting>
  <Setting>
    <Checkbox bind:checked={$userSettings.revertColors} slot="title">
      Revert vote colors
    </Checkbox>
    <span slot="description">
      Make upvotes orange and downvotes blue, like Reddit used to do.
    </span>
  </Setting>
  <Setting>
    <span slot="title">Post style</span>
    <MultiSelect
      options={[false, true]}
      optionNames={['Cards', 'Compact']}
      bind:selected={$userSettings.showCompactPosts}
    />
  </Setting>
  <Setting>
    <Checkbox bind:checked={$userSettings.nsfwBlur} slot="title">
      NSFW blur
    </Checkbox>
    <span slot="description">Blur images of NSFW content.</span>
  </Setting>
  <Setting>
    <Checkbox bind:checked={$userSettings.newVote} slot="title">
      New vote design
    </Checkbox>
    <span slot="description">Alternate vote design</span>
  </Setting>

  <SectionTitle class="mt-4">Instances</SectionTitle>
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
      <Checkbox bind:checked={$userSettings.showInstances.user}>Users</Checkbox>
      <Checkbox bind:checked={$userSettings.showInstances.comments}>
        Comments
      </Checkbox>
      <Checkbox bind:checked={$userSettings.showInstances.community}>
        Communities
      </Checkbox>
    </div>
  </Setting>

  <SectionTitle class="mt-4">Moderation</SectionTitle>
  <Setting>
    <span slot="title">Removal reply preset</span>
    <span slot="description">
      <p>The preset to use for "Reply reason" in a submission removal.</p>
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
    <MarkdownEditor
      bind:value={$userSettings.moderation.removalReasonPreset}
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
  </Setting>

  <SectionTitle class="mt-4">Other</SectionTitle>
  <Setting>
    <span slot="title">Font</span>
    <span slot="description">What font Photon should use.</span>
    <MultiSelect
      options={[true, false]}
      optionNames={['System UI', 'Browser Font']}
      bind:selected={$userSettings.systemUI}
    />
  </Setting>
  <Setting>
    <Checkbox bind:checked={$userSettings.debugInfo} slot="title">
      Debug Info
    </Checkbox>
    <span slot="description">
      Show an option to show debug information. (in posts and such)
    </span>
  </Setting>
</div>
