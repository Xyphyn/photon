<script>
  import { LINKED_INSTANCE_URL } from '$lib/instance.svelte'
  import { t } from '$lib/i18n/translations'
  import { CheckCircle, Icon } from 'svelte-hero-icons'
</script>

<div class="flex flex-col h-max my-auto gap-2 max-w-xl mx-auto">
  <div
    class="rounded-full bg-green-200 dark:bg-green-500/20 text-white p-2 w-max"
  >
    <Icon src={CheckCircle} size="48" solid />
  </div>
  <h1
    class="text-green-800 dark:text-green-200 text-2xl font-medium tracking-tight"
  >
    {$t('message.success')}
  </h1>
  <p class="text-green-800 dark:text-green-200">
    {$t('routes.verifyEmail.message')}
  </p>
  {#if !LINKED_INSTANCE_URL}
    <p>
      You somehow got to this menu despite not being linked here by the email.
      Nice!
    </p>
  {/if}
</div>
