<script>
  import Link from '$comp/input/Link.svelte'
  import Logo from '$comp/ui/Logo.svelte'
  import Profile from './Profile.svelte'
</script>

<div class="max-w-xl mx-auto">
  <div class="flex items-center gap-1 mx-auto w-max">
    <Logo width={48} />
    <span class="text-2xl font-bold">Photon</span>
  </div>
  <h1 class="text-2xl font-bold leading-8">About</h1>
  <p class="my-3">
    <strong>Photon</strong>
    is a replacement user interface for Lemmy, with more features and modern design.
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
      <Link href="https://xylight.dev" highlight>Xylight's portfolio</Link>
    </li>
    <li>
      <Link href="https://buymeacoffee.com/xylight" highlight>Donate</Link>
    </li>
  </ul>
  <h1 class="text-2xl font-bold leading-10">Credits</h1>
  <div class="flex flex-row flex-wrap gap-6 items-center w-full">
    <Profile name="Xylight" description="Main developer" />
    <Profile
      name="Cole"
      badge="lemdro.id"
      description="Contributor"
      link="/u/cole@lemdro.id"
    />
    <Profile
      name="iJeff"
      badge="lemdro.id"
      description="Contributor"
      link="/u/ijeff@lemdro.id"
    />
    <Profile
      name="pbui"
      description="Contributor"
      link="https://github.com/pbui"
    />
    <Profile
      name="Neshura87"
      description="Contributor"
      link="https://github.com/neshura87"
    />
    <Profile
      name="Pieterdd"
      description="Contributor"
      link="https://github.com/pieterdd"
    />
    <Profile
      name="0xCmdrKeen"
      description="Contributor"
      link="https://github.com/0xCmdrKeen"
    />
    <Profile
      name="sant0s12"
      description="Contributor"
      link="https://github.com/sant0s12"
    />
    <Profile
      name="tfaughnan"
      description="Contributor"
      link="https://github.com/tfaughnan"
    />
    <Profile
      name="paradox460"
      description="Contributor"
      link="https://github.com/paradox460"
    />
    <Profile
      name="ngn13"
      description="Contributor"
      link="https://github.com/ngn13"
    />
    <Profile
      name="Tmpod"
      description="Contributor"
      link="https://github.com/Tmpod"
    />
    <Profile
      name="Xusontha"
      description="Contributor"
      link="https://github.com/Xusontha"
    />
    <Profile
      name="TheSaneWriter"
      description="Contributor"
      link="https://github.com/TheSaneWriter"
    />
    <Profile
      name="ZhenyaPav"
      description="Contributor"
      link="https://github.com/ZhenyaPav"
    />
    <Profile
      name="zamuz"
      description="Contributor"
      link="https://github.com/zamuz"
    />
    <Profile
      name="danielwolbach"
      description="Contributor"
      link="https://github.com/danielwolbach"
    />
    <Profile
      name="danielwolbach"
      description="Contributor"
      link="https://github.com/danielwolbach"
    />
    <span>...and you, for using this app!</span>
  </div>
</div>
