// src/components/employee/EmployeeList.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { EmployeeList } from './EmployeeList';
import { Employee } from '../../types/employee';
import { Position } from '../../types/position';

// Mock do hook useEmployee
const deleteEmployeeMock = jest.fn();
const updateEmployeeMock = jest.fn();
const employeesMock: Employee[] = [
  {
    id: 1,
    name: 'João Silva',
    cpf: '123.456.789-00',
    email: 'joao@example.com',
    phone: '11999999999',
    address: 'Rua Teste, 123',
    position: 'Desenvolvedor' as Position,
    department: { id: 2, name: 'TI' },
    departmentId: 2,
    salary: 5000,
    admissionDate: '2023-01-01',
    isActive: true,
  },
  {
    id: 2,
    name: 'Maria Souza',
    cpf: '987.654.321-00',
    email: 'maria@example.com',
    phone: '11988888888',
    address: 'Rua Teste, 456',
    position: 'Analista' as Position,
    department: null,
    departmentId: 0,
    salary: 4000,
    admissionDate: '2022-05-15',
    isActive: false,
  },
];

jest.mock('../../hooks/useEmployee', () => ({
  useEmployee: () => ({
    employees: employeesMock,
    deleteEmployee: deleteEmployeeMock,
    updateEmployee: updateEmployeeMock,
  }),
}));

// Mock do window.confirm
const confirmSpy = jest.spyOn(window, 'confirm');

describe('EmployeeList', () => {
  beforeEach(() => {
    deleteEmployeeMock.mockClear();
    updateEmployeeMock.mockClear();
    confirmSpy.mockClear();
  });

  it('renderiza a tabela com todos os funcionários', () => {
    render(<EmployeeList />);

    // Checa nomes e CPFs
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Souza')).toBeInTheDocument();
    expect(screen.getByText('123.456.789-00')).toBeInTheDocument();
    expect(screen.getByText('987.654.321-00')).toBeInTheDocument();

    // Checa departamentos
    expect(screen.getByText('TI')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();

    // Checa status
    expect(screen.getByText('Ativo')).toBeInTheDocument();
    expect(screen.getByText('Inativo')).toBeInTheDocument();

    // Checa links de detalhes e edição
    expect(screen.getAllByText('Detalhes')).toHaveLength(2);
    expect(screen.getAllByText('Editar')).toHaveLength(2);

    // Checa botões de toggleStatus
    expect(screen.getByTitle('Inativar')).toBeInTheDocument();
    expect(screen.getByTitle('Ativar')).toBeInTheDocument();

    // Checa botões de delete
    expect(screen.getAllByTitle('Deletar')).toHaveLength(2);
  });

  it('chama deleteEmployee quando o usuário confirma', () => {
    confirmSpy.mockReturnValue(true); // simula "OK" no confirm
    render(<EmployeeList />);

    fireEvent.click(screen.getAllByTitle('Deletar')[0]);
    expect(deleteEmployeeMock).toHaveBeenCalledTimes(1);
    expect(deleteEmployeeMock).toHaveBeenCalledWith(1);
  });

  it('não chama deleteEmployee quando o usuário cancela', () => {
    confirmSpy.mockReturnValue(false); // simula "Cancelar"
    render(<EmployeeList />);

    fireEvent.click(screen.getAllByTitle('Deletar')[0]);
    expect(deleteEmployeeMock).not.toHaveBeenCalled();
  });

  it('chama updateEmployee ao alternar status', () => {
    render(<EmployeeList />);

    // Inativar funcionário ativo
    fireEvent.click(screen.getByTitle('Inativar'));
    expect(updateEmployeeMock).toHaveBeenCalledTimes(1);
    expect(updateEmployeeMock).toHaveBeenCalledWith(1, { isActive: false });

    // Ativar funcionário inativo
    fireEvent.click(screen.getByTitle('Ativar'));
    expect(updateEmployeeMock).toHaveBeenCalledTimes(2);
    expect(updateEmployeeMock).toHaveBeenCalledWith(2, { isActive: true });
  });
});
