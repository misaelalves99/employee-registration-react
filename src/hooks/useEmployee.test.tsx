// src/hooks/useEmployee.test.tsx

import { renderHook } from '@testing-library/react';
import { useEmployee } from './useEmployee';
import { EmployeeProvider } from '../context/EmployeeProvider';
import React from 'react';

describe('useEmployee', () => {
  it('deve retornar o contexto quando usado dentro do EmployeeProvider', () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <EmployeeProvider>{children}</EmployeeProvider>
    );

    const { result } = renderHook(() => useEmployee(), { wrapper });

    expect(result.current.employees).toBeDefined();
    expect(typeof result.current.addEmployee).toBe('function');
    expect(typeof result.current.updateEmployee).toBe('function');
    expect(typeof result.current.deleteEmployee).toBe('function');
    expect(typeof result.current.getEmployeeById).toBe('function');
    expect(typeof result.current.refreshEmployees).toBe('function');
  });

  it('deve lançar erro quando usado fora do EmployeeProvider', () => {
    // Captura o erro lançado pelo hook
    expect(() => renderHook(() => useEmployee())).toThrowError(
      'useEmployee must be used within an EmployeeProvider'
    );
  });
});
