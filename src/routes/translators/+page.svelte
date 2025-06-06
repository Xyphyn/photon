<script>
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import { t } from '$lib/i18n/translations'
</script>

<Header pageHeader>
  {$t('routes.translators')}
</Header>

<ul class="top-list">
  <li>Arabic</li>
  <ul>
    <li>fxomt (232)</li>
  </ul>

  <li>Bulgarian</li>
  <ul>
    <li>Salif Mehmed (468)</li>
  </ul>

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
    <li>pewgar kiterland (9)</li>
  </ul>

  <li>Finnish</li>
  <ul>
    <li>Sevon (735)</li>
  </ul>

  <li>French</li>
  <ul>
    <li>Blisterexe (518)</li>
    <li>Romain (9)</li>
  </ul>

  <li>German</li>
  <ul>
    <li>poVoq (344)</li>
    <li>Tywele (155)</li>
  </ul>

  <li>Hebrew</li>
  <ul></ul>

  <li>Japanese</li>
  <ul>
    <li>Rentlar (634)</li>
  </ul>

  <li>Polish</li>
  <ul>
    <li>John Doe (579)</li>
  </ul>

  <li>Portuguese</li>
  <ul>
    <li>tmpod (649)</li>
    <li>poVoq (1)</li>
  </ul>
</ul>

<style>
  ul {
    padding-left: 2rem;
  }

  .top-list > li {
    font-weight: bold;
  }
</style>
