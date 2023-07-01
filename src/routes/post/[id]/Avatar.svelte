<script lang="ts">
  export let url: string
  export let alt: string = ''

  export let width: number
</script>

<img src={url} {alt} {width} class="rounded-full aspect-square object-cover" />
