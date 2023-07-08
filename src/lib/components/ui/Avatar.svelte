<script lang="ts">
  export let url: string | undefined
  export let alt: string = ''

  export let width: number
</script>

<img
  src="{url ??
    `https://api.dicebear.com/6.x/initials/svg?seed=${alt}`}?format=webp&thumbnail={width *
    2}"
  {alt}
  {width}
  loading="lazy"
  class="rounded-full aspect-square object-cover overflow-hidden"
/>
