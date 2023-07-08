import { tick } from 'svelte'
import FormattedNumber from '../src/lib/components/util/FormattedNumber.svelte'
import { describe, expect, it } from 'vitest'

describe('FormattedNumber.svelte', () => {
  let host = document.createElement('div')
  host.setAttribute('id', 'host')
  document.body.appendChild(host)

  it('mounts', () => {
    const instance = new FormattedNumber({
      target: host,
      props: {
        number: 1000,
      },
    })
    expect(instance).toBeTruthy()
    expect(host.innerHTML).toBeTruthy()
  })
  it('formats numbers correctly', async () => {
    const instance = new FormattedNumber({
      target: host,
      props: {
        number: 1100,
      },
    })
    expect(instance).toBeTruthy()

    expect(host.innerHTML).toContain('1.1K')

    instance.$set({ number: 5000 })
    await tick()
    expect(host.innerHTML).toContain('5K')

    instance.$set({ number: 6_320_000 })
    await tick()
    expect(host.innerHTML).toContain('6.3M')

    instance.$set({
      options: {
        notation: 'standard',
      },
    })
    await tick()
    expect(host.innerHTML).toContain('6,320,000')
  })
})
