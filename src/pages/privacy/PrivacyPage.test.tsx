// src/pages/privacy/PrivacyPage.test.tsx

import { render, screen } from '@testing-library/react';
import PrivacyPage from './PrivacyPage';

describe('PrivacyPage', () => {
  it('renderiza título e texto corretamente', () => {
    render(<PrivacyPage />);

    // Verifica o título
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent(/política de privacidade/i);

    // Verifica o parágrafo de texto
    const text = screen.getByText(/sua privacidade é importante para nós/i);
    expect(text).toBeInTheDocument();
  });

  it('verifica se os elementos possuem as classes CSS corretas', () => {
    const { container } = render(<PrivacyPage />);

    const main = container.querySelector('main');
    expect(main).toHaveClass('main');

    const h1 = container.querySelector('h1');
    expect(h1).toHaveClass('title');

    const p = container.querySelector('p');
    expect(p).toHaveClass('text');
  });
});
