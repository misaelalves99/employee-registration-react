// src/components/employee/create/CreateEmployeePage.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CreateEmployeePage from './CreateEmployeePage'
import { getMockDepartments } from '../../../lib/mock/departments'
import { getMockPositions } from '../../../lib/mock/positions'
import { createMockEmployee } from '../../../lib/mock/employees'
import { MemoryRouter } from 'react-router-dom'

// Mock dos módulos
jest.mock('../../../lib/mock/departments', () => ({
  getMockDepartments: jest.fn(),
}))

jest.mock('../../../lib/mock/positions', () => ({
  getMockPositions: jest.fn(),
}))

jest.mock('../../../lib/mock/employees', () => ({
  createMockEmployee: jest.fn(),
}))

// Mock do navigate do react-router-dom
const mockedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}))

describe('CreateEmployeePage', () => {
  beforeEach(() => {
    const mockGetDepartments = getMockDepartments as jest.Mock;
    const mockGetPositions = getMockPositions as jest.Mock;
    const mockCreateEmployee = createMockEmployee as jest.Mock;

    mockGetDepartments.mockResolvedValue([
      { id: 1, name: 'TI' },
      { id: 2, name: 'RH' },
    ]);
    mockGetPositions.mockResolvedValue(['Desenvolvedor', 'Analista']);
    mockCreateEmployee.mockResolvedValue(undefined);

    mockedNavigate.mockReset();
    window.alert = jest.fn();
  });

  it('renderiza o loading inicialmente', () => {
    render(
      <MemoryRouter>
        <CreateEmployeePage />
      </MemoryRouter>
    )
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('renderiza o formulário após carregar dados', async () => {
    render(
      <MemoryRouter>
        <CreateEmployeePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/departamento/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/cargo/i)).toBeInTheDocument()
    })
  })

  it('mostra alerta se campos obrigatórios não estiverem preenchidos', async () => {
    render(
      <MemoryRouter>
        <CreateEmployeePage />
      </MemoryRouter>
    )

    await waitFor(() => screen.getByText(/criar funcionário/i))

    fireEvent.click(screen.getByText(/criar funcionário/i))
    expect(window.alert).toHaveBeenCalledWith(
      'Por favor, preencha todos os campos obrigatórios.'
    )
  })

  it('chama createMockEmployee e navigate ao enviar formulário válido', async () => {
    render(
      <MemoryRouter>
        <CreateEmployeePage />
      </MemoryRouter>
    )

    await waitFor(() => screen.getByLabelText(/nome/i))

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'João' } })
    fireEvent.change(screen.getByLabelText(/cpf/i), { target: { value: '123.456.789-00' } })
    fireEvent.change(screen.getByLabelText(/salário/i), { target: { value: '5000' } })
    fireEvent.change(screen.getByLabelText(/departamento/i), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText(/cargo/i), { target: { value: 'Desenvolvedor' } })

    fireEvent.click(screen.getByText(/criar funcionário/i))

    await waitFor(() => {
      expect(createMockEmployee).toHaveBeenCalled()
      expect(mockedNavigate).toHaveBeenCalledWith('/employee')
    })
  })

  it('envia isActive corretamente ao criar funcionário', async () => {
    render(
      <MemoryRouter>
        <CreateEmployeePage />
      </MemoryRouter>
    )

    await waitFor(() => screen.getByLabelText(/nome/i))

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText(/cpf/i), { target: { value: '111.222.333-44' } })
    fireEvent.change(screen.getByLabelText(/salário/i), { target: { value: '4500' } })
    fireEvent.change(screen.getByLabelText(/departamento/i), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/cargo/i), { target: { value: 'Analista' } })

    // desmarca o checkbox Ativo para enviar false
    fireEvent.click(screen.getByLabelText(/ativo/i))

    fireEvent.click(screen.getByText(/criar funcionário/i))

    await waitFor(() => {
      expect(createMockEmployee).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: false })
      )
      expect(mockedNavigate).toHaveBeenCalledWith('/employee')
    })
  })

  it('botão Voltar chama navigate corretamente', async () => {
    render(
      <MemoryRouter>
        <CreateEmployeePage />
      </MemoryRouter>
    )

    await waitFor(() => screen.getByText(/voltar/i))

    fireEvent.click(screen.getByText(/voltar/i))
    expect(mockedNavigate).toHaveBeenCalledWith('/employee')
  })
})
