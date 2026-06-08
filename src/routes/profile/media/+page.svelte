<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { Listing } from '$lib/feature/feeds/listing.svelte.js'
  import PictrsImage from '$lib/feature/user/PictrsImage.svelte'
  import Fixate from '$lib/ui/generic/Fixate.svelte'
  import { Header, Pageination } from '$lib/ui/layout'
  import { flip } from 'svelte/animate'
  import { expoInOut } from 'svelte/easing'

  let { data } = $props()

  let listing = $derived(new Listing(data.images, (i) => i))
</script>

<Header pageHeader>{$t('routes.admin.media.title')}</Header>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {#each listing.items as image (image.local_image.pictrs_alias)}
    <div animate:flip={{ duration: 500, easing: expoInOut }}>
      <PictrsImage
        image={image.local_image}
        ondelete={() =>
          listing.items.splice(
            data.images.findIndex(
              (i) => i.local_image.pictrs_alias == image.local_image.pictrs_alias,
            ),
            1,
          )}
      />
    </div>
  {/each}
</div>
{#if data.params.next != null || data.params.prev != null}
  <Fixate placement="bottom">
    <Pageination
      cursor={{
        next: data.params.next,
        back: data.params.prev,
      }}
      hasMore={data.params.next != null}
    />
  </Fixate>
{/if}
