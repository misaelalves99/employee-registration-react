// src/components/employee/FilterPanel.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel, FilterPanelProps } from './FilterPanel';

describe('FilterPanel', () => {
  let onFilterChangeMock: jest.MockedFunction<FilterPanelProps['onFilterChange']>;

  beforeEach(() => {
    onFilterChangeMock = jest.fn();
  });

  it('renderiza todos os campos e botão', () => {
    render(<FilterPanel onFilterChange={onFilterChangeMock} />);

    expect(screen.getByLabelText('Cargo')).toBeInTheDocument();
    expect(screen.getByLabelText('Departamento')).toBeInTheDocument();
    expect(screen.getByText('Aplicar Filtros')).toBeInTheDocument();
  });

  it('atualiza os campos de input ao digitar', () => {
    render(<FilterPanel onFilterChange={onFilterChangeMock} />);

    const positionInput = screen.getByLabelText('Cargo') as HTMLInputElement;
    const departmentInput = screen.getByLabelText('Departamento') as HTMLInputElement;

    fireEvent.change(positionInput, { target: { value: 'Desenvolvedor' } });
    fireEvent.change(departmentInput, { target: { value: '2' } });

    expect(positionInput.value).toBe('Desenvolvedor');
    expect(departmentInput.value).toBe('2');
  });

  it('chama onFilterChange com valores corretos ao clicar no botão', () => {
    render(<FilterPanel onFilterChange={onFilterChangeMock} />);

    const positionInput = screen.getByLabelText('Cargo') as HTMLInputElement;
    const departmentInput = screen.getByLabelText('Departamento') as HTMLInputElement;
    const button = screen.getByText('Aplicar Filtros');

    fireEvent.change(positionInput, { target: { value: 'Analista' } });
    fireEvent.change(departmentInput, { target: { value: '5' } });
    fireEvent.click(button);

    expect(onFilterChangeMock).toHaveBeenCalledTimes(1);
    expect(onFilterChangeMock).toHaveBeenCalledWith({
      position: 'Analista',
      departmentId: 5,
    });
  });

  it('trata campos vazios corretamente', () => {
    render(<FilterPanel onFilterChange={onFilterChangeMock} />);
    const button = screen.getByText('Aplicar Filtros');

    fireEvent.click(button);

    expect(onFilterChangeMock).toHaveBeenCalledTimes(1);
    expect(onFilterChangeMock).toHaveBeenCalledWith({
      position: undefined,
      departmentId: undefined,
    });
  });

  it('converte corretamente departmentId se digitado zero', () => {
    render(<FilterPanel onFilterChange={onFilterChangeMock} />);
    const departmentInput = screen.getByLabelText('Departamento') as HTMLInputElement;
    const button = screen.getByText('Aplicar Filtros');

    fireEvent.change(departmentInput, { target: { value: '0' } });
    fireEvent.click(button);

    expect(onFilterChangeMock).toHaveBeenCalledWith({
      position: undefined,
      departmentId: 0,
    });
  });
});
