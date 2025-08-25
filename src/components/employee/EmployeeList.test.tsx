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
  const onDeleteMock = jest.fn();

  beforeEach(() => {
    onDeleteMock.mockClear();
  });

  it('renderiza a tabela com funcionários', () => {
    render(<EmployeeList employees={employeesMock} onDelete={onDeleteMock} />);

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Souza')).toBeInTheDocument();

    expect(screen.getByText('123.456.789-00')).toBeInTheDocument();
    expect(screen.getByText('987.654.321-00')).toBeInTheDocument();

    expect(screen.getByText('TI')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();

    expect(screen.getByText('Ativo')).toBeInTheDocument();
    expect(screen.getByText('Inativo')).toBeInTheDocument();

    expect(screen.getAllByText('Detalhes')).toHaveLength(2);
    expect(screen.getAllByText('Editar')).toHaveLength(2);
    expect(screen.getByTitle('Inativar')).toBeInTheDocument();
    expect(screen.getByTitle('Ativar')).toBeInTheDocument();
    expect(screen.getAllByTitle('Deletar')).toHaveLength(2);
  });

  it('chama onDelete quando o botão Deletar é clicado', () => {
    render(<EmployeeList employees={employeesMock} onDelete={onDeleteMock} />);
    fireEvent.click(screen.getAllByTitle('Deletar')[0]);
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledWith(employeesMock[0]);
  });
});
