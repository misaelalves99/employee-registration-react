// src/components/employee/EmployeeDeleteModal.tsx

import { useState } from 'react';
import styles from './EmployeeDeleteModal.module.css';
import { Employee } from '../../types/employee';
import { useEmployee } from '../../hooks/useEmployee';

interface EmployeeDeleteModalProps {
  employee: Employee | null;
  onClose: () => void;
  onDeleted?: () => void; // opcional
}

export function EmployeeDeleteModal({ employee, onClose, onDeleted }: EmployeeDeleteModalProps) {
  const { deleteEmployee } = useEmployee();
  const [loading, setLoading] = useState(false);

  if (!employee) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const success = deleteEmployee(employee.id);
      if (success) {
        if (onDeleted) onDeleted();
        onClose();
      } else {
        alert('Erro ao deletar funcionário. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao deletar funcionário:', error);
      alert('Erro ao deletar funcionário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Confirmar Exclusão</h2>
        <p className={styles.message}>
          Tem certeza que deseja excluir <strong>{employee.name}</strong>?
        </p>

        <ul className={styles.employeeDetails}>
          <li><strong>ID:</strong> {employee.id}</li>
          <li><strong>CPF:</strong> {employee.cpf}</li>
          <li><strong>Email:</strong> {employee.email}</li>
          <li><strong>Cargo:</strong> {employee.position}</li>
          <li><strong>Departamento:</strong> {employee.department?.name ?? 'Não informado'}</li>
        </ul>

        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.cancel}`}
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className={`${styles.button} ${styles.confirm}`}
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deletando...' : 'Confirmar Exclusão'}
          </button>
        </div>
      </div>
    </div>
  );
}
