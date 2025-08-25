// src/components/employee/delete/DeleteEmployeePage.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteEmployeePage from './DeleteEmployeePage';
import { getAllMockEmployees, updateMockEmployee } from '../../../lib/mock/employees';
import { MemoryRouter } from 'react-router-dom';

// Mocks corretos
jest.mock('../../../lib/mock/employees', () => ({
  getAllMockEmployees: jest.fn(),
  updateMockEmployee: jest.fn(),
}));

describe('DeleteEmployeePage', () => {
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

  let locationHref: string;

  beforeAll(() => {
    // Mock seguro de window.location.href
    locationHref = '';
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: locationHref },
    });
  });

  beforeEach(() => {
    jest.resetAllMocks();
    (getAllMockEmployees as jest.Mock).mockReturnValue([employeeMock]);
    (updateMockEmployee as jest.Mock).mockReturnValue(true);
    locationHref = '';
    window.location.href = locationHref;
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
    (getAllMockEmployees as jest.Mock).mockReturnValue([]);
    render(
      <MemoryRouter>
        <DeleteEmployeePage params={{ id: '999' }} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/funcionário não encontrado/i)).toBeInTheDocument();
    });
  });

  it('chama updateMockEmployee e redireciona quando confirmado', async () => {
    window.confirm = jest.fn().mockReturnValue(true);

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
    expect(updateMockEmployee).toHaveBeenCalledWith(1, { isActive: false });
    expect(window.location.href).toBe('/employee');
  });

  it('não deleta quando cancelado', async () => {
    window.confirm = jest.fn().mockReturnValue(false);

    render(
      <MemoryRouter>
        <DeleteEmployeePage params={{ id: '1' }} />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/^deletar$/i));
    fireEvent.click(screen.getByText(/^deletar$/i));

    expect(updateMockEmployee).not.toHaveBeenCalled();
    expect(window.location.href).toBe('');
  });
});
