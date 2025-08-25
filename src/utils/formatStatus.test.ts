// utils/formatStatus.test.ts

import { formatStatus } from './formatStatus';

describe('formatStatus', () => {
  it('deve retornar "Ativo" quando isActive for true', () => {
    expect(formatStatus(true)).toBe('Ativo');
  });

  it('deve retornar "Inativo" quando isActive for false', () => {
    expect(formatStatus(false)).toBe('Inativo');
  });
});
