#!/usr/bin/env node
/**
 * RTL guardrail: flags physical directional CSS/classes so they can be migrated
 * to logical properties (margin-inline-start, inset-inline-end, border-start-*,
 * text-start, ...) instead of drifting further.
 *
 * Usage:
 *   node scripts/check-rtl.mjs                  # fail on any violation
 *   node scripts/check-rtl.mjs --list           # print every violation
 *
 * Zero-tolerance since the migration completed: any physical directional CSS
 * fails lint. Justified exceptions go in ALLOWLIST below with a reason.
 *
 * Out of scope on purpose (see docs/plans/rtl-logical-properties.md):
 *   - translate-x-* (no logical equivalent; needs a per-case rtl: mirror)
 *   - left-1/2 -translate-x-1/2 centering (direction-safe)
 *   - space-x-* / divide-x-* / inset-x-* (already logical in Tailwind v4)
 *   - mx-* / px-* (symmetric)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'src')

const CLASS_PATTERNS = [
  ['spacing', /(?<![\w-])(-?(?:ml|mr|pl|pr)-[\w./[\]%#-]+)/g],
  [
    'inset',
    /(?<![\w-])(-?(?:left|right)-(?:auto(?![\w-])|full(?![\w-])|\d+(?:\.\d+)?(?![\w./-])))/g,
  ],
  ['text-align', /(?<![\w-])(text-(?:left|right))(?![\w-])/g],
  ['float', /(?<![\w-])(float-(?:left|right))(?![\w-])/g],
  ['origin', /(?<![\w-])(?<!rtl:)(?<!ltr:)(origin-(?:left|right))(?![\w-])/g],
  [
    'border-side',
    /(?<![\w-])(border-[lr](?!eft|ight)(?:-[\w./[\]%#-]+)?)(?![\w-])/g,
  ],
  ['radius-side', /(?<![\w-])(rounded-[lr](?:-[\w./[\]%#-]+)?)(?![\w])/g],
  [
    'radius-corner',
    /(?<![\w-])(rounded-(?:tl|tr|bl|br)(?:-[\w./[\]%#-]+)?)(?![\w])/g,
  ],
]

const CSS_PATTERNS = [
  [
    'css-side',
    /(?<![\w-])(?:margin|padding|border)-(?:left|right)(?:-[a-z-]+)?\s*:/g,
  ],
  ['css-inset', /(?<![\w-])(?:left|right)\s*:/g],
  ['css-radius', /border-(?:top|bottom)-(?:left|right)-radius\s*:/g],
  ['css-text-align', /text-align\s*:\s*(?:left|right)\b/g],
  ['css-float', /float\s*:\s*(?:left|right)\b/g],
]

const SKIP_DIRS = new Set(['node_modules', '.svelte-kit', 'build', '.git'])
const EXT = /\.(svelte|ts|js|css|html)$/

// Justified exceptions. Keep this list tiny; audit with `--list`.
const ALLOWLIST = [
  {
    file: /src\/lib\/ui\/shared\/button\/Button\.svelte$/,
    value: /^origin-(left|right)$/,
    reason: 'physical default paired with an rtl:origin-* mirror variant',
  },
]

function isAllowed(violation) {
  return ALLOWLIST.some(
    (entry) =>
      entry.file.test(violation.file) && entry.value.test(violation.value),
  )
}

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue
    const path = join(dir, entry)
    const stat = statSync(path)
    if (stat.isDirectory()) yield* walk(path)
    else if (EXT.test(entry)) yield path
  }
}

function lineAt(text, index) {
  let line = 1
  for (let i = 0; i < index && i < text.length; i++) {
    if (text[i] === '\n') line++
  }
  return line
}

/**
 * @param {string} text text to scan
 * @param {[string, RegExp][]} patterns
 * @param {string} kind
 * @param {(index: number) => number} toFullIndex maps a match index in `text`
 *   to an index in the full file, for line numbers
 */
function scan(text, patterns, kind, file, toFullIndex, fullText, violations) {
  for (const [name, re] of patterns) {
    re.lastIndex = 0
    let match
    while ((match = re.exec(text))) {
      const violation = {
        file,
        kind,
        name,
        value: match[1] ?? match[0].trim(),
        line: lineAt(fullText, toFullIndex(match.index)),
      }
      if (!isAllowed(violation)) violations.push(violation)
    }
  }
}

function collect() {
  const violations = []

  for (const path of walk(SRC)) {
    const text = readFileSync(path, 'utf8')
    const file = relative(ROOT, path)
    const isSvelte = path.endsWith('.svelte')

    // Tailwind classes anywhere in the file (markup, JS strings, `@apply`).
    scan(text, CLASS_PATTERNS, 'class', file, (i) => i, text, violations)

    // Raw CSS only inside <style> blocks and inline style="" attributes.
    const ranges = []
    if (isSvelte) {
      const styleRe = /<style[^>]*>([\s\S]*?)<\/style>/g
      let match
      while ((match = styleRe.exec(text))) {
        const start = match.index + match[0].indexOf(match[1])
        ranges.push([start, start + match[1].length])
      }

      const inlineRe = /\bstyle="([^"]*)"/g
      while ((match = inlineRe.exec(text))) {
        const start = match.index + match[0].indexOf(match[1])
        ranges.push([start, start + match[1].length])
      }
    } else {
      ranges.push([0, text.length])
    }

    for (const [start, end] of ranges) {
      scan(
        text.slice(start, end),
        CSS_PATTERNS,
        'css',
        file,
        (i) => start + i,
        text,
        violations,
      )
    }
  }

  return violations
}

const violations = collect()

const args = process.argv.slice(2)

if (args.includes('--list')) {
  for (const v of violations)
    console.log(`${v.file}:${v.line}  [${v.kind}/${v.name}]  ${v.value}`)
  console.log(`\n${violations.length} physical occurrences`)
  process.exit(0)
}

if (violations.length) {
  console.error('RTL guardrail: physical directional CSS detected.\n')
  for (const v of violations)
    console.error(`  ${v.file}:${v.line}  ${v.value} (${v.name})`)
  console.error(
    `\nUse logical properties (ms/me/ps/pe, inset-s/inset-e, border-s/e, rounded-s/e, text-start/end).\n` +
      `See docs/plans/rtl-logical-properties.md.`,
  )
  process.exit(1)
}

console.log('RTL guardrail: no physical directional CSS found.')
