// src/components/employee/EmployeeToggleStatusButton.tsx

import { useState } from 'react';
import styles from './EmployeeToggleStatusButton.module.css';
import { useEmployee } from '../../hooks/useEmployee';

interface EmployeeToggleStatusButtonProps {
  employeeId: number;
  isActive: boolean;
}

export function EmployeeToggleStatusButton({
  employeeId,
  isActive,
}: EmployeeToggleStatusButtonProps) {
  const { updateEmployee } = useEmployee();
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setLoading(true);
    try {
      updateEmployee(employeeId, { isActive: !isActive });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
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
