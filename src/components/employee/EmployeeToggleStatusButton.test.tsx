// src/components/employee/EmployeeToggleStatusButton.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { EmployeeToggleStatusButton } from './EmployeeToggleStatusButton';
import { useEmployee } from '../../hooks/useEmployee';

jest.mock('../../hooks/useEmployee');

describe('EmployeeToggleStatusButton', () => {
  const updateEmployeeMock = jest.fn();
  let alertMock: jest.SpyInstance;

  beforeEach(() => {
    (useEmployee as jest.Mock).mockReturnValue({
      updateEmployee: updateEmployeeMock,
    });
    updateEmployeeMock.mockClear();

    alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertMock.mockRestore();
  });

  it('renderiza corretamente como ativo ou inativo', () => {
    const { rerender } = render(<EmployeeToggleStatusButton employeeId={1} isActive={true} />);
    const button = screen.getByRole('button');

    expect(button).toHaveTextContent('Inativo');
    expect(button).toHaveAttribute('title', 'Inativar Funcionário');

    rerender(<EmployeeToggleStatusButton employeeId={1} isActive={false} />);
    expect(screen.getByRole('button')).toHaveTextContent('Ativo');
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Ativar Funcionário');
  });

  it('chama updateEmployee ao clicar no botão', () => {
    render(<EmployeeToggleStatusButton employeeId={1} isActive={true} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(button).not.toBeDisabled(); // loading false imediatamente após a execução síncrona
    expect(updateEmployeeMock).toHaveBeenCalledWith(1, { isActive: false });

    // Testa reverso
    render(<EmployeeToggleStatusButton employeeId={1} isActive={false} />);
    fireEvent.click(screen.getByRole('button'));
    expect(updateEmployeeMock).toHaveBeenCalledWith(1, { isActive: true });
  });

  it('mostra alerta se updateEmployee lançar erro', () => {
    updateEmployeeMock.mockImplementation(() => { throw new Error('fail'); });
    render(<EmployeeToggleStatusButton employeeId={1} isActive={true} />);
    fireEvent.click(screen.getByRole('button'));

    expect(alertMock).toHaveBeenCalledWith('Erro ao atualizar status.');
  });
});
