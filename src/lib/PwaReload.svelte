<script lang="ts">
  import { toast as showToast } from 'mono-svelte'
  import { useRegisterSW } from 'virtual:pwa-register/svelte'
  const { needRefresh, updateServiceWorker, offlineReady } = useRegisterSW({
    onRegistered(r) {
      // uncomment following code if you want check for updates
      // r && setInterval(() => {
      //    console.log('Checking for sw update')
      //    r.update()
      // }, 20000 /* 20s for testing purposes */)
      console.log(`SW Registered: ${r}`)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    offlineReady.set(false)
    needRefresh.set(false)
  }

  $: toast = $offlineReady || $needRefresh

  const t = () => {
    if (!$offlineReady && $needRefresh) {
      showToast({
        content: 'Updates available. Click the check to update.',
        action: () => updateServiceWorker(true),
        duration: 9999 * 1000,
      })
    }
  }

  $: if (toast) t()
</script>
