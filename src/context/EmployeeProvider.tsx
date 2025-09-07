// src/contexts/EmployeeProvider.tsx

import React, { useState, useCallback } from 'react';
import { EmployeeContext } from './EmployeeContext';
import { Employee } from '../types/employee';
import {
  createMockEmployee,
  deleteMockEmployee,
  getEmployeeById,
  mockEmployees,
  updateMockEmployee,
} from '../lib/mock/employees';

interface Props {
  children: React.ReactNode;
}

export const EmployeeProvider: React.FC<Props> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([...mockEmployees]);

  const refreshEmployees = useCallback(() => {
    setEmployees([...mockEmployees]);
  }, []);

  const addEmployee = (employee: Omit<Employee, 'id'>): Employee => {
    const newEmp = createMockEmployee(employee);
    setEmployees([...mockEmployees]);
    return newEmp;
  };

  const updateEmployee = (id: number, data: Partial<Omit<Employee, 'id'>>): boolean => {
    const success = updateMockEmployee(id, data);
    if (success) refreshEmployees();
    return success;
  };

  const removeEmployee = (id: number): boolean => {
    const success = deleteMockEmployee(id);
    if (success) refreshEmployees();
    return success;
  };

  const getById = (id: number): Employee | null => getEmployeeById(id);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee: removeEmployee,
        getEmployeeById: getById,
        refreshEmployees,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
