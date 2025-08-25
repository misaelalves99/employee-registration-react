// lib/formatters.test.ts

import { formatDate, formatCurrency, formatEnum } from './formatters';

describe('formatters', () => {
  describe('formatDate', () => {
    it('deve formatar string de data corretamente', () => {
      expect(formatDate('2025-08-21')).toBe('21/08/2025');
    });

    it('deve formatar objeto Date corretamente', () => {
      expect(formatDate(new Date('2025-08-21'))).toBe('21/08/2025');
    });
  });

  describe('formatCurrency', () => {
    it('deve formatar número como moeda BRL', () => {
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
      expect(formatCurrency(0)).toBe('R$ 0,00');
    });
  });

  describe('formatEnum', () => {
    it('deve formatar enums de camelCase ou PascalCase para palavras legíveis', () => {
      expect(formatEnum('Developer')).toBe('Developer');
      expect(formatEnum('SeniorDeveloper')).toBe('Senior Developer');
      expect(formatEnum('juniorDev')).toBe('Junior Dev');
    });

    it('deve capitalizar a primeira letra', () => {
      expect(formatEnum('manager')).toBe('Manager');
    });
  });
});
