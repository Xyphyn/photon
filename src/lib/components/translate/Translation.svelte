<script lang="ts">
  import { Button, Modal, Select, Spinner, TextArea } from 'mono-svelte'
  import { text } from './translation'
  import { t } from '$lib/translations'
  import { userSettings } from '$lib/settings'
  import { ArrowRight, Icon } from 'svelte-hero-icons'
  import MarkdownEditor from '../markdown/MarkdownEditor.svelte'

  interface TranslateResponse {
    translatedText: string
  }

  export let open: boolean = false

  $: if (open && $text) translate($text)

  let result: Promise<TranslateResponse> | undefined = undefined
  let from = 'auto'
  let to = 'en'

  async function translate(text: string) {
    const url = $userSettings.translator

    if (!url) {
      return
    }

    const requestURL = new URL(`https://${url}/translate`)
    requestURL.searchParams.set('q', text)
    requestURL.searchParams.set('source', from)
    requestURL.searchParams.set('target', to)
    requestURL.searchParams.set('alternatives', '')

    result = fetch(requestURL.toString(), {
      method: 'POST',
    }).then(async (res) => await res.json())
  }
</script>

<Modal title={$t('post.actions.more.translate')} bind:open>
  <TextArea value={$text} rows={2}></TextArea>
  <div class="flex items-center gap-2 w-full">
    <Select bind:value={from} class="flex-1">
      <option value="auto">Auto</option>
    </Select>
    <Icon src={ArrowRight} mini size="20" />
    <Select bind:value={to} class="flex-1">
      <option value="en">English</option>
      <option value="ar">Arabic</option>
      <option value="zh">Chinese</option>
      <option value="cs">Czech</option>
      <option value="nl">Dutch</option>
      <option value="fi">Finnish</option>
      <option value="fr">French</option>
      <option value="de">German</option>
      <option value="el">Greek</option>
      <option value="it">Italian</option>
      <option value="ja">Japanese</option>
      <option value="pl">Polish</option>
      <option value="es">Spanish</option>
      <option value="sv">Swedish</option>
    </Select>
  </div>
  {#if result}
    {#await result}
      <div
        style="height: 194px; width:100%;"
        class="flex items-center justify-center"
      >
        <Spinner width={32} />
      </div>
    {:then result}
      <MarkdownEditor
        previewButton={false}
        previewing
        tools={false}
        rows={8}
        value={result.translatedText}
        disabled
      ></MarkdownEditor>
    {:catch err}
      <TextArea rows={8} value={err}></TextArea>
    {/await}
  {:else}
    <TextArea disabled />
  {/if}
  <Button on:click={() => translate($text)} color="primary" size="lg">
    {$t('post.actions.more.translate')}
  </Button>
</Modal>
