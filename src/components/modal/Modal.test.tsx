// src/components/modal/Modal.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();

  beforeEach(() => {
    onCloseMock.mockClear();
    onConfirmMock.mockClear();
  });

  it('não renderiza nada quando isOpen é false', () => {
    const { container } = render(
      <Modal
        isOpen={false}
        title="Teste"
        body={<p>Corpo</p>}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renderiza título, corpo e botões com labels padrões', () => {
    render(
      <Modal
        isOpen={true}
        title="Título do Modal"
        body={<p>Corpo do modal</p>}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
      />
    );

    expect(screen.getByText('Título do Modal')).toBeInTheDocument();
    expect(screen.getByText('Corpo do modal')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeInTheDocument();
  });

  it('renderiza botões com labels customizados', () => {
    render(
      <Modal
        isOpen={true}
        title="Teste"
        body={<p>Corpo</p>}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        confirmLabel="Sim"
        cancelLabel="Não"
      />
    );

    expect(screen.getByRole('button', { name: 'Sim' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Não' })).toBeInTheDocument();
  });

  it('chama onClose e onConfirm ao clicar nos botões', () => {
    render(
      <Modal
        isOpen={true}
        title="Teste"
        body={<p>Corpo</p>}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCloseMock).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });
});
