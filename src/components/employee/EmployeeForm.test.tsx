// src/components/employee/EmployeeFilter.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeFilter from './EmployeeFilter';
import { POSITIONS } from '../../types/position';

describe('EmployeeFilter', () => {
  let onFilterChangeMock: jest.Mock;

  beforeEach(() => {
    onFilterChangeMock = jest.fn();
  });

  it('renderiza todos os campos do formulário', () => {
    render(<EmployeeFilter onFilterChange={onFilterChangeMock} />);

    expect(screen.getByLabelText(/Buscar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Departamento \(ID\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cargo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Admissão de/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Até/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Filtrar/i })).toBeInTheDocument();
  });

  it('submete os filtros preenchidos corretamente', () => {
    render(<EmployeeFilter onFilterChange={onFilterChangeMock} />);

    fireEvent.change(screen.getByLabelText(/Buscar/i), { target: { value: 'João' } });
    fireEvent.change(screen.getByLabelText(/Departamento \(ID\)/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/Cargo/i), { target: { value: POSITIONS[0] } });
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'true' } });
    fireEvent.change(screen.getByLabelText(/Admissão de/i), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText(/Até/i), { target: { value: '2023-12-31' } });

    fireEvent.click(screen.getByRole('button', { name: /Filtrar/i }));

    expect(onFilterChangeMock).toHaveBeenCalledTimes(1);
    expect(onFilterChangeMock).toHaveBeenCalledWith({
      search: 'João',
      departmentId: 2,
      position: POSITIONS[0],
      isActive: true,
      admissionDateFrom: '2023-01-01',
      admissionDateTo: '2023-12-31',
    });
  });

  it('trata valores vazios corretamente', () => {
    render(<EmployeeFilter onFilterChange={onFilterChangeMock} />);
    fireEvent.click(screen.getByRole('button', { name: /Filtrar/i }));

    expect(onFilterChangeMock).toHaveBeenCalledWith({
      search: undefined,
      departmentId: undefined,
      position: undefined,
      isActive: undefined,
      admissionDateFrom: undefined,
      admissionDateTo: undefined,
    });
  });

  it('converte corretamente isActive e departmentId', () => {
    render(<EmployeeFilter onFilterChange={onFilterChangeMock} />);

    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'false' } });
    fireEvent.change(screen.getByLabelText(/Departamento \(ID\)/i), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /Filtrar/i }));

    expect(onFilterChangeMock).toHaveBeenCalledWith(expect.objectContaining({
      isActive: false,
      departmentId: 5,
    }));
  });

  it('converte corretamente status Ativo para true e Inativo para false', () => {
    render(<EmployeeFilter onFilterChange={onFilterChangeMock} />);

    // Ativo
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'true' } });
    fireEvent.click(screen.getByRole('button', { name: /Filtrar/i }));
    expect(onFilterChangeMock).toHaveBeenCalledWith(expect.objectContaining({ isActive: true }));

    // Inativo
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'false' } });
    fireEvent.click(screen.getByRole('button', { name: /Filtrar/i }));
    expect(onFilterChangeMock).toHaveBeenCalledWith(expect.objectContaining({ isActive: false }));

    // Todos
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Filtrar/i }));
    expect(onFilterChangeMock).toHaveBeenCalledWith(expect.objectContaining({ isActive: undefined }));
  });

  it('aceita posição vazia corretamente', () => {
    render(<EmployeeFilter onFilterChange={onFilterChangeMock} />);

    fireEvent.change(screen.getByLabelText(/Cargo/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Filtrar/i }));

    expect(onFilterChangeMock).toHaveBeenCalledWith(expect.objectContaining({ position: undefined }));
  });
});
