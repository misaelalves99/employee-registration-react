// src/types/position.ts

export const POSITIONS = [
  'Desenvolvedor',
  'Analista',
  'Gerente',
  'Estagiário',
  'Outro',
  'Designer',
  'Coordenador',
] as const;

export type Position = (typeof POSITIONS)[number];
export type PositionFormValue = Position | ''; // permite string vazia para select
