// src/components/employee/EmployeeEditForm.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmployeeEditForm from './EmployeeEditForm';
import { Department } from '../../types/department';
import { POSITIONS } from '../../types/position';

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
};

const departmentsMock: Department[] = [
  { id: 1, name: 'RH' },
  { id: 2, name: 'TI' },
];

describe('EmployeeEditForm', () => {
  let onUpdateMock: jest.Mock;

  beforeEach(() => {
    onUpdateMock = jest.fn().mockResolvedValue(undefined);
    render(
      <EmployeeEditForm
        employee={employeeMock}
        departments={departmentsMock}
        onUpdate={onUpdateMock}
      />
    );
  });

  it('renderiza todos os campos com valores do funcionário', () => {
    expect(screen.getByLabelText(/name/i)).toHaveValue(employeeMock.name);
    expect(screen.getByLabelText(/cpf/i)).toHaveValue(employeeMock.cpf);
    expect(screen.getByLabelText(/email/i)).toHaveValue(employeeMock.email);
    expect(screen.getByLabelText(/phone/i)).toHaveValue(employeeMock.phone);
    expect(screen.getByLabelText(/address/i)).toHaveValue(employeeMock.address);
    expect(screen.getByLabelText(/salary/i)).toHaveValue(employeeMock.salary.toString());
    expect(screen.getByLabelText(/admissionDate/i)).toHaveValue(employeeMock.admissionDate);
    expect(screen.getByLabelText(/Cargo/i)).toHaveValue(employeeMock.position);
    expect(screen.getByLabelText(/Departamento/i)).toHaveValue(employeeMock.departmentId.toString());
  });

  it('mostra erros de validação ao submeter campos vazios', async () => {
    // Limpar campos obrigatórios
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/cpf/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Cargo/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Departamento/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/salary/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/admissionDate/i), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    expect(await screen.findByText('Nome é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('CPF é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Email é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Cargo é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Departamento é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Salário inválido.')).toBeInTheDocument();
    expect(screen.getByText('Data de admissão é obrigatória.')).toBeInTheDocument();
    expect(onUpdateMock).not.toHaveBeenCalled();
  });

  it('submete formulário válido chamando onUpdate com FormData', async () => {
    // Alterar alguns valores
    userEvent.clear(screen.getByLabelText(/name/i));
    userEvent.type(screen.getByLabelText(/name/i), 'Maria Oliveira');

    userEvent.selectOptions(screen.getByLabelText(/Cargo/i), POSITIONS[1]);
    userEvent.selectOptions(screen.getByLabelText(/Departamento/i), departmentsMock[0].id.toString());

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    await waitFor(() => {
      expect(onUpdateMock).toHaveBeenCalledTimes(1);
    });

    const formDataArg = onUpdateMock.mock.calls[0][0] as FormData;
    expect(formDataArg.get('name')).toBe('Maria Oliveira');
    expect(formDataArg.get('position')).toBe(POSITIONS[1]);
    expect(formDataArg.get('departmentId')).toBe(departmentsMock[0].id.toString());
  });

  it('mostra erro ao fornecer salário inválido', async () => {
    fireEvent.change(screen.getByLabelText(/salary/i), { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    expect(await screen.findByText('Salário inválido.')).toBeInTheDocument();
    expect(onUpdateMock).not.toHaveBeenCalled();
  });
});
