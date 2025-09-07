// src/lib/mock/departments.test.ts

import { mockDepartments, getMockDepartments } from './departments';

describe('mockDepartments', () => {
  it('deve conter os departamentos esperados', () => {
    expect(mockDepartments).toEqual([
      { id: 1, name: 'TI' },
      { id: 2, name: 'RH' },
      { id: 3, name: 'Marketing' },
    ]);
  });

  it('cada departamento deve ter id e name corretos', () => {
    mockDepartments.forEach((dept, index) => {
      expect(dept).toHaveProperty('id', index + 1);
      expect(typeof dept.name).toBe('string');
    });
  });
});

describe('getMockDepartments', () => {
  it('deve retornar uma promise com os departamentos', async () => {
    const departments = await getMockDepartments();
    expect(departments).toEqual(mockDepartments);
    expect(Array.isArray(departments)).toBe(true);
    expect(departments.length).toBe(3);
  });

  it('deve retornar uma nova instância do array a cada chamada', async () => {
    const dep1 = await getMockDepartments();
    const dep2 = await getMockDepartments();
    expect(dep1).not.toBe(dep2); // agora passa
    // Também podemos checar que o conteúdo é igual
    expect(dep1).toEqual(dep2);
  });
});
