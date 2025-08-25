// utils/formatEnum.test.ts

import { formatGender, formatPosition } from './formatEnum';

describe('formatGender', () => {
  it('deve formatar "Male" para "Masculino"', () => {
    expect(formatGender('Male')).toBe('Masculino');
  });

  it('deve formatar "Female" para "Feminino"', () => {
    expect(formatGender('Female')).toBe('Feminino');
  });

  it('deve formatar "Other" para "Outro"', () => {
    expect(formatGender('Other')).toBe('Outro');
  });

  it('deve retornar "Desconhecido" para valores desconhecidos', () => {
    expect(formatGender('Unknown')).toBe('Desconhecido');
  });
});

describe('formatPosition', () => {
  it('deve formatar "Manager" para "Gerente"', () => {
    expect(formatPosition('Manager')).toBe('Gerente');
  });

  it('deve formatar "Developer" para "Desenvolvedor"', () => {
    expect(formatPosition('Developer')).toBe('Desenvolvedor');
  });

  it('deve retornar "Outro" para valores desconhecidos', () => {
    expect(formatPosition('Analyst')).toBe('Outro');
  });
});
