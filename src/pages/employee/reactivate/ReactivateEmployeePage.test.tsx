// src/pages/employee/reactivate/ReactivateEmployeePage.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EmployeeReactivatePage from './ReactivateEmployeePage'
import * as employeesMock from '../../../lib/mock/employees'
import * as ReactRouterDom from 'react-router-dom'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

// Mock do React Router
const navigateMock = jest.fn()
jest.spyOn(ReactRouterDom, 'useNavigate').mockReturnValue(navigateMock)

// Mock do módulo de employees
jest.mock('../../../lib/mock/employees')

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
  }

  let getEmployeeByIdMock: jest.Mock
  let updateMockEmployeeMock: jest.Mock

  beforeEach(() => {
    jest.resetAllMocks()
    navigateMock.mockReset()
    getEmployeeByIdMock = employeesMock.getEmployeeById as jest.Mock
    updateMockEmployeeMock = employeesMock.updateMockEmployee as jest.Mock
  })

  function renderWithRouter(path: string) {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/employee/reactivate/:id" element={<EmployeeReactivatePage />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('exibe loading inicialmente', () => {
    getEmployeeByIdMock.mockReturnValue(employeeMock)
    renderWithRouter('/employee/reactivate/1')
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('renderiza dados do funcionário', async () => {
    getEmployeeByIdMock.mockReturnValue(employeeMock)
    renderWithRouter('/employee/reactivate/1')

    await waitFor(() => {
      expect(screen.getByText('Reativar Funcionário')).toBeInTheDocument()
      expect(screen.getByText(employeeMock.name)).toBeInTheDocument()
      expect(screen.getByText(employeeMock.cpf)).toBeInTheDocument()
      expect(screen.getByText(employeeMock.email)).toBeInTheDocument()
      expect(screen.getByText(employeeMock.position)).toBeInTheDocument()
      expect(screen.getByText(employeeMock.department.name)).toBeInTheDocument()
    })
  })

  it('mostra erro se funcionário não encontrado', async () => {
    getEmployeeByIdMock.mockReturnValue(null)
    renderWithRouter('/employee/reactivate/999')

    await waitFor(() => {
      expect(screen.getByText(/funcionário não encontrado/i)).toBeInTheDocument()
    })
  })

  it('ativa funcionário e navega ao clicar em reativar', async () => {
    getEmployeeByIdMock.mockReturnValue(employeeMock)
    updateMockEmployeeMock.mockReturnValue(true)

    renderWithRouter('/employee/reactivate/1')

    const btn = await screen.findByText('Reativar')
    fireEvent.click(btn)

    await waitFor(() => {
      expect(updateMockEmployeeMock).toHaveBeenCalledWith(employeeMock.id, { ...employeeMock, isActive: true })
      expect(navigateMock).toHaveBeenCalledWith('/employee')
    })
  })

  it('mostra erro se reativação falha', async () => {
    getEmployeeByIdMock.mockReturnValue(employeeMock)
    updateMockEmployeeMock.mockReturnValue(false)

    renderWithRouter('/employee/reactivate/1')

    const btn = await screen.findByText('Reativar')
    fireEvent.click(btn)

    await waitFor(() => {
      expect(screen.getByText(/erro ao reativar funcionário/i)).toBeInTheDocument()
      expect(btn).not.toBeDisabled()
    })
  })

  it('botão Cancelar chama navigate("/employee")', async () => {
    getEmployeeByIdMock.mockReturnValue(employeeMock)
    renderWithRouter('/employee/reactivate/1')

    const cancelBtn = await screen.findByText(/cancelar/i)
    fireEvent.click(cancelBtn)

    expect(navigateMock).toHaveBeenCalledWith('/employee')
  })
})
