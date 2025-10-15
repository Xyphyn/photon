<script lang="ts">
  interface Props {
    seed: string
  }
  let { seed }: Props = $props()

  function randomoklch(seed: string, count: number) {
    function hashString(str: string) {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash
      }
      return Math.abs(hash)
    }

    function seededRandom(seedStr: string, index: number) {
      const combined = hashString(seedStr + '|' + index.toString())
      let x = Math.sin(combined) * 10000
      return x - Math.floor(x)
    }

    const colors = []

    const baseHue = (hashString(seed) % 12) * 60

    for (let i = 0; i < count; i++) {
      const r1 = seededRandom(seed, i * 3)
      const r2 = seededRandom(seed, i * 3 + 1)
      const r3 = seededRandom(seed, i * 3 + 2)

      const lightness = 0.45 + r1 * 0.4

      const chroma = 0.08 + r2 * 0.12

      const hueVariation = (r3 - 0.5) * 80
      const hue = (baseHue + hueVariation + 360) % 360

      const oklchColor = `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(1)})`
      colors.push({ str: oklchColor, pos: r1 * 1000 })
    }

    return colors
  }

  let colors = $derived(randomoklch(seed, 12))

  const uniqueId = $derived(seed.replace(/[^a-zA-Z0-9]/g, '_'))
</script>

<svg width="120%" height="120%" viewBox="0 -100 1171 241" fill="none">
  <defs>
    <filter
      id="noiseFilter_{uniqueId}"
      x="0%"
      y="0%"
      width="100%"
      height="100%"
    >
      <feTurbulence
        baseFrequency="0.9"
        numOctaves="3"
        seed="5"
        stitchTiles="stitch"
      />
    </filter>

    <filter
      id="mainBlur_{uniqueId}"
      x="-20%"
      y="-50%"
      width="140%"
      height="200%"
    >
      <feGaussianBlur stdDeviation="45" result="blur" />
      <feBlend mode="normal" in="blur" in2="BackgroundImageFix" />
    </filter>

    <radialGradient id="grad1_{uniqueId}" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color={colors[0].str} />
      <stop offset="40%" stop-color={colors[1].str} />
      <stop offset="100%" stop-color={colors[2].str} />
    </radialGradient>

    <radialGradient id="grad2_{uniqueId}" cx="30%" cy="70%" r="70%">
      <stop offset="0%" stop-color={colors[3].str} />
      <stop offset="30%" stop-color={colors[4].str} />
      <stop offset="100%" stop-color={colors[5].str} />
    </radialGradient>

    <linearGradient id="grad3_{uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color={colors[6].str} />
      <stop offset="50%" stop-color={colors[7].str} />
      <stop offset="100%" stop-color={colors[8].str} />
    </linearGradient>
  </defs>

  <g filter="url(#mainBlur_{uniqueId})">
    <ellipse
      cx={colors[5].pos}
      cy="-30"
      rx="300"
      ry="120"
      fill="url(#grad1_{uniqueId})"
      opacity="0.8"
    />
    <circle
      cx={colors[6].pos}
      cy="-20"
      r="180"
      fill="url(#grad2_{uniqueId})"
      opacity="0.7"
    />
    <ellipse
      cx={colors[7].pos}
      cy="10"
      rx="250"
      ry="100"
      fill="url(#grad3_{uniqueId})"
      opacity="0.6"
    />
    <circle
      cx={colors[8].pos}
      cy="30"
      r="120"
      fill={colors[9].str}
      opacity="0.5"
    />
    <ellipse
      cx={colors[9].pos}
      cy="20"
      rx="150"
      ry="80"
      fill={colors[10].str}
      opacity="0.4"
    />
  </g>
  <rect
    width="100%"
    height="100%"
    fill="white"
    opacity="0.03"
    filter="url(#noiseFilter_{uniqueId})"
  />
</svg>
