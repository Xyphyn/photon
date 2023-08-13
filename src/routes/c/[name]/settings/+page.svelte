<script lang="ts">
  import CommunityForm from '$lib/components/lemmy/community/CommunityForm.svelte'
  import CommunityTitle from '$lib/components/lemmy/community/CommunityTitle.svelte'

  export let data
</script>

<div class="flex flex-col gap-4">
  <CommunityTitle community={data.community.community_view.community} />
  <h1 class="font-bold text-2xl">Settings</h1>
  <CommunityForm
    edit={data.community.community_view.community.id}
    formData={{
      name: data.community.community_view.community.name,
      displayName: data.community.community_view.community.title,
      nsfw: data.community.community_view.community.nsfw,
      postsLockedToModerators:
        data.community.community_view.community.posting_restricted_to_mods,
      sidebar: data.community.community_view.community.description ?? '',
      icon: null,
      banner: null,
      submitting: false,
    }}
  >
    <svelte:fragment slot="formtitle">{''}</svelte:fragment>
  </CommunityForm>
</div>
