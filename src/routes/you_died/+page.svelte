<script lang="ts">
  import { profile } from '$lib/auth.svelte'
  import Portal from 'mono-svelte/popover/Portal.svelte'
  import { onDestroy, onMount } from 'svelte'

  let audio = $state<HTMLAudioElement>()

  onMount(() => {
    audio?.play()

    document.body.style.rotate = `5deg`
    document.body.style.transition = 'rotate 1s linear'
  })

  onDestroy(() => {
    document.body.style.rotate = ''
  })
</script>

<audio bind:this={audio}>
  <source src="/other/mc.mp3" type="audio/mpeg" />
</audio>
<Portal class="z-50 fixed inset-0">
  <div
    class="inset-0 bg-red-500/20 w-screen h-screen flex flex-col gap-4 items-center p-16 z-50"
    style="rotate: -5deg; transition: rotate 1s linear;"
  >
    <div class="bg-black/20 font-mono fixed left-1/2 -translate-x-1/2">
      <p>{profile.current.username ?? 'You'} was slain by Command Palette</p>
    </div>
    <img
      src="/other/mc.png"
      class="object-contain w-full h-full"
      alt="Minecraft 'you died'"
    />
  </div>
</Portal>

<style>
  @font-face {
    font-family: 'mc';
    src: url('/other/mc.otf') format('opentype');
  }

  .main {
    font-family: 'mc';
  }
</style>
