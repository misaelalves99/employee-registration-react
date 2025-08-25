// src/pages/not-found/NotFoundPage.test.tsx

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
  it('renderiza título e descrição corretamente', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/erro 404/i);
    expect(screen.getByText(/a página que você está procurando não foi encontrada/i)).toBeInTheDocument();
  });

  it('possui link de retorno à página inicial', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /voltar à página inicial/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('verifica se os elementos possuem as classes CSS corretas', () => {
    const { container } = render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('container');

    const title = container.querySelector('h1');
    expect(title).toHaveClass('title');

    const description = container.querySelector('p');
    expect(description).toHaveClass('description');

    const link = container.querySelector('a');
    expect(link).toHaveClass('btn');
  });
});
