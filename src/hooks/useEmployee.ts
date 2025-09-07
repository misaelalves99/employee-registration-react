// src/hooks/useEmployee.ts

import { useContext } from 'react';
import { EmployeeContext } from '../context/EmployeeContext';

export function useEmployee() {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
}
