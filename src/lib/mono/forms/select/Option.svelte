<script lang="ts">
  import { getContext, type Snippet } from 'svelte'
  import type { IconSource } from 'svelte-hero-icons'
  import type { HTMLOptionAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLOptionAttributes, 'prefix'> {
    children: Snippet
    icon?: IconSource
  }
  let { children, icon, ...rest }: Props = $props()

  let optionElement = $state<HTMLOptionElement>()
  let option = $derived({
    value: optionElement?.value ?? '',
    label: optionElement?.innerText?.trim() ?? '',
    icon: icon,
    disabled: false,
  })

  interface SelectContext {
    options: {
      value: string
      label: string
      icon?: IconSource
      disabled: boolean
    }[]
  }

  const context = getContext<SelectContext>('select')

  $effect(() => {
    if (!context.options.find(v => v == option)) {
      context.options.push(option)
    }
  })
</script>

<option {...rest} bind:this={optionElement}>
  {@render children()}
</option>
