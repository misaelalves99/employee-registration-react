// src/components/employee/details/DetailsEmployeePage.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DetailsEmployeePage from './DetailsEmployeePage';
import { getEmployeeById } from '../../../lib/mock/employees';

// Mock da função
jest.mock('../../../lib/mock/employees', () => ({
  getEmployeeById: jest.fn(),
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

  let originalLocation: Location;

  beforeAll(() => {
    originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });
  });

  beforeEach(() => {
    jest.resetAllMocks();
    window.location.href = '';
  });

  afterAll(() => {
    // Restaurar location original
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
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

  it('chama window.history.back ao clicar em voltar', async () => {
    (getEmployeeById as jest.Mock).mockReturnValue(null);
    const backMock = jest.fn();
    Object.defineProperty(window, 'history', {
      value: { back: backMock },
      writable: true,
    });

    render(<DetailsEmployeePage id="999" />);
    fireEvent.click(await screen.findByText(/voltar para a lista/i));
    expect(backMock).toHaveBeenCalled();
  });

  it('altera window.location.href ao clicar em editar', async () => {
    (getEmployeeById as jest.Mock).mockReturnValue(employeeMock);

    render(<DetailsEmployeePage id="1" />);
    fireEvent.click(await screen.findByText(/editar/i));
    expect(window.location.href).toBe('/employee/1/edit');
  });
});
