// src/components/employee/EmployeeFilter.tsx

import { useState, useEffect } from 'react';
import { POSITIONS, Position } from '../../types/position';
import styles from './EmployeeFilter.module.css';
import { EmployeeFilters } from '../../pages/employee/EmployeePage';

interface EmployeeFilterProps {
  onFilterChange?: (filters: EmployeeFilters) => void;
}

export function EmployeeFilter({ onFilterChange }: EmployeeFilterProps) {
  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [position, setPosition] = useState<Position | ''>('');
  const [isActive, setIsActive] = useState<boolean | ''>('');

  // Sempre que qualquer filtro mudar, avisamos o parent
  useEffect(() => {
    onFilterChange?.({
      search: search || undefined,
      departmentId: departmentId ? Number(departmentId) : undefined,
      position: position || undefined,
      isActive: isActive === '' ? undefined : isActive,
    });
  }, [search, departmentId, position, isActive, onFilterChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div>
        <label htmlFor="search" className={styles.label}>Buscar</label>
        <input
          type="text"
          id="search"
          placeholder="Nome, CPF, email ou telefone..."
          className={styles.input}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="departmentId" className={styles.label}>Departamento (ID)</label>
        <input
          type="number"
          id="departmentId"
          placeholder="Ex: 1, 2, 3..."
          className={styles.input}
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="position" className={styles.label}>Cargo</label>
        <select
          id="position"
          className={styles.select}
          value={position}
          onChange={(e) => setPosition(e.target.value as Position | '')}
        >
          <option value="">Selecione</option>
          {POSITIONS.map((pos) => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="isActive" className={styles.label}>Status</label>
        <select
          id="isActive"
          className={styles.select}
          value={isActive === '' ? '' : isActive ? 'true' : 'false'}
          onChange={(e) => {
            const value = e.target.value;
            setIsActive(value === '' ? '' : value === 'true');
          }}
        >
          <option value="">Todos</option>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.button}>Filtrar</button>
      </div>
    </form>
  );
}
