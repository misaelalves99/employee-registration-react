// src/components/footer/Footer.test.tsx

import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renderiza o footer com o texto correto', () => {
    render(<Footer />);

    // Verifica se o footer está presente
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();

    // Verifica o texto dinâmico com o ano atual
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(
        new RegExp(`© ${currentYear} Sistema de Funcionários\\. Todos os direitos reservados\\.`)
      )
    ).toBeInTheDocument();
  });
});
