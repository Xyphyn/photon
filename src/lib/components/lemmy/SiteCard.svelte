<script lang="ts">
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { t } from '$lib/i18n/translations'
  import { userLink } from '$lib/lemmy/generic'
  import { settings } from '$lib/settings.svelte'
  import type { PersonView, SiteView, Tagline } from 'lemmy-js-client'
  import { Badge } from 'mono-svelte'
  import { Icon, ServerStack } from 'svelte-hero-icons'
  import Link from '../input/Link.svelte'
  import Expandable from '../ui/Expandable.svelte'
  import LabelStat from '../ui/LabelStat.svelte'
  import CommonList from '../ui/layout/CommonList.svelte'
  import SidebarButton from '../ui/sidebar/SidebarButton.svelte'
  import { optimizeImageURL } from './post/helpers'

  interface Props {
    site: SiteView
    taglines?: Tagline[] | undefined
    admins?: PersonView[] | undefined
    version?: string | undefined
    class?: string
  }

  let {
    site,
    taglines = undefined,
    admins = undefined,
    version = undefined,
    class: clazz = '',
  }: Props = $props()
</script>

<div
  class={[
    'w-full text-slate-600 dark:text-zinc-400 flex flex-col gap-4 text-sm',
    clazz,
  ]}
>
  {#if site.site.banner}
    <div
      class="rounded-xl
     bg-slate-100 dark:bg-zinc-925"
    >
      <img
        src={optimizeImageURL(site.site.banner, 512)}
        alt="Site banner"
        class="h-32 object-cover w-full"
        style="border-radius: inherit;"
      />
    </div>
  {/if}
  <Avatar width={32} url={site.site.icon} alt="" circle={false} />
  <h2 class="font-medium text-lg -my-2">{site.site.name}</h2>
  <div class="flex flex-col gap-1">
    {#if taglines && taglines.length > 0}
      <Markdown
        class="pt-0!"
        source={taglines[Math.floor(Math.random() * taglines.length)].content}
      />
    {/if}

    <hr class="border-slate-200 dark:border-zinc-900 my-1" />
    <Expandable bind:open={settings.expand.about}>
      {#snippet title()}
        <span class="flex items-center gap-1 py-1 px-2 w-full">
          {$t('cards.site.about')}
        </span>
      {/snippet}
      <Markdown source={site.site.description} />
      <div class="my-4"></div>
      <Markdown source={site.site.sidebar} />

      {#if version}
        <div class="w-max">
          <Badge label="Lemmy version">
            <Icon src={ServerStack} micro size="14" />
            {version}
          </Badge>
        </div>
      {/if}
    </Expandable>

    <hr class="border-slate-200 dark:border-zinc-900 my-1" />
    <Expandable bind:open={settings.expand.stats}>
      {#snippet title()}
        <span class="flex items-center gap-1 py-1 px-2 w-full">
          {$t('cards.site.stats')}
        </span>
      {/snippet}
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
      <hr class="border-slate-200 dark:border-zinc-900 my-1" />
      <Expandable bind:open={settings.expand.team}>
        {#snippet title()}
          <span class="flex items-center gap-1 py-1 px-2 w-full">
            {$t('cards.site.admins')}
          </span>
        {/snippet}
        <CommonList
          animate={false}
          size="xs"
          items={admins}
          class="px-1 py-0.5"
        >
          {#snippet item(admin)}
            <SidebarButton
              class="font-normal w-full h-max"
              color="none"
              alignment="left"
              href={userLink(admin.person)}
            >
              {#snippet customIcon()}
                <Avatar
                  url={admin.person.avatar}
                  alt={admin.person.name}
                  width={28}
                />{/snippet}
              {#snippet label()}
                <div class="flex flex-col max-w-full break-words">
                  <span>{admin.person.display_name ?? admin.person.name}</span>
                  <span class="text-xs text-slate-600 dark:text-zinc-400">
                    {new URL(admin.person.actor_id).hostname}
                  </span>
                </div>
              {/snippet}
            </SidebarButton>
          {/snippet}
        </CommonList>
      </Expandable>
    {/if}

    <div class="flex flex-row flex-wrap gap-1 my-2 text-xs">
      <Link highlight href="/modlog">
        {$t('routes.modlog.title')}
      </Link>
      •
      <Link highlight href="/legal">
        {$t('routes.legal.title')}
      </Link>
      •
      <Link highlight href="/instances">
        {$t('routes.instances')}
      </Link>
    </div>
  </div>
</div>
