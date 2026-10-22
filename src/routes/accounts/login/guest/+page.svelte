<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { Button } from 'mono-svelte'
  import { ArrowLeft, Icon } from 'svelte-hero-icons/dist'
  import LoginPage from '../../../login/guest/+page.svelte'
</script>

<LoginPage ref="/accounts">
  <Button
    size="custom"
    color="none"
    class="w-max hover:underline text-slate-600 dark:text-zinc-400"
    onclick={() => history?.back()}
  >
    <Icon src={ArrowLeft} size="16" micro class="rtl:-scale-x-100" />
    {$t('account.accounts')}
  </Button>
</LoginPage>
