// src/pages/HomePage.test.tsx

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from './HomePage'

describe('HomePage', () => {
  it('renderiza título e descrição corretamente', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /bem-vindo ao sistema de funcionários/i
    )

    expect(
      screen.getByText(/este sistema permite o cadastro, edição e gerenciamento/i)
    ).toBeInTheDocument()
  })

  it('possui elementos principais com classes de estilo', () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    const main = container.querySelector('main')
    expect(main).toHaveClass('main')

    const title = container.querySelector('h1')
    expect(title).toHaveClass('title')

    const description = container.querySelector('p')
    expect(description).toHaveClass('description')

    const link = container.querySelector('a')
    expect(link).toHaveClass('btnPrimary')
    expect(link).toHaveAttribute('href', '/employee')
  })

  it('link de navegação leva para a página de funcionários', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    const link = screen.getByRole('link', { name: /ir para funcionários/i })
    expect(link).toHaveAttribute('href', '/employee')
  })
})
