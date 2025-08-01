<script lang="ts">
  let progress = $state(0)

  let increaseInterval: number = -1
  let startTimeout: number = -1
  let stopTimeout: number = -1

  export function start() {
    clearTimeout(stopTimeout)
    progress = 0
    startTimeout = setTimeout(() => {
      progress = 1
      // schedule a setInterval and run the code immediately
      ;(function i() {
        if (progress < 100 && progress > 0)
          // slowly get closer and closer to 90% -- 100% doesnt look very good to be stuck on
          progress += (100 - (progress - 10)) / 4
        increaseInterval = setInterval(i, 400) as unknown as number
      })()
    }, 100) as unknown as number
  }

  export function stop() {
    if (progress != 0) progress = 100
    // reset progress to 0 after bar disappears
    setTimeout(() => (progress = 0), 500)
    clearInterval(increaseInterval)
    clearTimeout(startTimeout)
  }
</script>

<div
  class={[
    'fixed top-0 left-0 h-px z-[400] bg-primary-900 dark:bg-primary-100',
    progress == 100 && 'opacity-0',
    progress > 0 && 'use-transition',
  ]}
  style="width: {progress}%;"
  id="progress-bar"
></div>

<style>
  #progress-bar.use-transition {
    transition:
      width 0.7s cubic-bezier(0, 0, 0.22, 0.76),
      opacity 0.5s linear;
  }
</style>
