<script lang="ts">
  import { locale } from '$lib/translations'

  export let number: number
  let localeToUse: string = $locale
  export let options: Intl.NumberFormatOptions = {
    notation: 'compact',
  }

  let clazz: string = ''
  export { clazz as class }

  export { localeToUse as locale }
</script>

<span class={clazz ?? ''}>
  {Intl.NumberFormat(localeToUse, options).format(number)}
</span>
