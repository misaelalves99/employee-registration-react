// src/pages/employee/reactivate/ReactivateEmployeePage.test.tsx

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import EmployeeReactivatePage from './ReactivateEmployeePage';
import * as employeesMock from '../../../lib/mock/employees';
import * as ReactRouterDom from 'react-router-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('../../../lib/mock/employees');

describe('ReactivateEmployeePage', () => {
  const employeeMock = {
    id: 1,
    name: 'João Silva',
    cpf: '123.456.789-00',
    email: 'joao@example.com',
    phone: '(11) 99999-9999',
    address: 'Rua A, 123',
    position: 'Desenvolvedor',
    department: { id: 1, name: 'TI' },
    departmentId: 1,
    salary: 5500,
    admissionDate: '2022-01-15',
    isActive: false,
  };

  const navigateMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(ReactRouterDom, 'useNavigate').mockReturnValue(navigateMock);
  });

  function renderWithRouter(path: string) {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/employee/reactivate/:id" element={<EmployeeReactivatePage />} />
        </Routes>
      </MemoryRouter>
    );
  }

  it('exibe loading inicialmente', () => {
    (employeesMock.getEmployeeById as jest.Mock).mockReturnValue(employeeMock);
    renderWithRouter('/employee/reactivate/1');
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('renderiza dados do funcionário', async () => {
    (employeesMock.getEmployeeById as jest.Mock).mockReturnValue(employeeMock);
    renderWithRouter('/employee/reactivate/1');

    await waitFor(() => {
      expect(screen.getByText('Reativar Funcionário')).toBeInTheDocument();
      expect(screen.getByText(employeeMock.name)).toBeInTheDocument();
      expect(screen.getByText(employeeMock.cpf)).toBeInTheDocument();
    });
  });

  it('mostra erro se funcionário não encontrado', async () => {
    (employeesMock.getEmployeeById as jest.Mock).mockReturnValue(null);
    renderWithRouter('/employee/reactivate/999');

    await waitFor(() => {
      expect(screen.getByText(/funcionário não encontrado/i)).toBeInTheDocument();
    });
  });

  it('ativa funcionário e navega ao clicar em reativar', async () => {
    jest.useFakeTimers();
    (employeesMock.getEmployeeById as jest.Mock).mockReturnValue(employeeMock);
    (employeesMock.updateMockEmployee as jest.Mock).mockReturnValue(true);

    renderWithRouter('/employee/reactivate/1');

    const btn = await screen.findByText('Reativar');
    fireEvent.click(btn);

    expect(btn).toBeDisabled();
    expect(screen.getByText(/reativando/i)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(employeesMock.updateMockEmployee).toHaveBeenCalledWith(employeeMock.id, { isActive: true });
      expect(navigateMock).toHaveBeenCalledWith('/employee');
    });

    jest.useRealTimers();
  });

  it('mostra erro se reativação falha', async () => {
    jest.useFakeTimers();
    (employeesMock.getEmployeeById as jest.Mock).mockReturnValue(employeeMock);
    (employeesMock.updateMockEmployee as jest.Mock).mockReturnValue(false);

    renderWithRouter('/employee/reactivate/1');

    const btn = await screen.findByText('Reativar');
    fireEvent.click(btn);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.getByText(/erro ao reativar funcionário/i)).toBeInTheDocument();
      expect(btn).not.toBeDisabled();
    });

    jest.useRealTimers();
  });
});
