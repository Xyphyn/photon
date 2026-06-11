<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { proxify } from '$lib/app/util/reactivity.svelte.js'
  import PictrsImage from '$lib/feature/user/PictrsImage.svelte'
  import Fixate from '$lib/ui/generic/Fixate.svelte'
  import { Header, Pageination } from '$lib/ui/layout'
  import { flip } from 'svelte/animate'
  import { expoInOut } from 'svelte/easing'

  let { data } = $props()

  let images = $derived(proxify(data.images))
</script>

<Header pageHeader>{$t('routes.profile.media.title')}</Header>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {#each images as image (image.local_image.pictrs_alias)}
    <div animate:flip={{ duration: 500, easing: expoInOut }}>
      <PictrsImage
        image={image.local_image}
        user={image.person}
        ondelete={() => {
          images = images.filter(
            (i) => i.local_image.pictrs_alias !== image.local_image.pictrs_alias,
          )
        }}
      />
    </div>
  {/each}
</div>
<Fixate placement="bottom">
  <Pageination
    cursor={{
      next: data.next,
      back: data.prev,
    }}
    href={(cursor) => `?cursor=${cursor}`}
    hasMore={data.next != null}
  />
</Fixate>
