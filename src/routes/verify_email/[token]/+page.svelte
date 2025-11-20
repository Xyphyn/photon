<script>
  import { t } from '$lib/app/i18n'
  import { LINKED_INSTANCE_URL } from '$lib/app/instance.svelte'
  import { Header } from '$lib/ui/layout'
  import { Material } from 'mono-svelte'
</script>

<div class="flex flex-col h-max my-auto gap-2 max-w-xl mx-auto">
  <Material rounding="3xl" padding="xl" color="success" class="space-y-2">
    <Header>
      {$t('message.success')}
    </Header>
    <p class="text-lg">{$t('routes.verifyEmail.message')}</p>
  </Material>
  {#if !LINKED_INSTANCE_URL}
    <p>
      You somehow got to this menu despite not being linked here by the email.
      Nice!
    </p>
  {/if}
</div>
