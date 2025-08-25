// src/components/employee/toggle-status-button/ToggleStatusButton.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToggleStatusButton } from './ToggleStatusButton';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const employeeId = 1;
const onStatusChangeMock = jest.fn();

// servidor MSW
const server = setupServer(
  http.post('/api/employees/:id/toggle-status', () =>
    HttpResponse.json({ isActive: true })
  )
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  onStatusChangeMock.mockClear();
});
afterAll(() => server.close());

describe('ToggleStatusButton', () => {
  it('renderiza corretamente como ativo ou inativo', () => {
    const { rerender } = render(
      <ToggleStatusButton
        employeeId={employeeId}
        initialStatus={true}
        onStatusChange={onStatusChangeMock}
      />
    );
    expect(screen.getByRole('button')).toHaveTextContent('Ativo');
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Inativar');

    rerender(
      <ToggleStatusButton
        employeeId={employeeId}
        initialStatus={false}
        onStatusChange={onStatusChangeMock}
      />
    );
    expect(screen.getByRole('button')).toHaveTextContent('Inativo');
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Ativar');
  });

  it('chama API e onStatusChange corretamente ao clicar', async () => {
    server.use(
      http.post('/api/employees/:id/toggle-status', () =>
        HttpResponse.json({ isActive: false })
      )
    );

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

    await waitFor(() =>
      expect(onStatusChangeMock).toHaveBeenCalledWith(false)
    );

    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent('Inativo');
  });

  it('mostra alerta em caso de erro na API', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    server.use(
      http.post('/api/employees/:id/toggle-status', () =>
        HttpResponse.error()
      )
    );

    render(
      <ToggleStatusButton
        employeeId={employeeId}
        initialStatus={true}
        onStatusChange={onStatusChangeMock}
      />
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith('Erro ao alterar status')
    );
    expect(onStatusChangeMock).not.toHaveBeenCalled();

    (window.alert as jest.Mock).mockRestore();
  });
});
