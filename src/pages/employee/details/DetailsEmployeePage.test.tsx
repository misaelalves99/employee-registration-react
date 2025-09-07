// src/components/employee/details/DetailsEmployeePage.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DetailsEmployeePage from './DetailsEmployeePage';
import { getEmployeeById } from '../../../lib/mock/employees';

jest.mock('../../../lib/mock/employees', () => ({
  getEmployeeById: jest.fn(),
}));

// Mock do useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('DetailsEmployeePage', () => {
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
    isActive: true,
  };

  const inactiveEmployee = {
    ...employeeMock,
    id: 2,
    name: 'Maria Oliveira',
    isActive: false,
    salary: 4321.5,
    department: null,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('mostra loading inicialmente', () => {
    (getEmployeeById as jest.Mock).mockReturnValue(undefined);
    render(<DetailsEmployeePage id="1" />);
    expect(screen.getByText(/carregando funcionário/i)).toBeInTheDocument();
  });

  it('renderiza detalhes do funcionário quando encontrado', async () => {
    (getEmployeeById as jest.Mock).mockReturnValue(employeeMock);
    render(<DetailsEmployeePage id="1" />);

    await waitFor(() => {
      expect(screen.getByText(/detalhes do funcionário/i)).toBeInTheDocument();
      expect(screen.getByText(/joão silva/i)).toBeInTheDocument();
      expect(screen.getByText(/123.456.789-00/i)).toBeInTheDocument();
      expect(screen.getByText(/\(11\) 99999-9999/i)).toBeInTheDocument();
      expect(screen.getByText(/desenvolvedor/i)).toBeInTheDocument();
      expect(screen.getByText(/ti/i)).toBeInTheDocument();
      expect(screen.getByText(/R\$ 5.500,00/i)).toBeInTheDocument();
      expect(screen.getByText(/ativo/i)).toBeInTheDocument();
    });
  });

  it('mostra notFound se id não numérico', async () => {
    render(<DetailsEmployeePage id="abc" />);
    expect(await screen.findByText(/funcionário não encontrado/i)).toBeInTheDocument();
  });

  it('mostra notFound se funcionário não encontrado', async () => {
    (getEmployeeById as jest.Mock).mockReturnValue(null);
    render(<DetailsEmployeePage id="999" />);
    expect(await screen.findByText(/funcionário não encontrado/i)).toBeInTheDocument();
  });

  it('chama navigate ao clicar em voltar', async () => {
    (getEmployeeById as jest.Mock).mockReturnValue(null);
    render(<DetailsEmployeePage id="999" />);
    fireEvent.click(await screen.findByText(/voltar para a lista/i));
    expect(mockedNavigate).toHaveBeenCalledWith('/employee');
  });

  it('chama navigate ao clicar em editar', async () => {
    (getEmployeeById as jest.Mock).mockReturnValue(employeeMock);
    render(<DetailsEmployeePage id="1" />);
    fireEvent.click(await screen.findByText(/editar/i));
    expect(mockedNavigate).toHaveBeenCalledWith('/employee/edit/1');
  });

  it('exibe "Não informado" se funcionário não tiver departamento', async () => {
    (getEmployeeById as jest.Mock).mockReturnValue(inactiveEmployee);
    render(<DetailsEmployeePage id="2" />);
    expect(await screen.findByText(/não informado/i)).toBeInTheDocument();
  });

  it('exibe salário corretamente formatado com decimais', async () => {
    (getEmployeeById as jest.Mock).mockReturnValue(inactiveEmployee);
    render(<DetailsEmployeePage id="2" />);
    expect(await screen.findByText(/R\$ 4.321,50/i)).toBeInTheDocument();
  });

  it('exibe status inativo corretamente', async () => {
    (getEmployeeById as jest.Mock).mockReturnValue(inactiveEmployee);
    render(<DetailsEmployeePage id="2" />);
    expect(await screen.findByText(/inativo/i)).toBeInTheDocument();
  });
});
