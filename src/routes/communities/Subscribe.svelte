<script lang="ts">
  import { getClient } from '$lib/lemmy.js'
  import type {
    Community,
    CommunityView,
    SubscribedType,
  } from 'lemmy-js-client'
  import { authData } from '$lib/lemmy.js'
  import { ToastType, addToast } from '$lib/components/ui/toasts/toasts.js'

  export let community: CommunityView

  let subscribing = false

  async function subscribe() {
    if (!$authData?.token) return

    subscribing = true

    try {
      const res = await getClient().followCommunity({
        auth: $authData.token,
        community_id: community.community.id,
        follow: community.subscribed == 'NotSubscribed',
      })

      subscribing = false
      return res
    } catch (error) {
      addToast('Error', 'Failed to subscribe to community', ToastType.error)
    }

    subscribing = false
  }
</script>

<slot {subscribe} {subscribing} />
