<script lang="ts">
  import { getClient } from '$lib/lemmy.js'
  import type { CommunityView } from 'lemmy-js-client'
  import { profile } from '$lib/auth.js'
  import { toast } from '$lib/components/ui/toasts/toasts.js'

  export let community: CommunityView

  let subscribing = false

  async function subscribe() {
    if (!$profile?.jwt) return

    subscribing = true

    try {
      const res = await getClient().followCommunity({
        auth: $profile.jwt,
        community_id: community.community.id,
        follow: community.subscribed == 'NotSubscribed',
      })

      subscribing = false
      return res
    } catch (error) {
      toast({ content: 'Failed to subscribe to community', type: 'error' })
    }

    subscribing = false
  }
</script>

<slot {subscribe} {subscribing} />
