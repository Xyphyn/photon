<script lang="ts" context="module">
  // Courtesy of https://github.com/asimons04
  export interface MBFCReport {
    bias: string
    credibility: string
    domain: string
    facebook?: string
    twitter?: string
    name: string
    popularity?: number
    questionable: string[]
    reporting: string
    url: string
    // biases?: MBFCBiases
    score?: number
  }

  export const findSource = async (
    target: string,
    dataset: any
  ): Promise<MBFCReport | undefined> => {
    if (!target) return undefined
    let left = 0
    let right = dataset.length

    while (left <= right) {
      const middle = Math.floor((left + right) / 2)
      const foundDomain = dataset[middle].domain
      if (foundDomain == target) return dataset[middle]
      else if (foundDomain < target) left = middle + 1
      else if (foundDomain > target) right = middle - 1
    }

    return undefined
  }
</script>

<script lang="ts">
  import { t } from '$lib/translations'

  import { Badge, Modal, Spinner } from 'mono-svelte'
  import Placeholder from '../ui/Placeholder.svelte'
  import { Icon, QuestionMarkCircle, Link as Chain } from 'svelte-hero-icons'
  import Link from '../input/Link.svelte'
  import Expandable from '../ui/Expandable.svelte'
  import Visualization from './Visualization.svelte'

  export let open: boolean = false
  export let domain: string = ''

  let ratings = ['left', 'left-center', 'center', 'right-center', 'right']
  let altRatings = [
    'conspiracy-pseudoscience',
    'pro-science',
    'satire',
    'fake-news',
  ]

  let reporting = [
    'very-low',
    'low',
    'mixed',
    'mostly-factual',
    'high',
    'Very-high',
  ]
</script>

<Modal title={$t('post.actions.more.mediaBias')} {...$$restProps} bind:open>
  {#await import('./data.json')}
    <div class="w-full h-64 flex flex-col gap-2 justify-center items-center">
      <Spinner width={48} />
      <span>{$t('post.actions.mediaBias.downloading')}</span>
    </div>
  {:then json}
    {#await findSource(domain, json.sources)}
      <span>{$t('post.actions.mediaBias.loading')}</span>
    {:then data}
      {#if data}
        <h2 class="font-semibold text-xl">{data.name}</h2>
        <Visualization
          data={ratings.includes(data.bias) ? ratings : altRatings}
          alt={!ratings.includes(data.bias)}
          selected={data.bias}
          name={json.biases.find((b) => b.bias == data.bias)?.name ?? data.bias}
        />

        <Expandable open>
          <span slot="title">{$t('post.actions.mediaBias.description')}</span>
          <p class="text-sm">
            {json.biases.find((b) => b.bias == data.bias)?.description}
          </p>
        </Expandable>
        {#if data.questionable?.length > 0}
          <div class="flex items-center flex-wrap gap-2">
            {#each data.questionable as questionable}
              <Badge color="red-subtle">
                <span>
                  {json.questionable.find((q) => q.questionable == questionable)
                    ?.name}
                </span>
              </Badge>
            {/each}
          </div>
        {/if}
        <h3 class="font-semibold text-lg">
          {$t('post.actions.mediaBias.reporting')}
        </h3>

        <Visualization
          data={reporting}
          alt
          width={24}
          selected={data.reporting}
          name={json.reporting.find((b) => b.reporting == data.reporting)
            ?.name ?? data.reporting}
        />
      {:else}
        <Placeholder
          icon={QuestionMarkCircle}
          title={$t('post.actions.mediaBias.noData.title')}
          description={$t('post.actions.mediaBias.noData.description')}
        />
      {/if}
      {#if data}
        <Link
          target="_blank"
          href="https://mediabiasfactcheck.com/{data.name}"
          class="text-sm text-slate-700 dark:text-zinc-300"
        >
          <Icon src={Chain} micro size="14" />
          mediabiasfactcheck.com
        </Link>
      {/if}
    {/await}
  {/await}
</Modal>
