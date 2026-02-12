<script lang="ts">
  import type { Tokens } from 'marked'
  import type { Renderer } from './Markdown.svelte'
  import Self from './MdTree.svelte'

  interface Props {
    type?: Renderer
    raw?: string
    renderers: any
    tokens?: Tokens.Generic[]
    text?: string
    align?: string
  }

  let { type, tokens = [], renderers, raw, text, ...rest }: Props = $props()
</script>

{#if type}
  {#if renderers[type]}
    {@const Renderer = renderers[type]}
    <Renderer {...rest} {raw} {text}>
      {#each tokens as token}
        {#if type != 'list' && type != 'table'}
          {#if token.tokens && token.tokens.length > 0}
            <Self
              tokens={token.tokens as Tokens.Generic[]}
              {renderers}
              {...rest}
            />
          {:else if token.text}
            {token.text}
          {:else if text}
            {text}
          {/if}
        {:else if type == 'list' && token.items}
          {#each token.items as item}
            <Self type="list_item" {renderers} tokens={[item]} {...rest} />
          {/each}
        {:else if type == 'table'}
          {@const THead = renderers['tablehead']}
          {@const TBody = renderers['tablebody']}
          {@const TRow = renderers['tablerow']}
          {#if token.header}
            <THead>
              <TRow>
                {#each token.header as heading, index}
                  <Self
                    {...rest}
                    type="tablecell"
                    {renderers}
                    tokens={heading.tokens}
                    align={token.align[index]}
                  />
                {/each}
              </TRow>
            </THead>
            <!-- <Self {renderers} tokens={token.header} {...rest} /> -->
          {/if}
          {#if token.rows}
            <TBody>
              {#each token.rows as row}
                <TRow>
                  {#each row as cell, index}
                    <Self
                      {...rest}
                      type="tablecell"
                      {renderers}
                      tokens={cell.tokens}
                      align={token.align[index]}
                    />
                  {/each}
                </TRow>
              {/each}
            </TBody>
          {/if}
        {/if}
      {/each}
    </Renderer>
  {/if}
{:else}
  {#each tokens as token}
    <Self
      {...rest}
      {...token}
      tokens={[token]}
      type={token.type as Renderer}
      {renderers}
      raw={token.raw}
      text={token.text}
    />
  {/each}
{/if}
