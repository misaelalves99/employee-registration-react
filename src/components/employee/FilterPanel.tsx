// src/components/employee/FilterPanel.tsx

import { useState, ChangeEvent } from 'react';
import styles from './FilterPanel.module.css';

export interface FilterPanelProps {
  onFilterChange: (filters: { position?: string; departmentId?: number }) => void;
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [position, setPosition] = useState('');
  const [departmentId, setDepartmentId] = useState('');

  const handleFilter = () => {
    onFilterChange({
      position: position.trim() || undefined,
      departmentId: departmentId.trim() ? Number(departmentId) : undefined,
    });
  };

  const handlePositionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPosition(e.target.value);
  };

  const handleDepartmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Permite apenas números ou string vazia
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setDepartmentId(value);
    }
  };

  return (
    <aside className={styles.container}>
      <h2 className={styles.title}>Filtros</h2>

      <div className={styles.field}>
        <label htmlFor="position" className={styles.label}>Cargo</label>
        <input
          type="text"
          id="position"
          value={position}
          onChange={handlePositionChange}
          className={styles.input}
          placeholder="Cargo"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="departmentId" className={styles.label}>Departamento</label>
        <input
          type="number"
          id="departmentId"
          value={departmentId}
          onChange={handleDepartmentChange}
          className={styles.input}
          placeholder="ID do departamento"
        />
      </div>

      <button onClick={handleFilter} className={styles.button}>
        Aplicar Filtros
      </button>
    </aside>
  );
}
