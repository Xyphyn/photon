<script lang="ts">
  export let date: Date
  export let relativeTo: Date | undefined = undefined
  export let options: Intl.RelativeTimeFormatOptions = {
    numeric: 'always',
    style: 'narrow',
  }

  const toLocaleDateString = (date: Date): string => {
    try {
      return date.toLocaleString()
    } catch (err) {
      return 'Invalid Date'
    }
  }

  $: dateTime = toLocaleDateString(date)

  function formatRelativeDate(date: Date) {
    try {
      const now = relativeTo?.getTime() ?? Date.now()

      const diffInMillis = now - date.getTime()

      const thresholds = [
        { unit: 'second', threshold: 1000 },
        { unit: 'minute', threshold: 60 * 1000 },
        { unit: 'hour', threshold: 60 * 60 * 1000 },
        { unit: 'day', threshold: 24 * 60 * 60 * 1000 },
        { unit: 'week', threshold: 7 * 24 * 60 * 60 * 1000 },
        { unit: 'month', threshold: 30 * 24 * 60 * 60 * 1000 },
        { unit: 'year', threshold: 365 * 24 * 60 * 60 * 1000 },
      ]

      for (let i = thresholds.length - 1; i >= 0; i--) {
        if (diffInMillis >= thresholds[i].threshold) {
          const value = Math.round(diffInMillis / thresholds[i].threshold)

          let language = 'en'
          if (typeof navigator != 'undefined') {
            language = navigator.language
          }

          const rtf = new Intl.RelativeTimeFormat(language, options)

          return rtf.format(-value, thresholds[i].unit as any)
        }
      }
      return 'Now'
    } catch (err) {
      return 'Invalid Date'
    }
  }
</script>

<time datetime={dateTime} title={dateTime} class={$$props.class ?? ''}>
  {formatRelativeDate(date)}
</time>
