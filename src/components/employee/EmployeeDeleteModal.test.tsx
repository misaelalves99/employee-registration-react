import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmployeeDeleteModal } from './EmployeeDeleteModal';
import { Employee } from '../../types/employee';

const employeeMock: Employee = {
  id: 1,
  name: 'João Silva',
  cpf: '123.456.789-00',
  email: 'joao@example.com',
  position: 'Desenvolvedor',
  department: { id: 1, name: 'TI' },
  departmentId: 1,
  salary: 5500,
  admissionDate: '2022-01-15',
  isActive: true,
};

describe('EmployeeDeleteModal', () => {
  it('não renderiza nada quando employee é null', () => {
    const { container } = render(
      <EmployeeDeleteModal
        employee={null}
        onClose={jest.fn()}
        onDeleted={jest.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renderiza modal com dados do funcionário', () => {
    render(
      <EmployeeDeleteModal
        employee={employeeMock}
        onClose={jest.fn()}
        onDeleted={jest.fn()}
      />
    );

    expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument();
    expect(screen.getByText(/Tem certeza que deseja excluir/i)).toBeInTheDocument();
    expect(screen.getByText(employeeMock.name)).toBeInTheDocument();
    expect(screen.getByText('ID:')).toBeInTheDocument();
    expect(screen.getByText(String(employeeMock.id))).toBeInTheDocument();
    expect(screen.getByText('CPF:')).toBeInTheDocument();
    expect(screen.getByText(employeeMock.cpf)).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText(employeeMock.email)).toBeInTheDocument();
    expect(screen.getByText('Cargo:')).toBeInTheDocument();
    expect(screen.getByText(employeeMock.position)).toBeInTheDocument();
    expect(screen.getByText('Departamento:')).toBeInTheDocument();
    expect(screen.getByText(employeeMock.department?.name ?? 'Não informado')).toBeInTheDocument();
  });

  it('chama onClose ao clicar fora do modal ou no botão cancelar', () => {
    const onClose = jest.fn();
    const { rerender } = render(
      <EmployeeDeleteModal
        employee={employeeMock}
        onClose={onClose}
        onDeleted={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('Confirmar Exclusão').parentElement!.parentElement!);
    expect(onClose).toHaveBeenCalledTimes(1);

    onClose.mockReset();
    rerender(
      <EmployeeDeleteModal
        employee={employeeMock}
        onClose={onClose}
        onDeleted={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('Cancelar'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('executa exclusão corretamente e chama onDeleted e onClose', async () => {
    const onClose = jest.fn();
    const onDeleted = jest.fn();
    const deleteMock = jest.fn().mockResolvedValue(undefined);

    render(
      <EmployeeDeleteModal
        employee={employeeMock}
        onClose={onClose}
        onDeleted={onDeleted}
        onDeleteEmployee={deleteMock}
      />
    );

    fireEvent.click(screen.getByText('Confirmar Exclusão'));
    expect(screen.getByText('Deletando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(deleteMock).toHaveBeenCalledWith(employeeMock.id);
      expect(onDeleted).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('desabilita botões enquanto loading', async () => {
    // Tipando explicitamente como função que recebe number e retorna Promise<void>
    const deleteMock: (id: number) => Promise<void> = jest.fn(
      () => new Promise<void>((res) => setTimeout(res, 100))
    );

    render(
      <EmployeeDeleteModal
        employee={employeeMock}
        onClose={jest.fn()}
        onDeleted={jest.fn()}
        onDeleteEmployee={deleteMock}
      />
    );

    const confirmButton = screen.getByText('Confirmar Exclusão') as HTMLButtonElement;
    const cancelButton = screen.getByText('Cancelar') as HTMLButtonElement;

    fireEvent.click(confirmButton);

    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();

    await waitFor(() => {
      expect(confirmButton).not.toBeDisabled();
      expect(cancelButton).not.toBeDisabled();
    });
  });

  it('mostra mensagem de erro caso delete falhe', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const failDeleteMock = jest.fn().mockRejectedValue(new Error('fail'));

    render(
      <EmployeeDeleteModal
        employee={employeeMock}
        onClose={jest.fn()}
        onDeleted={jest.fn()}
        onDeleteEmployee={failDeleteMock}
      />
    );

    fireEvent.click(screen.getByText('Confirmar Exclusão'));

    await waitFor(() => {
      expect(failDeleteMock).toHaveBeenCalledWith(employeeMock.id);
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('Erro ao deletar funcionário. Tente novamente.');
    });

    consoleErrorSpy.mockRestore();
    alertSpy.mockRestore();
  });
});
