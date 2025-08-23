<script lang="ts" module>
  interface Props<T> extends Omit<HTMLSelectAttributes, 'size'> {
    value?: T | string | undefined
    placeholder?: string | undefined
    label?: string | undefined
    size?: ButtonSize
    shadow?: ButtonShadow
    id?: string
    class?: ClassValue
    baseClass?: ClassValue
    selectClass?: ClassValue
    customLabel?: import('svelte').Snippet
    children?: import('svelte').Snippet
    customOption?: import('svelte').Snippet<
      [
        {
          option: {
            value: string
            label: string
            icon?: IconSource
            disabled?: boolean
          }
          selected: boolean
        },
      ]
    >
    target?: Snippet
    oncontextmenu?: HTMLSelectAttributes['oncontextmenu']
    onchange?: HTMLSelectAttributes['onchange']
    placement?: Placement
  }

  export type { Props as SelectProps }
</script>

<script lang="ts" generics="T">
  import { setContext, tick, type Snippet } from 'svelte'
  import {
    CheckCircle,
    ChevronUpDown,
    Icon,
    type IconSource,
  } from 'svelte-hero-icons'
  import type { ClassValue, HTMLSelectAttributes } from 'svelte/elements'
  import {
    buttonColor,
    buttonShadow,
    buttonSize,
    type ButtonShadow,
    type ButtonSize,
  } from '../../button/Button.svelte'
  import Menu from '../../popover/Menu.svelte'
  import MenuButton from '../../popover/MenuButton.svelte'
  import Label from '../Label.svelte'
  import { generateID } from '../helper.js'
  import type { Placement } from 'svelte-floating-ui/core'

  let open = $state(false)
  let element: HTMLSelectElement | undefined = $state()

  interface SelectContext {
    options: {
      value: string
      label: string
      icon?: IconSource
      disabled?: boolean
      isLabel?: boolean
    }[]
  }

  const context = setContext<SelectContext>('select', {
    options: [],
  })

  let {
    value = $bindable(undefined),
    placeholder = undefined,
    label = undefined,
    size = 'md',
    shadow = 'sm',
    id = generateID(),
    class: clazz = '',
    baseClass = '',
    selectClass = '',
    customLabel,
    children,
    customOption,
    oncontextmenu,
    onchange,
    placement = 'bottom',
    target,
    ...rest
  }: Props<T> = $props()
</script>

{#snippet selectTarget()}
  <select
    {...rest}
    {id}
    bind:this={element}
    class={[
      buttonSize[size],
      buttonShadow[shadow],
      buttonColor.secondary,
      'appearance-none transition-colors rounded-xl text-sm w-full min-w-full cursor-pointer pr-6',
      selectClass,
      clazz,
    ]}
    bind:value
    onmousedown={e => {
      e.preventDefault()
    }}
    onkeypress={e => {
      e.preventDefault()
      open = !open
    }}
    {onchange}
    {oncontextmenu}
    {placeholder}
  >
    {#if placeholder}
      <option disabled selected value="">{placeholder}</option>
    {/if}
    {@render children?.()}
  </select>
{/snippet}

<div class={['flex flex-col gap-1', clazz, baseClass]}>
  {#if customLabel || label}
    <Label for={id} text={label}>
      {@render customLabel?.()}
    </Label>
  {/if}

  <div class="w-full relative">
    <Menu bind:open {placement} target={target ?? selectTarget}>
      {#each context.options as option (option)}
        {#if customOption}{@render customOption({
            option,
            selected: option.value == value,
          })}{:else}
          <MenuButton
            onclick={async () => {
              value = option.value
              await tick()
              element?.dispatchEvent(new Event('change', { bubbles: true }))
            }}
            size="custom"
            disabled={option.disabled}
            color="none"
            class={[
              'min-h-0! py-1 hover:bg-slate-100 dark:hover:bg-zinc-800',
              option.value == value &&
                'bg-slate-100 dark:bg-zinc-800 text-primary-900 dark:text-primary-100 font-medium',
              option.disabled &&
                'pointer-events-none text-slate-600 dark:text-zinc-400',
              option.isLabel && 'text-xs mt-2',
            ]}
          >
            {#if option.value == value}
              <Icon
                src={CheckCircle}
                size="16"
                micro
                class="text-primary-900 dark:text-primary-100"
              />
            {:else if option.icon}
              <Icon
                src={option.icon}
                size="16"
                micro
                class="text-slate-600 dark:text-zinc-400"
              />
            {/if}
            {@html option.label}
          </MenuButton>
        {/if}
      {/each}
    </Menu>
    <Icon
      src={ChevronUpDown}
      micro
      size="16"
      class="absolute right-0 top-1/4 mx-1.5 box-border pointer-events-none"
    />
  </div>
</div>
