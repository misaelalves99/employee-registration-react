// app/components/employee/EmployeeFilter.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeFilter from './EmployeeFilter';
import { POSITIONS } from '../../types/position';

describe('EmployeeFilter', () => {
  let onFilterChangeMock: jest.Mock;

  beforeEach(() => {
    onFilterChangeMock = jest.fn();
    render(<EmployeeFilter onFilterChange={onFilterChangeMock} />);
  });

  it('renderiza todos os campos e botão', () => {
    expect(screen.getByLabelText(/Buscar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Departamento \(ID\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cargo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Admissão de/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Até/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Filtrar/i })).toBeInTheDocument();
  });

  it('atualiza valores ao digitar nos inputs e selects', () => {
    fireEvent.change(screen.getByLabelText(/Buscar/i), { target: { value: 'João' } });
    fireEvent.change(screen.getByLabelText(/Departamento \(ID\)/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/Cargo/i), { target: { value: POSITIONS[0] } });
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'true' } });
    fireEvent.change(screen.getByLabelText(/Admissão de/i), { target: { value: '2022-01-01' } });
    fireEvent.change(screen.getByLabelText(/Até/i), { target: { value: '2022-12-31' } });

    expect((screen.getByLabelText(/Buscar/i) as HTMLInputElement).value).toBe('João');
    expect((screen.getByLabelText(/Departamento \(ID\)/i) as HTMLInputElement).value).toBe('2');
    expect((screen.getByLabelText(/Cargo/i) as HTMLSelectElement).value).toBe(POSITIONS[0]);
    expect((screen.getByLabelText(/Status/i) as HTMLSelectElement).value).toBe('true');
    expect((screen.getByLabelText(/Admissão de/i) as HTMLInputElement).value).toBe('2022-01-01');
    expect((screen.getByLabelText(/Até/i) as HTMLInputElement).value).toBe('2022-12-31');
  });

  it('chama onFilterChange com valores corretos ao submeter', () => {
    fireEvent.change(screen.getByLabelText(/Buscar/i), { target: { value: 'Maria' } });
    fireEvent.change(screen.getByLabelText(/Departamento \(ID\)/i), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText(/Cargo/i), { target: { value: POSITIONS[1] } });
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'false' } });
    fireEvent.change(screen.getByLabelText(/Admissão de/i), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText(/Até/i), { target: { value: '2023-12-31' } });

    fireEvent.click(screen.getByRole('button', { name: /Filtrar/i }));

    expect(onFilterChangeMock).toHaveBeenCalledTimes(1);
    expect(onFilterChangeMock).toHaveBeenCalledWith({
      search: 'Maria',
      departmentId: 3,
      position: POSITIONS[1],
      isActive: false,
      admissionDateFrom: '2023-01-01',
      admissionDateTo: '2023-12-31',
    });
  });

  it('trata valores vazios corretamente', () => {
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

  it('converte status Ativo/Inativo corretamente', () => {
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'true' } });
    fireEvent.click(screen.getByRole('button', { name: /Filtrar/i }));
    expect(onFilterChangeMock).toHaveBeenCalledWith(expect.objectContaining({ isActive: true }));

    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'false' } });
    fireEvent.click(screen.getByRole('button', { name: /Filtrar/i }));
    expect(onFilterChangeMock).toHaveBeenCalledWith(expect.objectContaining({ isActive: false }));

    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Filtrar/i }));
    expect(onFilterChangeMock).toHaveBeenCalledWith(expect.objectContaining({ isActive: undefined }));
  });
});
