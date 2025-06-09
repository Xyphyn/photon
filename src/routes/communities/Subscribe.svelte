<script lang="ts">
  import { getClient } from '$lib/lemmy.svelte.js'
  import type {
    CommunityResponse,
    CommunityView,
    SubscribedType,
  } from 'lemmy-js-client'
  import { profile } from '$lib/auth.svelte.js'
  import { toast } from 'mono-svelte'
  import { errorMessage } from '$lib/lemmy/error'

  interface Props {
    community?: CommunityView | undefined
    children?: import('svelte').Snippet<
      [
        {
          subscribe: (
            id?: number,
            subscribed?: SubscribedType,
          ) => Promise<CommunityResponse | undefined>
          subscribing: boolean
        },
      ]
    >
  }

  let { community = undefined, children }: Props = $props()

  let subscribing = $state(false)

  async function subscribe(
    id: number | undefined = community?.community.id,
    subscribed: SubscribedType | undefined = community?.subscribed,
  ) {
    if (!profile.data?.jwt) return
    if (!id || !subscribed) return

    subscribing = true

    try {
      const res = await getClient().followCommunity({
        community_id: id,
        follow: subscribed == 'NotSubscribed',
      })

      subscribing = false
      return res
    } catch (err) {
      toast({ content: errorMessage(err as string), type: 'error' })
    }

    subscribing = false
  }
</script>

{@render children?.({ subscribe, subscribing })}
