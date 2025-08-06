// src/lib/mock/mockData.ts

import { Employee } from '../../types/employee';

const EMPLOYEE_KEY = 'mock_employees';

export function getMockEmployees(): Employee[] {
  if (typeof window === 'undefined') return [];
  const json = localStorage.getItem(EMPLOYEE_KEY);
  return json ? JSON.parse(json) : [];
}

export function deleteMockEmployee(id: number): void {
  if (typeof window === 'undefined') return;
  const employees = getMockEmployees();
  const updated = employees.filter(emp => emp.id !== id);
  localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(updated));
}
