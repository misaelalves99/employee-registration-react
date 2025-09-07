// src/components/employee/toggle-status-button/ToggleStatusButton.tsx

import { useState } from 'react';
import styles from './ToggleStatusButton.module.css';

export interface ToggleStatusButtonProps {
  employeeId: number;
  initialStatus: boolean;
  onStatusChange: (newStatus: boolean) => void;
  onToggleStatus?: (id: number, newStatus: boolean) => Promise<void>; // opcional, para injeção de API
}

export function ToggleStatusButton({
  employeeId,
  initialStatus,
  onStatusChange,
  onToggleStatus,
}: ToggleStatusButtonProps) {
  const [isActive, setIsActive] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    setLoading(true);
    try {
      if (onToggleStatus) {
        await onToggleStatus(employeeId, !isActive);
      } else {
        // fallback mock
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log(`Simulando toggle status do funcionário ${employeeId}`);
      }

      const newStatus = !isActive;
      setIsActive(newStatus);
      onStatusChange(newStatus);
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar status do funcionário.');
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
