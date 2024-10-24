<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  type T = $$Generic

  const dispatcher = createEventDispatcher<{ action: any }>()

  function action(detail: any) {
    dispatcher('action', detail)
  }
  let clazz: string = ''
  export { clazz as class }
</script>

<ul
  class="divide-y divide-slate-200 dark:divide-zinc-900 flex flex-col {class}"
>
  <slot {action} />
</ul>
