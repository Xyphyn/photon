<script lang="ts">
  import { t } from '$lib/app/i18n'
  import type { Filter } from '$lib/feature/post/filters'
  import Switch from '$lib/ui/form/Switch.svelte'
  import { Button, TextInput } from 'mono-svelte'
  import { Trash } from 'svelte-hero-icons/dist'

  interface Props {
    filter: Filter
    onremove?: () => void
  }

  let { filter = $bindable(), onremove }: Props = $props()
</script>

<li
  class="adaptive px-3 py-1 flex flex-col md:flex-row md:items-center xs gap-4"
>
  <TextInput bind:value={filter.match} label="" class="flex-1"></TextInput>
  <Switch
    options={['hide', 'minimize', 'none']}
    optionNames={[
      $t('settings.lemmy.contentFilter.hide'),
      $t('settings.lemmy.contentFilter.minimize'),
      $t('settings.lemmy.contentFilter.disabled'),
    ]}
    bind:selected={filter.action}
  />
  <Button
    icon={Trash}
    size="square-md"
    onclick={onremove}
    aria-label={$t('common.remove')}
  />
</li>

<style>
  li {
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    margin-top: calc(var(--spacing) * -1);
    border-top: none !important;
  }
</style>
