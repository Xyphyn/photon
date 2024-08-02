<script lang="ts">
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import StickyCard from '$lib/components/ui/StickyCard.svelte'
  import type { PersonView, SiteView, Tagline } from 'lemmy-js-client'
  import { Badge, Button } from 'mono-svelte'
  import {
    BuildingOffice,
    ChartBar,
    Icon,
    InformationCircle,
    Newspaper,
    ServerStack,
    UserGroup,
  } from 'svelte-hero-icons'
  import Expandable from '../ui/Expandable.svelte'
  import LabelStat from '../ui/LabelStat.svelte'
  import ItemList from './generic/ItemList.svelte'
  import { userLink } from '$lib/lemmy/generic'
  import { t } from '$lib/translations'
  import Entity from '../ui/Entity.svelte'
  import { userSettings } from '$lib/settings'

  export let site: SiteView
  export let taglines: Tagline[] | undefined = undefined
  export let admins: PersonView[] | undefined = undefined
  export let version: string | undefined = undefined
</script>

<StickyCard class="w-full {$$props.class} text-slate-600 dark:text-zinc-400">
  <Entity name={site.site.name} label={new URL(site.site.actor_id).hostname}>
    <Avatar
      width={32}
      url={site.site.icon}
      alt={site.site.name}
      circle={false}
      slot="icon"
    />
  </Entity>
  <div class="flex flex-row gap-1 !border-0">
    <Button
      href="/modlog"
      title={$t('routes.modlog')}
      color="ghost"
      size="square-md"
    >
      <Icon src={Newspaper} size="16" mini />
    </Button>
    <Button
      href="/legal"
      title={$t('routes.legal.title')}
      color="ghost"
      size="square-md"
    >
      <Icon src={BuildingOffice} size="16" mini />
    </Button>
    <Button
      href="/instances"
      title={$t('routes.instances')}
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

    <Expandable bind:open={$userSettings.expand.about}>
      <svelte:fragment slot="title">
        <Icon src={InformationCircle} size="15" mini />
        {$t('cards.site.about')}
      </svelte:fragment>
      <Markdown source={site.site.description} />
      <div class="my-4" />
      <Markdown source={site.site.sidebar} />
    </Expandable>

    <Expandable bind:open={$userSettings.expand.stats}>
      <svelte:fragment slot="title">
        <Icon src={ChartBar} size="15" mini />
        {$t('cards.site.stats')}
      </svelte:fragment>
      <div class="flex flex-row gap-4 flex-wrap">
        <LabelStat
          label={$t('content.users')}
          content={site.counts.users.toString()}
          formatted
        />
        <LabelStat
          label={$t('content.posts')}
          content={site.counts.posts.toString()}
          formatted
        />
        <LabelStat
          label={$t('content.communities')}
          content={site.counts.communities.toString()}
          formatted
        />
      </div>
    </Expandable>

    {#if admins}
      <Expandable bind:open={$userSettings.expand.team}>
        <svelte:fragment slot="title">
          <Icon src={UserGroup} size="15" mini />
          {$t('cards.site.admins')}
        </svelte:fragment>
        <ItemList
          items={admins.map((a) => ({
            id: a.person.id,
            name: a.person.name,
            url: userLink(a.person),
            avatar: a.person.avatar,
            instance: new URL(a.person.actor_id).hostname,
          }))}
        />
      </Expandable>
    {/if}

    {#if version}
      <div class="w-max">
        <Badge title="Lemmy version">
          <Icon src={ServerStack} micro size="14" />
          {version}
        </Badge>
      </div>
    {/if}
  </div>
</StickyCard>
