import RelativeDate from '../src/lib/components/util/RelativeDate.svelte'
import { describe, expect, it } from 'vitest'

describe('RelativeDate.svelte', () => {
  let host = document.createElement('div')
  host.setAttribute('id', 'host')
  document.body.appendChild(host)

  const testDate = new Date('2023-01-01 00:00:00')
  const testRelativeTo = new Date('2023-01-01 01:00:00')

  it('mounts', () => {
    let host = document.createElement('div')
    const instance = new RelativeDate({
      target: host,
      props: {
        date: new Date(),
        relativeTo: new Date(),
      },
    })
    expect(instance).toBeTruthy()
  })
  it('shows the correct date', () => {
    const instance = new RelativeDate({
      target: host,
      props: { date: testDate, relativeTo: testRelativeTo },
    })

    expect(instance).toBeTruthy()
    expect(host.innerHTML).toContain('1h ago')
  })
})
