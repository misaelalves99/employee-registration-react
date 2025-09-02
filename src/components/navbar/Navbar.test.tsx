// src/components/navbar/Navbar.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('renderiza corretamente todos os links e marcações', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Texto e marcações
    expect(screen.getByText('Sistema de Funcionários')).toBeInTheDocument();
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Funcionários')).toBeInTheDocument();
    expect(screen.getByText('Privacidade')).toBeInTheDocument();

    // Atributos href
    expect(screen.getByText('Início').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Funcionários').closest('a')).toHaveAttribute('href', '/employee');
    expect(screen.getByText('Privacidade').closest('a')).toHaveAttribute('href', '/privacy');
  });

  it('aplica a classe activeLink corretamente na rota inicial "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Início');
    const employeeLink = screen.getByText('Funcionários');
    const privacyLink = screen.getByText('Privacidade');

    expect(homeLink).toHaveClass('activeLink');
    expect(employeeLink).not.toHaveClass('activeLink');
    expect(privacyLink).not.toHaveClass('activeLink');
  });

  it('aplica a classe activeLink corretamente na rota "/employee"', () => {
    render(
      <MemoryRouter initialEntries={['/employee']}>
        <Navbar />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Início');
    const employeeLink = screen.getByText('Funcionários');
    const privacyLink = screen.getByText('Privacidade');

    expect(employeeLink).toHaveClass('activeLink');
    expect(homeLink).not.toHaveClass('activeLink');
    expect(privacyLink).not.toHaveClass('activeLink');
  });

  it('aplica a classe activeLink corretamente na rota "/privacy"', () => {
    render(
      <MemoryRouter initialEntries={['/privacy']}>
        <Navbar />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Início');
    const employeeLink = screen.getByText('Funcionários');
    const privacyLink = screen.getByText('Privacidade');

    expect(privacyLink).toHaveClass('activeLink');
    expect(homeLink).not.toHaveClass('activeLink');
    expect(employeeLink).not.toHaveClass('activeLink');
  });
});
