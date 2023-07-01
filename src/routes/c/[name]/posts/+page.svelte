<script lang="ts">
  import MultiSelect from '$lib/components/MultiSelect.svelte'
  import Avatar from '../../../post/[id]/Avatar.svelte'
  import Post from '../../../post/[id]/Post.svelte'

  export let data
</script>

<div class="flex flex-row gap-4 justify-between">
  <div class="flex flex-col gap-4">
    {#each data.posts as post}
      <Post {post} />
    {/each}
  </div>
  <div
    class="bg-white border border-slate-200 dark:border-zinc-800
  dark:bg-zinc-900 flex flex-col gap-4 p-8 max-w-sm rounded-md h-max"
  >
    <Avatar
      width={48}
      url={data.community_view.community.icon ??
        `https://api.dicebear.com/6.x/initials/svg?seed=${data.community_view.community.name}`}
      alt={data.community_view.community.name}
    />
    <h1 class="font-bold text-lg">{data.community_view.community.name}</h1>
    <p>{data.community_view.community.description}</p>
  </div>
</div>
