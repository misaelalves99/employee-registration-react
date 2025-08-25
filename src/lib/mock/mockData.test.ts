// src/lib/mock/mockData.test.ts

import { getMockEmployees, deleteMockEmployee } from './mockData';
import { Employee } from '../../types/employee';

describe('mockData', () => {
  const EMPLOYEE_KEY = 'mock_employees';
  const mockEmployee: Employee = {
    id: 1,
    name: 'Test Employee',
    cpf: '123.456.789-00',
    email: 'test@example.com',
    phone: '123456789',
    address: 'Rua Teste, 123',
    position: 'Desenvolvedor',
    departmentId: 1,
    salary: 5000,
    admissionDate: '2023-01-01',
    isActive: true,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('getMockEmployees deve retornar array vazio se localStorage estiver vazio', () => {
    expect(getMockEmployees()).toEqual([]);
  });

  it('getMockEmployees deve retornar dados salvos no localStorage', () => {
    localStorage.setItem(EMPLOYEE_KEY, JSON.stringify([mockEmployee]));
    const employees = getMockEmployees();
    expect(employees.length).toBe(1);
    expect(employees[0].name).toBe('Test Employee');
  });

  it('deleteMockEmployee deve remover funcionário pelo id', () => {
    localStorage.setItem(EMPLOYEE_KEY, JSON.stringify([mockEmployee]));
    deleteMockEmployee(1);
    const employees = getMockEmployees();
    expect(employees).toEqual([]);
  });

  it('deleteMockEmployee não deve falhar ao remover id inexistente', () => {
    localStorage.setItem(EMPLOYEE_KEY, JSON.stringify([mockEmployee]));
    deleteMockEmployee(999);
    const employees = getMockEmployees();
    expect(employees.length).toBe(1);
    expect(employees[0].id).toBe(1);
  });
});
