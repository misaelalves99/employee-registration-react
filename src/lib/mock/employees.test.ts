// src/lib/mock/employees.test.ts

import {
  mockEmployees,
  getEmployeeById,
  getAllMockEmployees,
  updateMockEmployee,
  createMockEmployee,
} from './employees';
import { Position } from '../../types/position';

describe('mockEmployees', () => {
  it('deve conter os funcionários iniciais', () => {
    expect(mockEmployees.length).toBeGreaterThanOrEqual(2);
    expect(mockEmployees[0].name).toBe('João Silva');
    expect(mockEmployees[1].department?.name).toBe('RH');
  });
});

describe('getEmployeeById', () => {
  it('retorna o funcionário correto', () => {
    const emp = getEmployeeById(1);
    expect(emp).not.toBeNull();
    expect(emp?.name).toBe('João Silva');
  });

  it('retorna null se não existir', () => {
    expect(getEmployeeById(999)).toBeNull();
  });
});

describe('getAllMockEmployees', () => {
  it('retorna funcionários com campos extras', () => {
    const all = getAllMockEmployees();
    expect(all[0]).toHaveProperty('departmentName', 'TI');
    expect(all[1]).toHaveProperty('hiredDate', '2021-10-20');
    expect(all[1]).toHaveProperty('active', true);
  });
});

describe('updateMockEmployee', () => {
  it('atualiza funcionário existente', () => {
    const result = updateMockEmployee(1, { name: 'João Atualizado', departmentId: 2 });
    expect(result).toBe(true);
    const updated = getEmployeeById(1);
    expect(updated?.name).toBe('João Atualizado');
    expect(updated?.department?.name).toBe('RH');
  });

  it('mantém departamento original se departmentId não for fornecido', () => {
    const originalDept = getEmployeeById(2)?.department?.name;
    const result = updateMockEmployee(2, { name: 'Maria Atualizada' });
    expect(result).toBe(true);
    const updated = getEmployeeById(2);
    expect(updated?.name).toBe('Maria Atualizada');
    expect(updated?.department?.name).toBe(originalDept);
  });

  it('retorna false ao tentar atualizar um funcionário inexistente', () => {
    expect(updateMockEmployee(999, { name: 'Teste' })).toBe(false);
  });
});

describe('createMockEmployee', () => {
  it('adiciona um novo funcionário corretamente', () => {
    const newEmployee = {
      id: 3,
      name: 'Carlos Santos',
      cpf: '111.222.333-44',
      email: 'carlos@example.com',
      phone: '(11) 97777-7777',
      address: 'Rua C, 789',
      position: 'Designer' as Position,
      departmentId: 3,
      salary: 4000,
      admissionDate: '2023-05-10',
      isActive: true,
    };
    createMockEmployee(newEmployee);
    const added = getEmployeeById(3);
    expect(added).not.toBeNull();
    expect(added?.name).toBe('Carlos Santos');
    expect(added?.department?.name).toBe('Marketing');
  });

  it('atribui department null se departmentId inválido', () => {
    const newEmployee = {
      id: 4,
      name: 'Teste Sem Departamento',
      cpf: '000.111.222-33',
      email: 'teste@example.com',
      phone: '(11) 96666-6666',
      address: 'Rua D, 101',
      position: 'Analista' as Position,
      departmentId: 999, // inválido
      salary: 3000,
      admissionDate: '2023-08-01',
      isActive: true,
    };
    createMockEmployee(newEmployee);
    const added = getEmployeeById(4);
    expect(added).not.toBeNull();
    expect(added?.department).toBeNull();
  });
});
