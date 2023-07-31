<script>
  import Link from '$lib/components/input/Link.svelte'
  import Logo from '$lib/components/ui/Logo.svelte'
</script>

<div class="max-w-xl mx-auto">
  <div class="flex items-center gap-1 mx-auto w-max">
    <Logo width={48} />
    <span class="text-2xl font-bold">Photon</span>
  </div>
  <h1 class="text-2xl font-bold leading-8">About</h1>
  <p class="my-3">
    <strong>Photon</strong>
    is a client for
    <a href="https://join-lemmy.org" class="underline">Lemmy</a>
    that is meant to replace the default lemmy-ui.
  </p>
  <p class="my-3">
    It's named that because some random person in a Discord server said that
    would be a good name. Great choice, I know.
  </p>
  <h1 class="text-2xl font-bold leading-8">Links</h1>
  <ul class="list-disc pl-4 my-3">
    <li>
      <Link highlight href="https://github.com/Xyphyn/photon">Github</Link>
    </li>
    <li>
      <Link
        highlight
        href="https://photon.xylight.dev/c/photon@lemmy.xylight.dev"
      >
        Community
      </Link>
    </li>
    <li>
      <Link highlight href="https://www.buymeacoffee.com/xylight">
        Buy me a coffee
      </Link>
      <ul class="list-disc pl-4">
        <li>I'd much prefer you support me by sharing this website.</li>
      </ul>
    </li>
    <li>
      <Link href="https://xylight.dev" highlight>Xylight's portfolio</Link>
    </li>
  </ul>
</div>
