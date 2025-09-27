<script lang="ts">
  import { locale } from '$lib/app/i18n'
  import { type Snippet, getContext, onDestroy } from 'svelte'
  import type { IconSource } from 'svelte-hero-icons/dist'
  import type { HTMLOptionAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLOptionAttributes, 'prefix'> {
    children: Snippet
    icon?: IconSource
  }
  let { children, icon, ...rest }: Props = $props()

  let optionElement = $state<HTMLOptionElement>()
  let option = $derived({
    value: optionElement?.value ?? '',
    label: optionElement?.innerText ?? '',
    icon: icon,
    disabled: optionElement?.disabled,
    isLabel: optionElement?.getAttribute('data-label') == 'true',
  })

  interface SelectContext {
    options: {
      value: string
      label: string
      icon?: IconSource
      disabled?: boolean
      isLabel?: boolean
    }[]
  }

  const context = getContext<SelectContext>('select')

  $effect(() => {
    if ($locale || !context.options.find((v) => v == option)) {
      const index = context.options.findIndex((i) => i.value == option.value)

      if (index != -1) {
        context.options.splice(index, 1, option)
      } else {
        context.options.push(option)
      }
    }
  })

  onDestroy(() => {
    const index = context.options.findIndex((i) => i.value == option.value)
    if (index != -1) {
      context.options.splice(index, 1)
    }
  })
</script>

{#key $locale}
  <option {...rest} bind:this={optionElement}>
    {@render children()}
  </option>
{/key}
