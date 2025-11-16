<script lang="ts" module>
  interface PageScopedError {
    scope: string
    message: string
  }

  let errors = $state<PageScopedError[]>([])

  export function pushError(args: { scope: string; message: string }) {
    errors.push(args)
  }

  export function clearErrorScope(scope: string | null | undefined) {
    errors = errors.filter((error) => error.scope != scope)
  }
</script>

<script lang="ts">
  import { onDestroy } from 'svelte'
  import { ExclamationTriangle, Icon } from 'svelte-hero-icons/dist'
  import { expoOut } from 'svelte/easing'
  import { fly, slide } from 'svelte/transition'

  onDestroy(() => {
    clearErrorScope(scope)
  })
  interface Props {
    scope?: string | undefined | null
    message?: string
    class?: string
  }

  let { scope, message, class: clazz = '' }: Props = $props()

  let scopedErrors = $derived(
    errors.filter((e) => e.scope == scope || e.scope == 'global'),
  )
</script>

{#if scopedErrors.length > 0 || message}
  <div
    class={['flex flex-col gap-4', clazz]}
    in:slide={{ duration: 400, easing: expoOut }}
    out:slide={{ duration: 400, delay: 400, easing: expoOut }}
  >
    <div
      in:fly|global={{
        y: -8,
        duration: 400,
        delay: 200,
        opacity: 0,
        easing: expoOut,
      }}
      out:fly={{ y: -8, duration: 400, opacity: 0, easing: expoOut }}
      class="info-container material-error"
    >
      <Icon
        src={ExclamationTriangle}
        size="20"
        micro
        class="inline-block rounded-lg clear-both float-left mr-2"
      />
      {#if message}
        {message}
      {/if}
      {#each scopedErrors as error}
        <p>{error.message}</p>
      {/each}
    </div>
  </div>
{/if}

<style>
  @reference '../../../app.css';

  .info-container {
    border-radius: var(--radius-2xl);
    padding: calc(var(--spacing) * 2.5) calc(var(--spacing) * 3);
    font-size: var(--text-sm);
  }
</style>
