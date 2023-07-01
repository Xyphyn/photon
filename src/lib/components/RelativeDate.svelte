<script lang="ts">
  export let date: Date
  const rtf = new Intl.RelativeTimeFormat('en', {
    numeric: 'auto',
    style: 'short',
  }).format(
    Math.floor((Date.now() - date.getTime()) / 1000 / 60 / 60 / 24),
    'days'
  )
</script>

{rtf}
