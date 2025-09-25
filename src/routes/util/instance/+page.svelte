<script>
  import { env } from '$env/dynamic/public'
  import { Header } from '$comp/ui/layout'
  import {
    DEFAULT_INSTANCE_URL,
    LINKED_INSTANCE_URL,
  } from '$lib/app/instance.svelte'
</script>

<Header pageHeader>Photon instance</Header>
<pre>
  photon version: {__VERSION__}
  
  linked instance: {LINKED_INSTANCE_URL ?? 'none'}
  default instance: {DEFAULT_INSTANCE_URL}
  SSR enabled: {env.PUBLIC_SSR_ENABLED ?? 'false'}
  default theme: {env.PUBLIC_THEME ?? "mr xylight's very awesome colors"}
</pre>
