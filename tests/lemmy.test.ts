import { isImage } from '../src/lib/ui/image.js'
import { describe, expect, it } from 'vitest'

describe('lemmy utilities', () => {
  it('checks image URLs correctly', () => {
    expect(isImage(`https://example.com/img.jpg?thumb=28`)).toBeTruthy()
    expect(isImage(`https://test.dev/file/img.webp?great`)).toBeTruthy()
    expect(isImage(`https://test.dev/file/img.jpeg?test=false`)).toBeTruthy()
    expect(isImage(`https://test.dev/file/img.bmp#awesome`)).toBeTruthy()
    expect(isImage(`https://test.dev/file/img.png#awesome`)).toBeTruthy()
  })
})
