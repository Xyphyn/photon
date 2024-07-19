<script lang="ts">
  import { getClient } from '$lib/lemmy.js'
  import type { CommunityView, SubscribedType } from 'lemmy-js-client'
  import { profile } from '$lib/auth.js'
  import { toast } from 'mono-svelte'

  export let community: CommunityView | undefined = undefined

  let subscribing = false

  async function subscribe(
    id: number | undefined = community?.community.id,
    subscribed: SubscribedType | undefined = community?.subscribed,
  ) {
    if (!$profile?.jwt) return
    if (!id || !subscribed) return

    subscribing = true

    try {
      const res = await getClient().followCommunity({
        community_id: id,
        follow: subscribed == 'NotSubscribed',
      })

      subscribing = false
      return res
    } catch (error) {
      toast({ content: error as any, type: 'error' })
    }

    subscribing = false
  }
</script>

<slot {subscribe} {subscribing} />
