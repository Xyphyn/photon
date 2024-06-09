<script lang="ts">
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import { t } from '$lib/translations'
  import { Heart, Icon } from 'svelte-hero-icons'
</script>

<Header class="mb-4">
  {$t('routes.translators')}
</Header>
<ul class="divide-y divide-slate-200 dark:divide-zinc-900 list">
  <li class="flex flex-col">
    <span class="font-bold text-lg">Estonian</span>
    <span>pewgar_seemsimandroid@lemmy.blahaj.zone</span>
  </li>
  <li class="flex flex-col">
    <span class="font-bold text-lg">Finnish</span>
    <span>sevonj</span>
  </li>
  <li class="flex flex-col">
    <span class="font-bold text-lg">French</span>
    <span>Blisterexe@lemmy.zip</span>
  </li>
  <li class="flex flex-col">
    <span class="font-bold text-lg">German</span>
    <span>Tmpod</span>
  </li>
  <li class="flex flex-col">
    <span class="font-bold text-lg">Portuguese</span>
    <span>poVoq</span>
  </li>
</ul>

<style>
  .list > *:not(:first-child) {
    padding-top: 0.5rem;
  }
  .list > *:not(:last-child) {
    padding-bottom: 0.5rem;
  }
</style>
