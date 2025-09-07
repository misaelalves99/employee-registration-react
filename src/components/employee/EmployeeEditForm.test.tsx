// src/components/employee/EmployeeEditForm.test.tsx

// src/components/employee/EmployeeEditForm.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmployeeEditForm from './EmployeeEditForm';
import { Department } from '../../types/department';
import { POSITIONS } from '../../types/position';

// mock do funcionário
const employeeMock = {
  id: 1,
  name: 'João Silva',
  cpf: '123.456.789-00',
  email: 'joao@example.com',
  phone: '1111-1111',
  address: 'Rua A, 123',
  position: POSITIONS[0],
  departmentId: 2,
  salary: 5500,
  admissionDate: '2022-01-15',
  isActive: true,
};

// departamentos mock
const departmentsMock: Department[] = [
  { id: 1, name: 'RH' },
  { id: 2, name: 'TI' },
];

// mock do hook useEmployee
const updateEmployeeMock = jest.fn();

jest.mock('../../hooks/useEmployee', () => ({
  useEmployee: () => ({
    updateEmployee: updateEmployeeMock,
  }),
}));

describe('EmployeeEditForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<EmployeeEditForm employee={employeeMock} departments={departmentsMock} />);
  });

  it('renderiza todos os campos com valores do funcionário', () => {
    expect(screen.getByLabelText(/Nome/i)).toHaveValue(employeeMock.name);
    expect(screen.getByLabelText(/CPF/i)).toHaveValue(employeeMock.cpf);
    expect(screen.getByLabelText(/Email/i)).toHaveValue(employeeMock.email);
    expect(screen.getByLabelText(/Telefone/i)).toHaveValue(employeeMock.phone);
    expect(screen.getByLabelText(/Endereço/i)).toHaveValue(employeeMock.address);
    expect(screen.getByLabelText(/Salário/i)).toHaveValue(employeeMock.salary.toString());
    expect(screen.getByLabelText(/Data de Admissão/i)).toHaveValue(employeeMock.admissionDate);
    expect(screen.getByLabelText(/Cargo/i)).toHaveValue(employeeMock.position);
    expect(screen.getByLabelText(/Departamento/i)).toHaveValue(employeeMock.departmentId.toString());
  });

  it('mostra erros de validação ao submeter campos vazios', async () => {
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Cargo/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Departamento/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Salário/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Data de Admissão/i), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    expect(await screen.findByText('Nome é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('CPF é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Email é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Cargo é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Departamento é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Salário inválido.')).toBeInTheDocument();
    expect(screen.getByText('Data de admissão é obrigatória.')).toBeInTheDocument();

    expect(updateEmployeeMock).not.toHaveBeenCalled();
  });

  it('submete formulário válido chamando updateEmployee', async () => {
    // Alterar alguns valores
    userEvent.clear(screen.getByLabelText(/Nome/i));
    userEvent.type(screen.getByLabelText(/Nome/i), 'Maria Oliveira');

    userEvent.selectOptions(screen.getByLabelText(/Cargo/i), POSITIONS[1]);
    userEvent.selectOptions(screen.getByLabelText(/Departamento/i), departmentsMock[0].id.toString());

    updateEmployeeMock.mockReturnValue(true);

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    await waitFor(() => {
      expect(updateEmployeeMock).toHaveBeenCalledWith(employeeMock.id, {
        name: 'Maria Oliveira',
        cpf: employeeMock.cpf,
        email: employeeMock.email,
        phone: employeeMock.phone,
        address: employeeMock.address,
        position: POSITIONS[1],
        departmentId: departmentsMock[0].id,
        salary: employeeMock.salary,
        admissionDate: employeeMock.admissionDate,
      });
    });
  });

  it('mostra erro ao fornecer salário inválido', async () => {
    fireEvent.change(screen.getByLabelText(/Salário/i), { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    expect(await screen.findByText('Salário inválido.')).toBeInTheDocument();
    expect(updateEmployeeMock).not.toHaveBeenCalled();
  });

  it('mostra loading enquanto atualiza', async () => {
    updateEmployeeMock.mockImplementation(() => new Promise((res) => setTimeout(() => res(true), 100)));

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    expect(screen.getByRole('button', { name: /Atualizando.../i })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Salvar/i })).not.toBeDisabled();
    });
  });

  it('mostra alerta em caso de erro', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    updateEmployeeMock.mockImplementation(() => { throw new Error('fail'); });

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Erro ao atualizar funcionário. Tente novamente.');
    });

    alertSpy.mockRestore();
  });
});
