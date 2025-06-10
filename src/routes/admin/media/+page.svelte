<script lang="ts">
  import { page } from '$app/state'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import { t } from '$lib/i18n/translations'
  import { flip } from 'svelte/animate'
  import PictrsImage from '$lib/components/lemmy/PictrsImage.svelte'
  import { expoInOut } from 'svelte/easing'

  let { data = $bindable() } = $props()
</script>

<Header pageHeader>{$t('routes.profile.media.title')}</Header>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {#each data.images as image (image.local_image.pictrs_delete_token)}
    <div animate:flip={{ duration: 500, easing: expoInOut }}>
      <PictrsImage
        image={image.local_image}
        user={image.person}
        ondelete={() => {
          data.images = data.images.toSpliced(
            data.images.findIndex(
              i =>
                i.local_image.pictrs_delete_token ==
                image.local_image.pictrs_delete_token,
            ),
            1,
          )
        }}
      />
    </div>
  {/each}
</div>
{#if data.images.length == 20}
  <Pageination
    page={Number(page.url.searchParams.get('page')) || 1}
    href={page => `?page=${page}`}
  />
{/if}
