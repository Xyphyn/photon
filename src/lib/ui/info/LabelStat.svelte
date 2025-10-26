<script lang="ts">
  import FormattedNumber from '../util/FormattedNumber.svelte'

  interface Props {
    label: string
    content: string | number
    formatted?: boolean
    labelClass?: string
    contentClass?: string
    formatOptions?: Intl.NumberFormatOptions
    class?: string
  }

  let {
    label,
    content,
    formatted = false,
    labelClass = '',
    contentClass = '',
    class: clazz = '',
    formatOptions,
  }: Props = $props()
</script>

{#if content != '-1'}
  <dl class={['flex flex-col', clazz]}>
    <dt class={['text-slate-600 dark:text-zinc-400 text-xs', labelClass]}>
      {label}
    </dt>
    <dd class={['text-base', contentClass]}>
      {#if formatted}
        <FormattedNumber number={Number(content)} options={formatOptions} />
      {:else}
        {content}
      {/if}
    </dd>
  </dl>
{/if}
