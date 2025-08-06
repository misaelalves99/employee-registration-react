// src/components/employee/toggle-status-button/ToggleStatusButton.tsx

import { useState } from 'react';
import styles from './ToggleStatusButton.module.css';

interface ToggleStatusButtonProps {
  employeeId: number;
  initialStatus: boolean;
  onStatusChange: (newStatus: boolean) => void;
}

export function ToggleStatusButton({
  employeeId,
  initialStatus,
  onStatusChange,
}: ToggleStatusButtonProps) {
  const [isActive, setIsActive] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/employees/${employeeId}/toggle-status`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Erro ao alterar status');

      const data = await res.json();
      setIsActive(data.isActive);
      onStatusChange(data.isActive);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleStatus}
      disabled={loading}
      className={`${styles.button} ${isActive ? styles.active : styles.inactive}`}
      title={isActive ? 'Inativar' : 'Ativar'}
    >
      {loading ? 'Carregando...' : isActive ? 'Ativo' : 'Inativo'}
    </button>
  );
}
