<script lang="ts">
  import { locale } from '$lib/translations'

  export let number: number
  let localeToUse: string = $locale
  export let options: Intl.NumberFormatOptions = {
    notation: 'compact',
  }

  export { localeToUse as locale }
</script>

<span class={$$props.class ?? ''}>
  {Intl.NumberFormat(localeToUse, options).format(number)}
</span>
