// src/lib/mock/employees.ts

import { Employee } from '../../types/employee'
import { Position } from '../../types/position'
import { mockDepartments } from './departments'

export const mockEmployees: Employee[] = [
  {
    id: 1,
    name: 'João Silva',
    cpf: '123.456.789-00',
    email: 'joao@example.com',
    phone: '(11) 99999-9999',
    address: 'Rua A, 123',
    position: 'Desenvolvedor' as Position,
    department: { id: 1, name: 'TI' },
    departmentId: 1,
    salary: 5500,
    admissionDate: '2022-01-15',
    isActive: false,
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    cpf: '987.654.321-00',
    email: 'maria@example.com',
    phone: '(11) 98888-8888',
    address: 'Rua B, 456',
    position: 'Analista' as Position,
    department: { id: 2, name: 'RH' },
    departmentId: 2,
    salary: 4700,
    admissionDate: '2021-10-20',
    isActive: true,
  },
]

/**
 * Retorna funcionário pelo ID
 */
export function getEmployeeById(id: number): Employee | null {
  return mockEmployees.find((e) => e.id === id) ?? null
}

/**
 * Retorna todos funcionários com campos extras
 */
export function getAllMockEmployees() {
  return mockEmployees.map((e) => ({
    ...e,
    departmentName: e.department?.name ?? null,
    hiredDate: e.admissionDate,
    active: e.isActive,
  }))
}

/**
 * Atualiza funcionário
 */
export function updateMockEmployee(
  id: number,
  data: Partial<Omit<Employee, 'id'>>
): boolean {
  const index = mockEmployees.findIndex((e) => e.id === id)
  if (index === -1) return false

  const dept = data.departmentId
    ? mockDepartments.find((d) => d.id === data.departmentId)
    : mockEmployees[index].department

  mockEmployees[index] = {
    ...mockEmployees[index],
    ...data,
    department: dept ?? mockEmployees[index].department,
  }

  return true
}

/**
 * Cria novo funcionário com ID incremental
 */
export function createMockEmployee(employee: Omit<Employee, 'id'>): Employee {
  const nextId =
    mockEmployees.length > 0
      ? Math.max(...mockEmployees.map((e) => e.id)) + 1
      : 1

  const dept =
    mockDepartments.find((d) => d.id === employee.departmentId) ?? null

  const newEmployee: Employee = {
    ...employee,
    id: nextId,
    department: dept,
  }

  mockEmployees.push(newEmployee)
  return newEmployee
}

/**
 * Remove funcionário pelo ID
 */
export function deleteMockEmployee(id: number): boolean {
  const index = mockEmployees.findIndex((e) => e.id === id)
  if (index === -1) return false

  mockEmployees.splice(index, 1)
  return true
}
