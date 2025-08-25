// src/components/footer/Footer.test.tsx

import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renderiza o footer com o texto correto', () => {
    render(<Footer />);
    
    const footer = screen.getByRole('contentinfo'); // <footer> é role="contentinfo"
    expect(footer).toBeInTheDocument();

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Sistema de Funcionários. Todos os direitos reservados.`)).toBeInTheDocument();
  });
});
