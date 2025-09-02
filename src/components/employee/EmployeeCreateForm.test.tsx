// src/components/employee/EmployeeCreateForm.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmployeeCreateForm } from './EmployeeCreateForm';
import { POSITIONS } from '../../types/position';

const mockDepartments = [
  { id: 1, name: 'TI' },
  { id: 2, name: 'RH' }
];

describe('EmployeeCreateForm', () => {
  let onCreateMock: jest.Mock;

  beforeEach(() => {
    onCreateMock = jest.fn().mockResolvedValue(undefined);
    render(<EmployeeCreateForm departments={mockDepartments} onCreate={onCreateMock} />);
  });

  it('renders all input fields and selects', () => {
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Endereço/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cargo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Departamento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Salário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data de Admissão/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Salvar/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    expect(await screen.findByText('Nome é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('CPF é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Email é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Cargo é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Departamento é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Salário inválido.')).toBeInTheDocument();
    expect(screen.getByText('Data de admissão é obrigatória.')).toBeInTheDocument();
    expect(onCreateMock).not.toHaveBeenCalled();
  });

  it('submits valid form data', async () => {
    // Preencher o formulário
    userEvent.type(screen.getByLabelText(/Nome/i), 'John Doe');
    userEvent.type(screen.getByLabelText(/CPF/i), '12345678900');
    userEvent.type(screen.getByLabelText(/Email/i), 'john@example.com');
    userEvent.type(screen.getByLabelText(/Telefone/i), '1111-1111');
    userEvent.type(screen.getByLabelText(/Endereço/i), 'Rua A, 123');
    userEvent.selectOptions(screen.getByLabelText(/Cargo/i), POSITIONS[0]);
    userEvent.selectOptions(screen.getByLabelText(/Departamento/i), mockDepartments[0].id.toString());
    userEvent.type(screen.getByLabelText(/Salário/i), '2500');
    userEvent.type(screen.getByLabelText(/Data de Admissão/i), '2025-08-21');

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    await waitFor(() => {
      expect(onCreateMock).toHaveBeenCalledTimes(1);
    });

    const formDataArg = onCreateMock.mock.calls[0][0] as FormData;
    expect(formDataArg.get('name')).toBe('John Doe');
    expect(formDataArg.get('cpf')).toBe('12345678900');
    expect(formDataArg.get('email')).toBe('john@example.com');
    expect(formDataArg.get('phone')).toBe('1111-1111');
    expect(formDataArg.get('address')).toBe('Rua A, 123');
    expect(formDataArg.get('position')).toBe(POSITIONS[0]);
    expect(formDataArg.get('departmentId')).toBe(mockDepartments[0].id.toString()); // sempre string
    expect(formDataArg.get('salary')).toBe('2500');
    expect(formDataArg.get('admissionDate')).toBe('2025-08-21');
  });

  it('shows error for invalid salary', async () => {
    userEvent.type(screen.getByLabelText(/Salário/i), 'abc');
    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));
    expect(await screen.findByText('Salário inválido.')).toBeInTheDocument();
    expect(onCreateMock).not.toHaveBeenCalled();
  });
});
