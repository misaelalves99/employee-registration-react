// src/pages/employee/EmployeePage.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EmployeePage, { EmployeeFilters } from './EmployeePage'
import { mockEmployees } from '../../lib/mock/employees'
import { MemoryRouter } from 'react-router-dom'

// Mock do EmployeeFilter
interface EmployeeFilterProps {
  onFilterChange: (filters: EmployeeFilters) => void
}

jest.mock('../../components/employee/EmployeeFilter', () => ({
  __esModule: true,
  default: ({ onFilterChange }: EmployeeFilterProps) => (
    <button onClick={() => onFilterChange({ isActive: true })}>Filtrar Ativos</button>
  ),
}))

// Mock do EmployeeDeleteModal
interface EmployeeDeleteModalProps {
  onDeleted: () => void
  onClose: () => void
  employee: {
    id: number
    name: string
    cpf: string
    email: string
    phone?: string
    address?: string
    position: string
    department?: { id: number; name: string }
    departmentId: number
    salary: number
    admissionDate: string
    isActive: boolean
  }
}

jest.mock('../../components/employee/EmployeeDeleteModal', () => ({
  __esModule: true,
  EmployeeDeleteModal: ({ onDeleted, onClose, employee }: EmployeeDeleteModalProps) => (
    <div>
      <span>{employee.name}</span>
      <button onClick={onDeleted}>Confirmar Delete</button>
      <button onClick={onClose}>Fechar Modal</button>
    </div>
  ),
}))

describe('EmployeePage', () => {
  beforeEach(() => {
    // Reset mockEmployees para estado inicial
    mockEmployees.splice(0, mockEmployees.length)
    mockEmployees.push(
      {
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
      },
      {
        id: 2,
        name: 'Maria Oliveira',
        cpf: '987.654.321-00',
        email: 'maria@example.com',
        phone: '(11) 98888-8888',
        address: 'Rua B, 456',
        position: 'Analista',
        department: { id: 2, name: 'RH' },
        departmentId: 2,
        salary: 4700,
        admissionDate: '2021-10-20',
        isActive: true,
      }
    )
  })

  it('renderiza a lista de funcionários', () => {
    render(<MemoryRouter><EmployeePage /></MemoryRouter>)

    expect(screen.getByText(/lista de funcionários/i)).toBeInTheDocument()
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('Maria Oliveira')).toBeInTheDocument()
    // Confere botões de ação
    expect(screen.getAllByText(/detalhes/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/editar/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/ativar|inativar/i).length).toBeGreaterThan(0)
  })

  it('filtra funcionários por search', async () => {
    render(<MemoryRouter><EmployeePage /></MemoryRouter>)

    const searchInput = screen.getByPlaceholderText(/buscar por nome, e-mail ou telefone/i)
    fireEvent.change(searchInput, { target: { value: 'Maria' } })

    await waitFor(() => {
      expect(screen.queryByText('João Silva')).not.toBeInTheDocument()
      expect(screen.getByText('Maria Oliveira')).toBeInTheDocument()
    })
  })

  it('filtra funcionários por EmployeeFilter', async () => {
    render(<MemoryRouter><EmployeePage /></MemoryRouter>)

    fireEvent.click(screen.getByText(/filtrar ativos/i))

    await waitFor(() => {
      expect(screen.queryByText('João Silva')).not.toBeInTheDocument()
      expect(screen.getByText('Maria Oliveira')).toBeInTheDocument()
    })
  })

  it('toggleActiveStatus altera status do funcionário', async () => {
    jest.spyOn(window, 'confirm').mockImplementation(() => true)

    render(<MemoryRouter><EmployeePage /></MemoryRouter>)

    const toggleButton = screen.getByText('Ativar')
    fireEvent.click(toggleButton)

    await waitFor(() => {
      expect(screen.getByText('Ativo')).toBeInTheDocument()
    })

    jest.restoreAllMocks()
  })

  it('abre e confirma exclusão de funcionário', async () => {
    render(<MemoryRouter><EmployeePage /></MemoryRouter>)

    fireEvent.click(screen.getAllByText('Deletar')[0])
    fireEvent.click(screen.getByText('Confirmar Delete'))

    await waitFor(() => {
      expect(screen.queryByText('João Silva')).not.toBeInTheDocument()
    })
  })

  it('abre e fecha modal sem deletar', async () => {
    render(<MemoryRouter><EmployeePage /></MemoryRouter>)

    fireEvent.click(screen.getAllByText('Deletar')[0])
    fireEvent.click(screen.getByText('Fechar Modal'))

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument()
    })
  })
})
