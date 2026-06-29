<script lang="ts">
  import CommunityForm from '$lib/feature/community/CommunityForm.svelte'
  import { repos } from '$lib/feature/feeds/repo.svelte.js'
  import { Header } from '$lib/ui/layout'

  let { data } = $props()
  let community = $derived(repos.communities.get(data.community.community_view))
  let languages = $derived(data.community.discussion_languages)
</script>

<Header pageHeader>
  <span>Settings</span>
</Header>
<CommunityForm
  edit={community.community.id}
  formData={{
    name: community.community.name,
    displayName: community.community.title!,
    nsfw: community.community.nsfw,
    postsLockedToModerators: community.community.posting_restricted_to_mods,
    sidebar: community.community.summary ?? '',
    icon: community.community.icon,
    banner: community.community.banner,
    visibility: community.community.visibility,
    submitting: false,
    languages: languages,
  }}
>
  {#snippet formtitle()}{/snippet}
</CommunityForm>
