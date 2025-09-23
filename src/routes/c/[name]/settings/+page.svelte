<script lang="ts">
  import CommunityForm from '$comp/lemmy/community/CommunityForm.svelte'
  import CommunityTitle from '$comp/lemmy/community/CommunityTitle.svelte'
  import { Header } from '$comp/ui/layout'

  let { data } = $props()
</script>

<div class="flex flex-col gap-4">
  <Header pageHeader>
    <span>Settings</span>
    {#snippet extended()}
      <CommunityTitle
        community={data.community.value.community_view.community}
      />
    {/snippet}
  </Header>
  <CommunityForm
    edit={data.community.value.community_view.community.id}
    formData={{
      name: data.community.value.community_view.community.name,
      displayName: data.community.value.community_view.community.title,
      nsfw: data.community.value.community_view.community.nsfw,
      postsLockedToModerators:
        data.community.value.community_view.community
          .posting_restricted_to_mods,
      sidebar: data.community.value.community_view.community.description ?? '',
      icon: data.community.value.community_view.community.icon,
      banner: data.community.value.community_view.community.banner,
      visibility: data.community.value.community_view.community.visibility,
      submitting: false,
      languages: data.community.value.discussion_languages,
    }}
  >
    {#snippet formtitle()}{/snippet}
  </CommunityForm>
</div>
