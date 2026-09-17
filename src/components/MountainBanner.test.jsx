import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MountainBanner from './MountainBanner'

describe('MountainBanner', () => {
  it('renderuje kontener z opisem dla czytników ekranu, gdy WebGL nie jest dostępny (jsdom)', () => {
    render(<MountainBanner />)

    expect(screen.getByRole('img', { name: 'Ilustracja gór' })).toBeInTheDocument()
  })

  it('pokazuje wizualny fallback zamiast canvasu, gdy WebGL nie jest wspierany', () => {
    const { container } = render(<MountainBanner />)

    expect(container.querySelector('.mountain-banner-fallback')).toBeInTheDocument()
    expect(container.querySelector('canvas')).not.toBeInTheDocument()
  })
})
