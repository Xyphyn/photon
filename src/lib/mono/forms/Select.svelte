<script lang="ts">
  import {
    buttonColor,
    buttonSize,
    type ButtonShadow,
    type ButtonSize,
    buttonShadow,
  } from '../button/Button.svelte'
  import Label from '../forms/Label.svelte'
  import { generateID } from '../forms/helper.js'
  import Menu from '../popover/Menu.svelte'
  import MenuButton from '../popover/MenuButton.svelte'
  import Popover from '../popover/Popover.svelte'
  import { createEventDispatcher, onMount } from 'svelte'
  import {
    CheckCircle,
    ChevronDown,
    ChevronUpDown,
    Icon,
  } from 'svelte-hero-icons'

  type T = $$Generic

  export let value: T | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let label: string | undefined = undefined
  export let size: ButtonSize = 'md'
  export let shadow: ButtonShadow = 'none'

  export let id: string = generateID()

  let open = false
  let element: HTMLSelectElement

  let options: { value: any; label: string | null; disabled: boolean }[] = []

  // Capture all options from the select element
  $: options = element?.options
    ? Array.from(element?.options).map((option) => ({
        value: option.value,
        label: option.innerHTML,
        disabled: option.disabled,
      }))
    : []

  const dispatcher = createEventDispatcher<{
    change: any
    contextmenu: any
    input: any
  }>()
</script>

<div class="flex flex-col gap-1 {$$props.class}">
  {#if $$slots.label || label}
    <Label for={id} text={label}>
      <slot name="label" />
    </Label>
  {/if}

  <div class="w-full relative">
    <Menu bind:open>
      <select
        slot="target"
        {id}
        bind:this={element}
        class="{buttonSize[size]} {buttonShadow[
          shadow
        ]} {buttonColor.secondary} appearance-none transition-colors rounded-lg text-sm
	w-full min-w-full cursor-pointer pr-6 {buttonColor.secondary}
	{$$props.class}"
        bind:value
        on:mousedown={(e) => {
          e.preventDefault()
        }}
        on:keypress={(e) => {
          e.preventDefault()
          open = !open
        }}
        on:change
        on:contextmenu
        {placeholder}
      >
        {#if placeholder}
          <option disabled selected value="">{placeholder}</option>
        {/if}
        <slot />
      </select>

      {#each options as option}
        <slot name="option" {option} selected={option.value == value}>
          <MenuButton
            on:contextmenu={() => dispatcher('contextmenu')}
            on:click={() => {
              value = option.value
              dispatcher('change')
            }}
            size="custom"
            disabled={option.disabled}
            class="!min-h-0 !py-[5px] {option.value == value
              ? '!bg-slate-100 dark:!bg-zinc-800'
              : ''}"
          >
            {@html option.label}
            {#if option.value == value}
              <Icon
                src={CheckCircle}
                size="16"
                micro
                class="text-primary-900 dark:text-primary-100 ml-auto"
              />
            {/if}
          </MenuButton>
        </slot>
      {/each}
    </Menu>
    <Icon
      src={ChevronUpDown}
      mini
      size="16"
      class="absolute right-0 top-1/4 mx-2 box-border pointer-events-none"
    />
  </div>
</div>
