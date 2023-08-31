<script lang="ts">
  export let url: string
</script>

<div class="ml-auto mr-auto mt-1 mb-1 max-w-4xl">
  <!-- svelte-ignore a11y-media-has-caption -->
  <video class="rounded-md max-w-full max-h-[80svh] mx-auto" controls>
    <source src={url} />
  </video>
</div>
