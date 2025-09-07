// src/pages/employee/reactivate/ReactivateEmployeePage.tsx

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployee } from '../../../hooks/useEmployee';
import styles from './ReactivateEmployeePage.module.css';

export default function EmployeeReactivatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees, updateEmployee } = useEmployee();

  const [employee, setEmployee] = useState(employees.find(emp => emp.id === Number(id)) || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reactivating, setReactivating] = useState(false);

  useEffect(() => {
    const empId = Number(id);
    if (isNaN(empId)) {
      setError('Funcionário inválido.');
      setLoading(false);
      return;
    }

    const found = employees.find(emp => emp.id === empId);
    if (!found) {
      setError('Funcionário não encontrado.');
    } else {
      setEmployee(found);
    }
    setLoading(false);
  }, [id, employees]);

  const handleReactivate = () => {
    if (!employee) return;

    setReactivating(true);
    setError(null);

    const success = updateEmployee(employee.id, { ...employee, isActive: true });
    if (success) {
      navigate('/employee');
    } else {
      setError('Erro ao reativar funcionário.');
      setReactivating(false);
    }
  };

  if (loading) return <p className={styles.container}>Carregando...</p>;
  if (error) return <p className={`${styles.container} ${styles.errorText}`}>{error}</p>;
  if (!employee) return <p className={styles.container}>Funcionário não encontrado.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reativar Funcionário</h1>
      <h4 className={styles.subtitle}>Tem certeza que deseja reativar este funcionário?</h4>

      <div className={styles.card}>
        <h5 className={styles.cardTitle}>{employee.name}</h5>
        <p><strong className={styles.textStrong}>CPF:</strong> {employee.cpf}</p>
        <p><strong className={styles.textStrong}>Email:</strong> {employee.email}</p>
        <p><strong className={styles.textStrong}>Cargo:</strong> {employee.position}</p>
        <p><strong className={styles.textStrong}>Departamento:</strong> {employee.department?.name || 'Não informado'}</p>
      </div>

      <div className={styles.buttonGroup}>
        <button
          onClick={handleReactivate}
          disabled={reactivating}
          className={styles.btnPrimary}
        >
          {reactivating ? 'Reativando...' : 'Reativar'}
        </button>
        <button
          onClick={() => navigate('/employee')}
          className={styles.btnSecondary}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
