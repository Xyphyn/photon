<script lang="ts">
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import StickyCard from '$lib/components/ui/StickyCard.svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import { getClient } from '$lib/lemmy.js'
  import type { PersonView, SiteView, Tagline } from 'lemmy-js-client'
  import { Button, Disclosure, Popover } from 'mono-svelte'
  import {
    BuildingOffice,
    Calendar,
    ChartBar,
    ChatBubbleOvalLeftEllipsis,
    Icon,
    InformationCircle,
    Newspaper,
    PencilSquare,
    ServerStack,
    UserGroup,
  } from 'svelte-hero-icons'
  import Expandable from '../ui/Expandable.svelte'
  import LabelStat from '../ui/LabelStat.svelte'

  export let site: SiteView
  export let taglines: Tagline[] | undefined = undefined
  export let admins: PersonView[] | undefined = undefined
  export let version: string | undefined = undefined
</script>

<StickyCard class="w-full {$$props.class} text-slate-600 dark:text-zinc-400">
  <div class="flex flex-row gap-3 items-center">
    {#if site.site.icon}
      <Avatar
        width={32}
        url={site.site.icon}
        alt={site.site.name}
        circle={false}
      />
    {/if}
    <div class="flex flex-col">
      <h1 class="font-bold text-base">{site.site.name}</h1>
      <span class="text-sm opacity-60">
        {new URL(site.site.actor_id).hostname}
      </span>
    </div>
  </div>
  <div class="flex flex-row gap-1 !border-0">
    <Button href="/modlog" title="Modlog" color="ghost" size="square-md">
      <Icon src={Newspaper} size="16" mini />
    </Button>
    <Button href="/legal" title="Legal" color="ghost" size="square-md">
      <Icon src={BuildingOffice} size="16" mini />
    </Button>
    <Button
      href="/instances"
      title="Instances"
      class="3xl:rounded-l-none"
      color="ghost"
      size="square-md"
    >
      <Icon src={ServerStack} size="16" mini />
    </Button>
  </div>

  <div
    class="flex flex-col [&>*]:py-3 divide-y divide-slate-200 dark:divide-zinc-800"
  >
    {#if taglines && taglines.length > 0}
      <Markdown
        class="!pt-0"
        source={taglines[Math.floor(Math.random() * taglines.length)].content}
      />
    {/if}

    <Expandable>
      <svelte:fragment slot="title">
        <Icon src={InformationCircle} size="15" mini /> About
      </svelte:fragment>
      <Markdown source={site.site.description} />
      <div class="my-4" />
      <Markdown source={site.site.sidebar} />
    </Expandable>

    <Expandable>
      <svelte:fragment slot="title">
        <Icon src={ChartBar} size="15" mini /> Stats
      </svelte:fragment>
      <div class="flex flex-row gap-4 flex-wrap">
        <LabelStat
          label="Users"
          content={site.counts.users.toString()}
          formatted
        />
        <LabelStat
          label="Posts"
          content={site.counts.posts.toString()}
          formatted
        />
        <LabelStat
          label="Communities"
          content={site.counts.communities.toString()}
          formatted
        />
      </div>
    </Expandable>

    {#if admins}
      <Expandable>
        <svelte:fragment slot="title">
          <Icon src={UserGroup} size="15" mini /> Admins
        </svelte:fragment>
        <div
          class="flex items-center flex-wrap group transition-all
        cursor-pointer"
        >
          {#each admins as admin}
            <Popover openOnHover placement="top">
              <a
                class="block ring rounded-full ring-slate-50 dark:ring-zinc-950 transition-all -mx-0.5 group-hover:mx-0.5"
                href="/u/{admin.person.name}@{new URL(admin.person.actor_id)
                  .hostname}"
                slot="target"
              >
                <Avatar
                  width={28}
                  url={admin.person.avatar}
                  alt={admin.person.name}
                />
              </a>
              <span class="font-bold">{admin.person.name}</span>
            </Popover>
          {/each}
        </div>
      </Expandable>
    {/if}

    {#if version}
      <span
        class="text-slate-600 flex flex-row items-center gap-1 dark:text-zinc-400"
        title="Lemmy version"
      >
        <Icon src={ServerStack} mini size="16" />
        {version}
      </span>
    {/if}
  </div>
</StickyCard>
