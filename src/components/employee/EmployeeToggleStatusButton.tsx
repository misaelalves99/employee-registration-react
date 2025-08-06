// src/components/employee/EmployeeToggleStatusButton.tsx

import { useState } from 'react';
import styles from './EmployeeToggleStatusButton.module.css';

export interface EmployeeToggleStatusButtonProps {
  employeeId: number;
  isActive: boolean;
  onToggle: (newStatus: boolean) => void;
}

export function EmployeeToggleStatusButton({
  employeeId,
  isActive,
  onToggle,
}: EmployeeToggleStatusButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const endpoint = isActive
        ? `/api/employee/inactivate/${employeeId}`
        : `/api/employee/reactivate/${employeeId}`;
      const res = await fetch(endpoint, { method: 'POST' });
      if (res.ok) {
        onToggle(!isActive);
      } else {
        alert('Erro ao atualizar status.');
      }
    } catch {
      alert('Erro ao atualizar status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`${styles.button} ${isActive ? styles.inactive : styles.active}`}
      title={isActive ? 'Inativar Funcionário' : 'Ativar Funcionário'}
    >
      {isActive ? 'Inativo' : 'Ativo'}
    </button>
  );
}
