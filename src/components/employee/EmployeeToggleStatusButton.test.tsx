// src/components/employee/EmployeeToggleStatusButton.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmployeeToggleStatusButton } from './EmployeeToggleStatusButton';
import { rest, RestRequest, RestContext } from 'msw';
import { setupServer } from 'msw/node';

const employeeId = 1;
const onToggleMock = jest.fn();

// Configuração do servidor MSW com tipos corretos
const server = setupServer(
  rest.post('/api/employee/inactivate/:id', (_req: RestRequest, res, ctx: RestContext) => {
    return res(ctx.status(200));
  }),
  rest.post('/api/employee/reactivate/:id', (_req: RestRequest, res, ctx: RestContext) => {
    return res(ctx.status(200));
  })
);

// Ciclo de vida do servidor
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  onToggleMock.mockClear();
});
afterAll(() => server.close());

describe('EmployeeToggleStatusButton', () => {
  let alertMock: jest.SpyInstance;

  beforeEach(() => {
    alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });
  afterEach(() => {
    alertMock.mockRestore();
  });

  it('renderiza corretamente como ativo ou inativo', () => {
    const { rerender } = render(
      <EmployeeToggleStatusButton employeeId={employeeId} isActive={true} onToggle={onToggleMock} />
    );

    expect(screen.getByRole('button')).toHaveTextContent('Inativo');
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Inativar Funcionário');

    rerender(
      <EmployeeToggleStatusButton employeeId={employeeId} isActive={false} onToggle={onToggleMock} />
    );

    expect(screen.getByRole('button')).toHaveTextContent('Ativo');
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Ativar Funcionário');
  });

  it('chama API correta e onToggle ao inativar', async () => {
    render(<EmployeeToggleStatusButton employeeId={employeeId} isActive={true} onToggle={onToggleMock} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toBeDisabled();

    await waitFor(() => expect(onToggleMock).toHaveBeenCalledWith(false));
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('chama API correta e onToggle ao reativar', async () => {
    render(<EmployeeToggleStatusButton employeeId={employeeId} isActive={false} onToggle={onToggleMock} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toBeDisabled();

    await waitFor(() => expect(onToggleMock).toHaveBeenCalledWith(true));
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('mostra alerta em caso de erro na API', async () => {
    server.use(
      rest.post('/api/employee/inactivate/:id', (_req: RestRequest, res, ctx: RestContext) => {
        return res(ctx.status(500));
      })
    );

    render(<EmployeeToggleStatusButton employeeId={employeeId} isActive={true} onToggle={onToggleMock} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(alertMock).toHaveBeenCalledWith('Erro ao atualizar status.'));
    expect(onToggleMock).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).not.toBeDisabled();
  });
});
