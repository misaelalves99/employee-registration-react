// src/components/employee/delete/DeleteEmployeePage.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteEmployeePage from './DeleteEmployeePage';
import { useEmployee } from '../../../hooks/useEmployee';
import { MemoryRouter } from 'react-router-dom';

// Mock do hook useEmployee
const mockDeleteEmployee = jest.fn();
const mockEmployees = [
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
    isActive: true,
  },
];

jest.mock('../../../hooks/useEmployee', () => ({
  useEmployee: jest.fn(),
}));

// Mock do navigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('DeleteEmployeePage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useEmployee as jest.Mock).mockReturnValue({
      employees: mockEmployees,
      deleteEmployee: mockDeleteEmployee,
    });
    window.confirm = jest.fn();
  });

  it('mostra loading inicialmente', () => {
    render(
      <MemoryRouter>
        <DeleteEmployeePage params={{ id: '1' }} />
      </MemoryRouter>
    );
    expect(screen.getByText(/carregando funcionário/i)).toBeInTheDocument();
  });

  it('exibe detalhes do funcionário quando encontrado', async () => {
    render(
      <MemoryRouter>
        <DeleteEmployeePage params={{ id: '1' }} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/deletar funcionário/i)).toBeInTheDocument();
      expect(screen.getByText(/joão silva/i)).toBeInTheDocument();
      expect(screen.getByText(/123.456.789-00/i)).toBeInTheDocument();
    });
  });

  it('exibe erro quando funcionário não é encontrado', async () => {
    (useEmployee as jest.Mock).mockReturnValue({
      employees: [],
      deleteEmployee: mockDeleteEmployee,
    });

    render(
      <MemoryRouter>
        <DeleteEmployeePage params={{ id: '999' }} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/funcionário não encontrado/i)).toBeInTheDocument();
    });
  });

  it('chama deleteEmployee e redireciona quando confirmado', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);

    render(
      <MemoryRouter>
        <DeleteEmployeePage params={{ id: '1' }} />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/^deletar$/i));
    fireEvent.click(screen.getByText(/^deletar$/i));

    expect(window.confirm).toHaveBeenCalledWith(
      'Tem certeza que deseja deletar o funcionário João Silva?'
    );
    expect(mockDeleteEmployee).toHaveBeenCalledWith(1);
    expect(mockedNavigate).toHaveBeenCalledWith('/employee');
  });

  it('não deleta quando cancelado', async () => {
    (window.confirm as jest.Mock).mockReturnValue(false);

    render(
      <MemoryRouter>
        <DeleteEmployeePage params={{ id: '1' }} />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/^deletar$/i));
    fireEvent.click(screen.getByText(/^deletar$/i));

    expect(mockDeleteEmployee).not.toHaveBeenCalled();
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  it('botão Cancelar chama navigate corretamente', async () => {
    render(
      <MemoryRouter>
        <DeleteEmployeePage params={{ id: '1' }} />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/^cancelar$/i));
    fireEvent.click(screen.getByText(/^cancelar$/i));

    expect(mockedNavigate).toHaveBeenCalledWith('/employee');
  });

  it('exibe erro se deleteEmployee lança exceção', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    mockDeleteEmployee.mockImplementation(() => { throw new Error('Falha'); });

    render(
      <MemoryRouter>
        <DeleteEmployeePage params={{ id: '1' }} />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/^deletar$/i));
    fireEvent.click(screen.getByText(/^deletar$/i));

    await waitFor(() => {
      expect(screen.getByText(/erro ao deletar funcionário/i)).toBeInTheDocument();
    });
  });
});
