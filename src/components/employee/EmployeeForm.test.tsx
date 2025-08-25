// src/components/employee/EmployeeFilter.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeFilter from './EmployeeFilter';
import { POSITIONS } from '../../types/position';

describe('EmployeeFilter', () => {
  const onFilterChangeMock = jest.fn();

  beforeEach(() => {
    onFilterChangeMock.mockClear();
  });

  it('renderiza todos os campos do formulário', () => {
    render(<EmployeeFilter onFilterChange={onFilterChangeMock} />);

    expect(screen.getByLabelText('Buscar')).toBeInTheDocument();
    expect(screen.getByLabelText('Departamento (ID)')).toBeInTheDocument();
    expect(screen.getByLabelText('Cargo')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Admissão de')).toBeInTheDocument();
    expect(screen.getByLabelText('Até')).toBeInTheDocument();
    expect(screen.getByText('Filtrar')).toBeInTheDocument();
  });

  it('submete os filtros corretamente', () => {
    render(<EmployeeFilter onFilterChange={onFilterChangeMock} />);

    fireEvent.change(screen.getByLabelText('Buscar'), { target: { value: 'João' } });
    fireEvent.change(screen.getByLabelText('Departamento (ID)'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Cargo'), { target: { value: POSITIONS[0] } });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'true' } });
    fireEvent.change(screen.getByLabelText('Admissão de'), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText('Até'), { target: { value: '2023-12-31' } });

    fireEvent.click(screen.getByText('Filtrar'));

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
    fireEvent.click(screen.getByText('Filtrar'));

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

    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'false' } });
    fireEvent.change(screen.getByLabelText('Departamento (ID)'), { target: { value: '5' } });
    fireEvent.click(screen.getByText('Filtrar'));

    expect(onFilterChangeMock).toHaveBeenCalledWith(expect.objectContaining({
      isActive: false,
      departmentId: 5,
    }));
  });
});
