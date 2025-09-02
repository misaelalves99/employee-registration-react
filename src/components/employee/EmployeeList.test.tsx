// src/components/employee/EmployeeList.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeList from './EmployeeList';
import { Position } from '../../types/position';
import { Employee } from '../../types/employee';

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

describe('EmployeeList', () => {
  let onDeleteMock: jest.Mock;
  let onToggleStatusMock: jest.Mock;

  beforeEach(() => {
    onDeleteMock = jest.fn();
    onToggleStatusMock = jest.fn();
  });

  it('renderiza a tabela com todos os funcionários', () => {
    render(<EmployeeList employees={employeesMock} onDelete={onDeleteMock} onToggleStatus={onToggleStatusMock} />);

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

  it('chama onDelete quando o botão Deletar é clicado', () => {
    render(<EmployeeList employees={employeesMock} onDelete={onDeleteMock} />);
    fireEvent.click(screen.getAllByTitle('Deletar')[0]);
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledWith(employeesMock[0]);
  });

  it('chama onToggleStatus quando os botões Ativar/Inativar são clicados', () => {
    render(<EmployeeList employees={employeesMock} onDelete={onDeleteMock} onToggleStatus={onToggleStatusMock} />);

    // Inativar funcionário ativo
    fireEvent.click(screen.getByTitle('Inativar'));
    expect(onToggleStatusMock).toHaveBeenCalledTimes(1);
    expect(onToggleStatusMock).toHaveBeenCalledWith(employeesMock[0]);

    // Ativar funcionário inativo
    fireEvent.click(screen.getByTitle('Ativar'));
    expect(onToggleStatusMock).toHaveBeenCalledTimes(2);
    expect(onToggleStatusMock).toHaveBeenCalledWith(employeesMock[1]);
  });

  it('renderiza corretamente mesmo sem onToggleStatus', () => {
    render(<EmployeeList employees={employeesMock} onDelete={onDeleteMock} />);
    // Deve renderizar botões de delete
    expect(screen.getAllByTitle('Deletar')).toHaveLength(2);
    // Não deve renderizar botões de toggleStatus
    expect(screen.queryByTitle('Inativar')).toBeNull();
    expect(screen.queryByTitle('Ativar')).toBeNull();
  });
});
