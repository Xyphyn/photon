<script lang="ts">
  export let url: string | undefined
  export let alt: string = ''

  export let width: number
</script>

<img
  src={`${url}?format=webp&thumbnail=${width * 2}` ??
    `https://api.dicebear.com/6.x/initials/svg?seed=${alt}`}
  {alt}
  {width}
  loading="lazy"
  class="rounded-full aspect-square object-cover"
/>
