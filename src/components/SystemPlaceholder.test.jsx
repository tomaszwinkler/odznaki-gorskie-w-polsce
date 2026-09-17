import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SystemPlaceholder from './SystemPlaceholder'

describe('SystemPlaceholder', () => {
  it('pokazuje nazwę systemu w komunikacie o przygotowywanych danych', () => {
    render(<SystemPlaceholder systemName="Korona Sudetów Polskich" />)

    expect(screen.getByText(/Korona Sudetów Polskich/)).toBeInTheDocument()
    expect(screen.getByText(/w przygotowaniu/)).toBeInTheDocument()
  })
})
