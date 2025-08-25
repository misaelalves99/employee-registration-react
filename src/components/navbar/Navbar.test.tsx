// src/components/navbar/Navbar.test.tsx

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('renderiza corretamente todos os links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Marcações principais
    expect(screen.getByText('Sistema de Funcionários')).toBeInTheDocument();
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Funcionários')).toBeInTheDocument();
    expect(screen.getByText('Privacidade')).toBeInTheDocument();

    // Verifica links
    expect(screen.getByText('Início').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Funcionários').closest('a')).toHaveAttribute('href', '/employee');
    expect(screen.getByText('Privacidade').closest('a')).toHaveAttribute('href', '/privacy');
  });

  it('aplica a classe activeLink corretamente para a rota inicial', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Início');
    expect(homeLink).toHaveClass('activeLink');

    const employeeLink = screen.getByText('Funcionários');
    expect(employeeLink).not.toHaveClass('activeLink');
  });

  it('aplica a classe activeLink corretamente para a rota /employee', () => {
    render(
      <MemoryRouter initialEntries={['/employee']}>
        <Navbar />
      </MemoryRouter>
    );

    const employeeLink = screen.getByText('Funcionários');
    expect(employeeLink).toHaveClass('activeLink');

    const homeLink = screen.getByText('Início');
    expect(homeLink).not.toHaveClass('activeLink');
  });
});
