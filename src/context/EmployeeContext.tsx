// src/contexts/EmployeeContext.tsx

import { createContext } from 'react';
import { Employee } from '../types/employee';

export interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => Employee;
  updateEmployee: (id: number, data: Partial<Omit<Employee, 'id'>>) => boolean;
  deleteEmployee: (id: number) => boolean;
  getEmployeeById: (id: number) => Employee | null;
  refreshEmployees: () => void;
}

export const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);
