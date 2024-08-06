<script lang="ts">
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import { t } from '$lib/translations'
</script>

<Header pageHeader>{$t('routes.translators')}</Header>
<ul class="top-list">
  <li>Chinese (Simplified)</li>
  <ul>
    <li>qiancsf (611)</li>
    <li>binary yen (150)</li>
  </ul>
  <li>Chinese (Traditional)</li>
  <ul>
    <li>binary yen (161)</li>
  </ul>
  <li>Dutch</li>
  <ul>
    <li>Qaz C. (554)</li>
  </ul>
  <li>Estonian</li>
  <ul>
    <li>pewgar (9)</li>
  </ul>
  <li>Finnish</li>
  <ul>
    <li>Sevon (693)</li>
  </ul>
  <li>French</li>
  <ul>
    <li>Blisterexe (447)</li>
    <li>Romain (9)</li>
  </ul>
  <li>German</li>
  <ul>
    <li>poVoq (344)</li>
    <li>Tywele (155)</li>
  </ul>
  <li>Portuguese</li>
  <ul>
    <li>tmpod (649)</li>
    <li>poVoq (1)</li>
  </ul>
</ul>

<style>
  ul:not(.top-list) {
    padding-left: 2rem;
  }

  ul {
    padding-left: 1rem;
    list-style: disc;
  }

  .top-list > li {
    font-weight: bold;
    font-size: large;
  }
</style>
