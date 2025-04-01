<script lang="ts">
  import { Button, Material, Spinner } from 'mono-svelte'
  import { fade } from 'svelte/transition'
</script>

<div class="flex flex-col h-full gap-8 p-8">
  <header class="text-center space-y-2">
    <h1
      class="font-semibold tracking-tight text-3xl md:text-4xl lg:text-5xl self-center
  bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
    >
      Upgrade to Premium
    </h1>
    <p class="text-center">
      Enjoy an enhanced experience, exclusive creator tools, top-tier
      verification and security.
    </p>
  </header>
  <fieldset
    class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 flex-col gap-4 items-center flex-wrap"
  >
    {#snippet tier(name: string, features: string[], price: number)}
      <Material
        rounding="xl"
        color="uniform"
        class="flex-1 h-full"
        padding="xl"
      >
        <div class="font-medium text-lg tracking-tight">{name}</div>
        <div class="font-bold text-4xl mb-2">
          <span
            class="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
          >
            ${price}
          </span>
          <span class="text-sm font-normal">/month</span>
        </div>
        <ul class="list-disc pl-4 text-sm text-zinc-200">
          {#each features as feature}
            <li>{feature}</li>
          {/each}
        </ul>
      </Material>
    {/snippet}

    {@render tier(
      'Basic',
      [
        'Small reply boost',
        'Encrypted direct messages',
        'Bookmark folders',
        'Highlights tab',
        'Edit post',
        'Longer posts',
      ],
      267,
    )}
    {@render tier(
      'Premium',
      [
        'Everything in Basic, and',
        'Half Ads in For You and Following',
        'Larger reply boost',
        'Get paid to post',
        'Checkmark',
        'PhoAI with increased limits',
        'Photon Pro, Analytics, Media Studio',
        'Creator Subscriptions',
      ],
      700,
    )}
    {@render tier(
      'Premium+',
      [
        'Everything in Premium, and',
        'Fully ad-free',
        'Largest reply boost',
        'Write Articles',
      ],
      3292,
    )}
    {@render tier(
      'Premium++',
      [
        'Everything in Premium+, and',
        'Deploy SWAT teams on users you dislike',
        'Delete downvotes on your posts',
        'Log into admin accounts',
        'You will always have the top comment and post',
      ],
      9999,
    )}
    {@render tier(
      'Premium Mega',
      [
        'Everything in Premium++, and',
        'Limited dev console access',
        'Supreme authority over moderator and admins',
        'Cause humans to question their supposed free will',
      ],
      21824,
    )}
    {@render tier(
      'Premium Mega Max',
      [
        'Everything in Premium Mega, and',
        'Ascend to a higher plane of conciousness',
        "Access to God's admin panel",
        'Make humanity mere puppets',
      ],
      58999,
    )}
    {@render tier(
      'Premium Mega Max Revolutionary+',
      ['Everything in Premium Mega Max, and', 'You are now the one God'],
      101999,
    )}
  </fieldset>
  <Button color="primary" rounding="pill" size="lg" class="w-max mx-auto px-8">
    Subscribe
  </Button>
</div>
