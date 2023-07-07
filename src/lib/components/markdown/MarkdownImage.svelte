<script lang="ts">
  export let href: string = ''
  export let title: string | undefined = undefined
  export let text: string = ''
</script>

<img
  src={href}
  {title}
  alt={text}
  class="max-h-[40vh] border rounded-md border-slate-200 dark:border-zinc-800"
/>
