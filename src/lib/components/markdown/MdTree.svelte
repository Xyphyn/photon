<script lang="ts">
  import { type Token } from 'marked'
  import type { Renderer } from './Markdown.svelte'

  import Self from './MdTree.svelte'

  interface Props {
    type?: Renderer
    raw?: string
    renderers: any
    tokens?: (Token & { tokens?: Token[]; text?: string })[]
    text?: string
  }

  let { type, tokens = [], renderers, raw, text, ...rest }: Props = $props()

  function decodeHtmlEntities(input: string) {
    return input
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
  }
</script>

{#if type}
  {#if renderers[type]}
    {@const Renderer = renderers[type]}
    <Renderer {...rest} {raw} {text}>
      {#each tokens as token}
        {#if token.tokens && token.tokens.length > 0}
          <Self tokens={token.tokens} {renderers} {...rest} />
        {:else if token.text}
          {decodeHtmlEntities(token.text)}
        {:else if text}
          {text}
        {/if}
      {/each}
    </Renderer>
  {/if}
{:else}
  {#each tokens as token}
    <Self
      {...token}
      tokens={[token]}
      type={token.type as Renderer}
      {renderers}
      raw={token.raw}
      text={token.text}
      {...rest}
    />
  {/each}
{/if}
