import RelativeDate from '../src/lib/components/util/RelativeDate.svelte'
import { describe, expect, it } from 'vitest'

describe('RelativeDate.svelte', () => {
  let host = document.createElement('div')
  host.setAttribute('id', 'host')
  document.body.appendChild(host)

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
    const date = new Date('2023-01-01 00:00:00')
    const relativeTo = new Date('2023-01-01 01:00:00')

    const instance = new RelativeDate({
      target: host,
      props: { date: date, relativeTo: relativeTo },
    })

    expect(instance).toBeTruthy()
    expect(host.innerHTML).toContain('1 hour ago')
  })
})
