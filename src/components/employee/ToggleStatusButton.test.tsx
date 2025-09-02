// src/components/employee/toggle-status-button/ToggleStatusButton.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToggleStatusButton } from './ToggleStatusButton';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const employeeId = 1;
const onStatusChangeMock = jest.fn();

const server = setupServer(
  rest.post(`/api/employees/${employeeId}/toggle-status`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ isActive: false }));
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  onStatusChangeMock.mockClear();
});
afterAll(() => server.close());

describe('ToggleStatusButton', () => {
  let alertMock: jest.SpyInstance;

  beforeEach(() => {
    alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertMock.mockRestore();
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

  it('chama a API e atualiza status corretamente', async () => {
    render(
      <ToggleStatusButton
        employeeId={employeeId}
        initialStatus={true}
        onStatusChange={onStatusChangeMock}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Durante loading
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Carregando...');

    await waitFor(() => expect(onStatusChangeMock).toHaveBeenCalledWith(false));
    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent('Inativo');
  });

  it('mostra alerta em caso de erro na API', async () => {
    server.use(
      rest.post(`/api/employees/${employeeId}/toggle-status`, (req, res, ctx) => {
        return res(ctx.status(500));
      })
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

    await waitFor(() =>
      expect(alertMock).toHaveBeenCalledWith('Erro ao alterar status')
    );
    expect(onStatusChangeMock).not.toHaveBeenCalled();
    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent('Ativo');
  });
});
