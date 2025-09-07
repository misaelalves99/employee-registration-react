// src/components/employee/toggle-status-button/ToggleStatusButton.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToggleStatusButton } from './ToggleStatusButton';

const employeeId = 1;
const onStatusChangeMock = jest.fn();

describe('ToggleStatusButton', () => {
  let alertMock: jest.SpyInstance;

  beforeEach(() => {
    alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertMock.mockRestore();
    onStatusChangeMock.mockClear();
  });

  it('renderiza corretamente o botão ativo e inativo', () => {
    const { rerender } = render(
      <ToggleStatusButton
        employeeId={employeeId}
        initialStatus={true}
        onStatusChange={onStatusChangeMock}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Ativo');
    expect(button).toHaveAttribute('title', 'Inativar');

    rerender(
      <ToggleStatusButton
        employeeId={employeeId}
        initialStatus={false}
        onStatusChange={onStatusChangeMock}
      />
    );

    expect(button).toHaveTextContent('Inativo');
    expect(button).toHaveAttribute('title', 'Ativar');
  });

  it('chama onToggleStatus se fornecido e atualiza status corretamente', async () => {
    const onToggleStatusMock = jest.fn().mockResolvedValue(undefined);

    render(
      <ToggleStatusButton
        employeeId={employeeId}
        initialStatus={true}
        onStatusChange={onStatusChangeMock}
        onToggleStatus={onToggleStatusMock}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Durante loading
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Carregando...');

    await waitFor(() => expect(onToggleStatusMock).toHaveBeenCalledWith(employeeId, false));
    await waitFor(() => expect(onStatusChangeMock).toHaveBeenCalledWith(false));

    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent('Inativo');
  });

  it('usa fallback mock se onToggleStatus não for fornecido', async () => {
    render(
      <ToggleStatusButton
        employeeId={employeeId}
        initialStatus={true}
        onStatusChange={onStatusChangeMock}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Carregando...');

    await waitFor(() => expect(onStatusChangeMock).toHaveBeenCalledWith(false));
    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent('Inativo');
  });

  it('mostra alerta em caso de erro no onToggleStatus', async () => {
    const onToggleStatusMock = jest.fn().mockRejectedValue(new Error('Erro de API'));

    render(
      <ToggleStatusButton
        employeeId={employeeId}
        initialStatus={true}
        onStatusChange={onStatusChangeMock}
        onToggleStatus={onToggleStatusMock}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => expect(alertMock).toHaveBeenCalledWith('Erro ao atualizar status do funcionário.'));
    expect(onStatusChangeMock).not.toHaveBeenCalled();
    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent('Ativo');
  });
});
