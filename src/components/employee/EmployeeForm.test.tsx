// src/components/employee/EmployeeForm.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { EmployeeForm } from './EmployeeForm';
import { Department } from '../../types/department';
import { POSITIONS } from '../../types/position';

// Mock do hook useEmployee
const addEmployeeMock = jest.fn();
jest.mock('../../hooks/useEmployee', () => ({
  useEmployee: () => ({
    addEmployee: addEmployeeMock,
  }),
}));

const departmentsMock: Department[] = [
  { id: 1, name: 'RH' },
  { id: 2, name: 'TI' },
];

describe('EmployeeForm', () => {
  beforeEach(() => {
    addEmployeeMock.mockClear();
    render(<EmployeeForm departments={departmentsMock} />);
  });

  it('renderiza todos os campos do formulário', () => {
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Endereço/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cargo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Departamento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Salário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data de Admissão/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ativo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cadastrar Funcionário/i })).toBeInTheDocument();
  });

  it('mostra erros ao tentar submeter campos obrigatórios vazios', () => {
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Funcionário/i }));

    expect(screen.getByText('Nome é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('CPF é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Email é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Cargo é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Departamento é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Salário é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Data de admissão é obrigatória.')).toBeInTheDocument();

    expect(addEmployeeMock).not.toHaveBeenCalled();
  });

  it('submete formulário válido chamando addEmployee', () => {
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '123.456.789-00' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByLabelText(/Cargo/i), { target: { value: POSITIONS[0] } });
    fireEvent.change(screen.getByLabelText(/Departamento/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/Salário/i), { target: { value: '5000' } });
    fireEvent.change(screen.getByLabelText(/Data de Admissão/i), { target: { value: '2023-01-01' } });

    // Checkbox já está marcado por padrão
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Funcionário/i }));

    expect(addEmployeeMock).toHaveBeenCalledTimes(1);
    expect(addEmployeeMock).toHaveBeenCalledWith({
      name: 'João Silva',
      cpf: '123.456.789-00',
      email: 'joao@example.com',
      phone: '',
      address: '',
      position: POSITIONS[0],
      departmentId: 2,
      salary: 5000,
      admissionDate: '2023-01-01',
      isActive: true,
    });
  });

  it('mostra erro se salário for inválido', () => {
    fireEvent.change(screen.getByLabelText(/Salário/i), { target: { value: '-100' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Funcionário/i }));

    expect(screen.getByText('Salário deve ser um número positivo.')).toBeInTheDocument();
    expect(addEmployeeMock).not.toHaveBeenCalled();
  });

  it('alternar checkbox isActive', () => {
    const checkbox = screen.getByLabelText(/Ativo/i) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });
});
