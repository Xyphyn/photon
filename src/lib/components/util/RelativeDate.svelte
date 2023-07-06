<script lang="ts">
  export let date: Date

  function formatRelativeDate(date: Date) {
    const now = Date.now()

    // Calculate the difference in milliseconds between 'now' and 'date'
    const diffInMillis = now - date.getTime()

    // Define time thresholds for different units (milliseconds)
    const thresholds = [
      { unit: 'second', threshold: 1000 },
      { unit: 'minute', threshold: 60 * 1000 },
      { unit: 'hour', threshold: 60 * 60 * 1000 },
      { unit: 'day', threshold: 24 * 60 * 60 * 1000 },
      { unit: 'week', threshold: 7 * 24 * 60 * 60 * 1000 },
      { unit: 'month', threshold: 30 * 24 * 60 * 60 * 1000 },
      { unit: 'year', threshold: 365 * 24 * 60 * 60 * 1000 },
      // You can add more units as needed, e.g., week, month, year
    ]

    // Iterate through the thresholds to find the appropriate unit to display
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (diffInMillis >= thresholds[i].threshold) {
        const value = Math.round(diffInMillis / thresholds[i].threshold)

        // Create a RelativeTimeFormat instance with user's locale and options
        const rtf = new Intl.RelativeTimeFormat(navigator.language, {
          numeric: 'auto',
        })

        return rtf.format(-value, thresholds[i].unit as any)
      }
    }

    return 'Now' // If none of the above conditions match defaulting to "Now"
  }
</script>

{formatRelativeDate(date)}
