import { versionIsSupported } from '../src/lib/version.js'
import { describe, expect, it } from 'vitest'

describe('versionIsSupported()', () => {
  it('checks minimum correctly', () => {
    expect(versionIsSupported('0.1.0', '0.0.0')).toBeTruthy()
    expect(versionIsSupported('0.0.0', '0.1.0')).toBeFalsy()
  })
  it('checks weird minimum versions correctly', () => {
    expect(versionIsSupported('0.19.0-rc.2', '0.19.0')).toBeTruthy()
    expect(versionIsSupported('0.19.0.rc.9', '0.19.1')).toBeFalsy()
  })
  it('checks major and patch versions correctly', () => {
    expect(versionIsSupported('2.0.0', '1.0.0')).toBeTruthy()
    expect(versionIsSupported('0.0.2', '0.0.1')).toBeTruthy()
  })
  it('handles other cases', () => {
    expect(versionIsSupported('2.0.2', '1.0.5')).toBeTruthy()
    expect(versionIsSupported('9.5.2', '7.6.3')).toBeTruthy()
  })
})
