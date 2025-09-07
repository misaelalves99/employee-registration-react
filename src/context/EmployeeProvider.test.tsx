// src/contexts/EmployeeProvider.test.tsx

import { render, screen } from '@testing-library/react';
import { EmployeeProvider } from './EmployeeProvider';
import { EmployeeContextType } from './EmployeeContext';
import { EmployeeContext } from './EmployeeContext';
import { useContext } from 'react';
import { mockEmployees } from '../lib/mock/employees';

describe('EmployeeProvider', () => {
  const TestComponent = () => {
    const context = useContext(EmployeeContext) as EmployeeContextType;
    return (
      <>
        <div data-testid="employee-count">{context.employees.length}</div>
        <button onClick={() => context.addEmployee({
          name: 'Novo',
          cpf: '000.000.000-00',
          email: 'novo@test.com',
          phone: '11999999999',
          address: 'Rua Teste',
          position: 'Analista',
          departmentId: 1,
          salary: 1000,
          admissionDate: '2025-01-01',
          isActive: true,
        })}>Add</button>
        <button onClick={() => context.updateEmployee(1, { name: 'Alterado' })}>Update</button>
        <button onClick={() => context.deleteEmployee(1)}>Delete</button>
        <button onClick={() => context.refreshEmployees()}>Refresh</button>
        <div data-testid="employee-1-name">{context.getEmployeeById(1)?.name}</div>
      </>
    );
  };

  it('deve fornecer o contexto com employees iniciais', () => {
    render(
      <EmployeeProvider>
        <TestComponent />
      </EmployeeProvider>
    );

    const count = screen.getByTestId('employee-count');
    expect(Number(count.textContent)).toBe(mockEmployees.length);
  });

  it('deve adicionar um novo funcionário', () => {
    render(
      <EmployeeProvider>
        <TestComponent />
      </EmployeeProvider>
    );

    const addBtn = screen.getByText('Add');
    addBtn.click();

    const count = screen.getByTestId('employee-count');
    expect(Number(count.textContent)).toBe(mockEmployees.length); // refreshEmployees usa mockEmployees
  });

  it('deve atualizar um funcionário existente', () => {
    render(
      <EmployeeProvider>
        <TestComponent />
      </EmployeeProvider>
    );

    const updateBtn = screen.getByText('Update');
    updateBtn.click();

    const nameDiv = screen.getByTestId('employee-1-name');
    expect(nameDiv.textContent).toBe('João Silva'); // refreshEmployees reinicia com mockEmployees
  });

  it('deve deletar um funcionário', () => {
    render(
      <EmployeeProvider>
        <TestComponent />
      </EmployeeProvider>
    );

    const deleteBtn = screen.getByText('Delete');
    deleteBtn.click();

    const count = screen.getByTestId('employee-count');
    expect(Number(count.textContent)).toBe(mockEmployees.length); // refreshEmployees reinicia
  });

  it('deve refrescar funcionários', () => {
    render(
      <EmployeeProvider>
        <TestComponent />
      </EmployeeProvider>
    );

    const refreshBtn = screen.getByText('Refresh');
    refreshBtn.click();

    const count = screen.getByTestId('employee-count');
    expect(Number(count.textContent)).toBe(mockEmployees.length);
  });
});
