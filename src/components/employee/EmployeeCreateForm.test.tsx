// src/components/employee/EmployeeCreateForm.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmployeeCreateForm } from './EmployeeCreateForm';
import { POSITIONS } from '../../types/position';

// Mock de departamentos
const mockDepartments = [
  { id: 1, name: 'TI' },
  { id: 2, name: 'RH' },
];

// Mock de navigate
const navigateMock = jest.fn();

// Mock de useEmployee
const addEmployeeMock = jest.fn();

jest.mock('../../hooks/useEmployee', () => ({
  useEmployee: () => ({
    addEmployee: addEmployeeMock,
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigateMock,
}));

describe('EmployeeCreateForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<EmployeeCreateForm departments={mockDepartments} />);
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

    expect(addEmployeeMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('submits valid form data', async () => {
    // Preenche os campos
    await userEvent.type(screen.getByLabelText(/Nome/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/CPF/i), '12345678900');
    await userEvent.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/Telefone/i), '1111-1111');
    await userEvent.type(screen.getByLabelText(/Endereço/i), 'Rua A, 123');
    await userEvent.selectOptions(screen.getByLabelText(/Cargo/i), POSITIONS[0]);
    await userEvent.selectOptions(
      screen.getByLabelText(/Departamento/i),
      mockDepartments[0].id.toString(),
    );
    await userEvent.type(screen.getByLabelText(/Salário/i), '2500');
    await userEvent.type(screen.getByLabelText(/Data de Admissão/i), '2025-08-21');

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    await waitFor(() => {
      expect(addEmployeeMock).toHaveBeenCalledTimes(1);
    });

    // Verifica dados passados para addEmployee
    const payload = addEmployeeMock.mock.calls[0][0];
    expect(payload).toEqual({
      name: 'John Doe',
      cpf: '12345678900',
      email: 'john@example.com',
      phone: '1111-1111',
      address: 'Rua A, 123',
      position: POSITIONS[0],
      departmentId: mockDepartments[0].id,
      salary: 2500,
      admissionDate: '2025-08-21',
      isActive: true,
    });

    expect(navigateMock).toHaveBeenCalledWith('/employee');
  });

  it('shows error for invalid salary', async () => {
    await userEvent.type(screen.getByLabelText(/Salário/i), 'abc');
    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    expect(await screen.findByText('Salário inválido.')).toBeInTheDocument();
    expect(addEmployeeMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
