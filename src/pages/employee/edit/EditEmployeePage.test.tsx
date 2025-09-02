// src/components/employee/edit/EditEmployeePage.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EditEmployeePage from './EditEmployeePage'
import { getEmployeeById, updateMockEmployee } from '../../../lib/mock/employees'
import { getMockDepartments } from '../../../lib/mock/departments'

// Mock do React Router
const mockedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}))

// Mocks das funções externas
jest.mock('../../../lib/mock/employees', () => ({
  getEmployeeById: jest.fn(),
  updateMockEmployee: jest.fn(),
}))

jest.mock('../../../lib/mock/departments', () => ({
  getMockDepartments: jest.fn(),
}))

describe('EditEmployeePage', () => {
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
    admissionDate: '2022-01-15T00:00:00.000Z',
    isActive: true,
  }

  const departmentsMock = [
    { id: 1, name: 'TI' },
    { id: 2, name: 'RH' },
  ]

  beforeEach(() => {
    jest.resetAllMocks()
    mockedNavigate.mockReset()
    ;(getEmployeeById as jest.Mock).mockReturnValue(employeeMock)
    ;(getMockDepartments as jest.Mock).mockResolvedValue(departmentsMock)
  })

  it('mostra loading inicialmente', () => {
    render(<EditEmployeePage params={{ id: '1' }} />)
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('renderiza formulário preenchido com os dados do funcionário', async () => {
    render(<EditEmployeePage params={{ id: '1' }} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('João Silva')).toBeInTheDocument()
      expect(screen.getByDisplayValue('123.456.789-00')).toBeInTheDocument()
      expect(screen.getByDisplayValue('5500')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Desenvolvedor')).toBeInTheDocument()
      expect(screen.getByDisplayValue('1')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2022-01-15')).toBeInTheDocument()
    })
  })

  it('mostra erro se funcionário não encontrado', async () => {
    ;(getEmployeeById as jest.Mock).mockReturnValue(null)
    render(<EditEmployeePage params={{ id: '999' }} />)

    await waitFor(() => {
      expect(screen.getByText(/funcionário não encontrado/i)).toBeInTheDocument()
    })
  })

  it('salva alterações e chama navigate se updateMockEmployee retorna true', async () => {
    ;(updateMockEmployee as jest.Mock).mockReturnValue(true)

    render(<EditEmployeePage params={{ id: '1' }} />)

    await waitFor(() => screen.getByDisplayValue('João Silva'))

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'João Alterado' } })
    fireEvent.click(screen.getByText(/salvar/i))

    await waitFor(() => {
      expect(updateMockEmployee).toHaveBeenCalledWith(
        employeeMock.id,
        expect.objectContaining({ name: 'João Alterado' })
      )
      expect(mockedNavigate).toHaveBeenCalledWith('/employee')
    })
  })

  it('mostra erro se updateMockEmployee retorna false', async () => {
    ;(updateMockEmployee as jest.Mock).mockReturnValue(false)

    render(<EditEmployeePage params={{ id: '1' }} />)

    await waitFor(() => screen.getByDisplayValue('João Silva'))

    fireEvent.click(screen.getByText(/salvar/i))

    await waitFor(() => {
      expect(screen.getByText(/erro ao salvar dados do funcionário/i)).toBeInTheDocument()
    })
  })

  it('botão Voltar chama navigate("/employee")', async () => {
    render(<EditEmployeePage params={{ id: '1' }} />)

    await waitFor(() => screen.getByDisplayValue('João Silva'))

    fireEvent.click(screen.getByText(/voltar/i))
    expect(mockedNavigate).toHaveBeenCalledWith('/employee')
  })
})
