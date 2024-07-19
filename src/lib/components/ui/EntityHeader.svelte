<script lang="ts">
  import { Material } from 'mono-svelte'
  import Avatar from './Avatar.svelte'
  import PostBody from '../lemmy/post/PostBody.svelte'
  import LabelStat from './LabelStat.svelte'

  export let avatar: string | undefined = undefined
  export let name: string
  export let bio: string | undefined = undefined
  export let banner: string | undefined = undefined
  export let stats: {
    name: string
    value: string
  }[] = []
</script>

<Material class="flex flex-col gap-4" color="transparent" padding="none">
  {#if banner}
    <div class="max-h-32 overflow-visible">
      <img
        src={banner}
        class="w-full object-cover h-max max-h-48 rounded-lg rounded-b-none"
        height="192"
        alt="User banner"
      />
    </div>
  {/if}
  <div class="p-4 flex flex-row gap-3">
    <div class="gap-3 flex flex-col flex-1">
      <Avatar
        width={64}
        url={avatar}
        alt={name}
        class="ring-4 ring-slate-25 dark:ring-zinc-925"
      />
      <div class="space-y-1">
        <span class="text-lg font-semibold">
          {name}
        </span>
        <span
          class="flex items-center gap-0 text-sm text-slate-600 dark:text-zinc-400"
        >
          <slot name="nameDetail" />
        </span>
      </div>
      <div class="relative">
        {#if bio}
          <PostBody class="text-sm" view="list" body={bio} clickThrough />
        {/if}
      </div>
      {#if stats.length > 0}
        <div class="text-sm flex flex-row flex-wrap gap-3">
          {#each stats as stat}
            <LabelStat content={stat.value} formatted label={stat.name} />
          {/each}
        </div>
      {/if}
      <slot />
    </div>
  </div>
</Material>
