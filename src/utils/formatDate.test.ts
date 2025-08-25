// utils/formatDate.test.ts

import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formata uma string de data corretamente', () => {
    const result = formatDate('2025-08-21');
    expect(result).toBe('21/08/2025');
  });

  it('formata um objeto Date corretamente', () => {
    const date = new Date(2025, 7, 21); // meses começam em 0
    const result = formatDate(date);
    expect(result).toBe('21/08/2025');
  });

  it('lida com datas inválidas retornando "Invalid Date"', () => {
    const result = formatDate('invalid-date');
    expect(result).toBe('Invalid Date');
  });
});
