<script lang="ts">
  import type { View } from '$lib/app/settings.svelte'
  import { parseURL } from '$lib/ui/form/Link.svelte'
  import { Material } from 'mono-svelte'
  import { ArrowTopRightOnSquare, Icon, Link } from 'svelte-hero-icons/dist'
  import { optimizeImageURL } from './helpers'

  interface Props {
    url: string
    thumbnail_url?: string
    nsfw?: boolean
    embed_title?: string
    view?: View
  }

  let {
    url,
    thumbnail_url,
    nsfw = false,
    embed_title,
    view = 'cozy',
  }: Props = $props()

  let richURL = $derived(parseURL(url))
</script>

<!--
  @component
  For embed-type posts. Displays embed card or a compact link.
-->
{#if embed_title && view == 'cozy'}
  <Material
    color="uniform"
    class={[
      'post-link group/link hover:bg-slate-50 hover:dark:bg-zinc-900 transition-colors',
    ]}
    rounding="2xl"
    element="a"
    padding="none"
    href={url}
    target="_blank"
    rel="noopener"
  >
    <div class={['post-link-url', thumbnail_url && '-mt-2 sm:mt-0']}>
      {#if richURL}
        <div class="link-hostname">
          {richURL.hostname}
        </div>
      {/if}
      <p class="post-link-title">{embed_title}</p>
    </div>
    {#if thumbnail_url}
      <div class="post-link-image">
        <picture class="contents">
          {#each ['webp'] as format}
            <source
              srcset="{optimizeImageURL(
                thumbnail_url,
                256,
                format as 'avif' | 'webp',
              )} 256w, {optimizeImageURL(
                thumbnail_url,
                512,
                format as 'avif' | 'webp',
              )} 512w"
              media="(min-width: 0px)"
              type="image/{format}"
            />
          {/each}
          <img
            src={optimizeImageURL(thumbnail_url, -1)}
            class=""
            width={600}
            height={400}
            alt=""
            class:blur-3xl={nsfw}
          />
        </picture>
        <Material
          padding="xs"
          color="uniform"
          class="absolute top-0 right-0 m-2 z-50"
          role="presentation"
        >
          <Icon
            src={ArrowTopRightOnSquare}
            size="16"
            micro
            class="text-slate-500 dark:text-zinc-300"
          />
        </Material>
      </div>
    {/if}
  </Material>
{:else}
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    class="post-link-compact"
  >
    <Icon src={Link} size="16" micro class="shrink-0" />
    {#if richURL}
      <div class="post-link-url">
        {richURL.hostname}
        {#if richURL.pathname != '/'}
          <span class="post-link-extended">
            {richURL.pathname}
          </span>
        {/if}
      </div>
    {:else}
      {url}
    {/if}
  </a>
{/if}

<style>
  @reference '../../../app.css';
  :global(.post-link) {
    display: flex;
    flex-direction: column-reverse;
    overflow: hidden;
    gap: calc(var(--spacing) * 4);
    position: relative;
    @variant sm {
      flex-direction: row;
    }

    .post-link-url {
      display: flex;
      flex-direction: column;
      gap: var(--spacing);
      padding: calc(var(--spacing) * 4);

      .link-hostname {
        color: var(--color-slate-600);
        display: inline-flex;
        align-items: center;
        gap: var(--spacing);
        font-size: var(--text-xs);
        font-weight: var(--font-weight-medium);

        @variant dark {
          color: var(--color-zinc-400);
        }
      }
    }

    .post-link-title {
      font-weight: var(--font-weight-medium);
      font-size: var(--text-base);
      letter-spacing: var(--tracking-tight);
      max-width: calc(var(--spacing) * 108);
    }

    .post-link-image {
      flex-shrink: 0;
      margin-bottom: auto;

      @variant sm {
        margin-left: auto;
      }

      @variant max-md {
        mask-image: linear-gradient(to bottom, black, transparent);
      }

      @variant sm {
        width: 33%;
        max-width: calc(var(--spacing) * 90);
      }

      @variant md {
        mask-image: linear-gradient(to left, black, black, transparent);
      }

      img {
        object-fit: cover;
        width: 100%;
        height: calc(var(--spacing) * 40);
        background-color: var(--color-slate-200);

        @variant sm {
          max-width: calc(var(--spacing) * 96);
          min-height: calc(var(--spacing) * 16);
        }

        @variant dark {
          background-color: var(--color-zinc-800);
        }
      }
    }
  }

  .post-link-compact {
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    margin: var(--spacing) 0;
    gap: var(--spacing);
    color: var(--color-slate-700);
    white-space: nowrap;

    @variant dark {
      color: var(--color-zinc-400);
    }

    @variant hover {
      text-decoration-line: underline;
    }

    .post-link-url {
      display: flex;
      flex-direction: row;
      gap: 0;
      max-width: 100%;
      overflow: hidden;
      font-weight: var(--font-medium);
      align-self: flex-start;
      justify-self: start;
      width: max-content;
      font-size: var(--text-sm);
    }

    .post-link-extended {
      color: var(--color-slate-500);
      white-space: nowrap;
      opacity: 0;
      transition: opacity linear 100ms;

      @variant dark {
        color: var(--color-zinc-500);
      }
    }

    @variant hover {
      .post-link-extended {
        opacity: 1;
      }
    }
  }
</style>
