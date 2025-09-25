<script lang="ts">
  import FormattedNumber from '../../components/util/FormattedNumber.svelte'

  interface Props {
    label: string
    content: string | number
    formatted?: boolean
    labelClass?: string
    contentClass?: string
    class?: string
  }

  let {
    label,
    content,
    formatted = false,
    labelClass = '',
    contentClass = '',
    class: clazz = '',
  }: Props = $props()
</script>

{#if content != '-1'}
  <dl class={['flex flex-col', clazz]}>
    <dt class={['text-slate-600 dark:text-zinc-400 text-xs', labelClass]}>
      {label}
    </dt>
    <dd class={['text-base', contentClass]}>
      {#if formatted}
        <FormattedNumber number={Number(content)} />
      {:else}
        {content}
      {/if}
    </dd>
  </dl>
{/if}
