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
});

describe('getMockDepartments', () => {
  it('deve retornar uma promise com os departamentos', async () => {
    const departments = await getMockDepartments();
    expect(departments).toEqual(mockDepartments);
    expect(Array.isArray(departments)).toBe(true);
    expect(departments.length).toBe(3);
  });
});
