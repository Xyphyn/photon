<script lang="ts">
  import { profile } from '$lib/auth'
  import { t } from '$lib/translations'
  import { Spinner } from 'mono-svelte'
</script>

<svelte:head>
  <title>{$t('profile.subscribed')}</title>
</svelte:head>

{#if $profile?.user}{:else}
  <div class="h-full w-full flex flex-col justify-center items-center">
    <Spinner width={40} />
    <span>{$t('toast.userLoading')}</span>
  </div>
{/if}
