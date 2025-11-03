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
    class?: string
  }

  let { scope = undefined, class: clazz = '' }: Props = $props()

  let scopedErrors = $derived(
    errors.filter((e) => e.scope == scope || e.scope == 'global'),
  )
</script>

{#if scopedErrors.length > 0}
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
      class="info-container container-error"
    >
      <Icon
        src={ExclamationTriangle}
        size="20"
        micro
        class="inline-block rounded-lg clear-both float-left mr-2"
      />
      {#each scopedErrors as error}
        <p>{error.message}</p>
      {/each}
    </div>
  </div>
{/if}

<style>
  @reference '../../../app.css';

  :global {
    .info-container {
      border-radius: var(--radius-2xl);
      padding: calc(var(--spacing) * 2.5) calc(var(--spacing) * 3);
      font-size: var(--text-sm);
    }

    .container-error {
      background: linear-gradient(
        to bottom,
        --alpha(var(--color-red-300) / 10%),
        --alpha(var(--color-red-500) / 15%)
      );

      color: var(--color-red-900);
      border: 1px solid --alpha(var(--color-red-300) / 30%);

      @variant dark {
        color: var(--color-red-300);
      }
    }

    .container-success {
      background: linear-gradient(
        to bottom,
        --alpha(var(--color-green-300) / 10%),
        --alpha(var(--color-green-500) / 15%)
      );

      color: var(--color-green-900);
      border: 1px solid --alpha(var(--color-green-300) / 30%);

      @variant dark {
        color: var(--color-green-300);
      }
    }

    .container-warning {
      background: linear-gradient(
        to bottom,
        --alpha(var(--color-yellow-300) / 10%),
        --alpha(var(--color-yellow-500) / 15%)
      );

      color: var(--color-yellow-900);
      border: 1px solid --alpha(var(--color-yellow-300) / 30%);

      @variant dark {
        color: var(--color-yellow-300);
      }
    }

    .container-info {
      background: linear-gradient(
        to bottom,
        --alpha(var(--color-slate-300) / 10%),
        --alpha(var(--color-slate-500) / 15%)
      );

      color: var(--color-slate-900);
      border: 1px solid --alpha(var(--color-slate-300) / 30%);

      @variant dark {
        color: var(--color-slate-300);
      }
    }
  }
</style>
