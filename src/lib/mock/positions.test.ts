// src/lib/mock/positions.test.ts

import { mockPositions, getMockPositions } from './positions';
import { Position } from '../../types/position';

describe('mockPositions', () => {
  it('deve conter as posições esperadas', () => {
    expect(mockPositions).toEqual([
      'Desenvolvedor',
      'Analista',
      'Gerente',
      'Estagiário',
      'Outro',
    ]);
  });

  it('cada item deve ser uma string válida de Position', () => {
    mockPositions.forEach(pos => {
      expect(typeof pos).toBe('string');
      expect(pos.length).toBeGreaterThan(0);
    });
  });
});

describe('getMockPositions', () => {
  it('deve retornar uma promise com todas as posições', async () => {
    const positions: Position[] = await getMockPositions();
    expect(Array.isArray(positions)).toBe(true);
    expect(positions).toHaveLength(mockPositions.length);
    expect(positions).toEqual(mockPositions);
  });
});
