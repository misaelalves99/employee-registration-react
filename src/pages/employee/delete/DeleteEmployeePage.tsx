// src/components/employee/delete/DeleteEmployeePage.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Employee } from '../../../types/employee';
import { useEmployee } from '../../../hooks/useEmployee';
import styles from './DeleteEmployeePage.module.css';

interface EmployeeDeletePageProps {
  id: string;
}

interface Props {
  params: EmployeeDeletePageProps;
}

export default function EmployeeDeletePage({ params }: Props) {
  const { employees, deleteEmployee } = useEmployee();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const found = employees.find((emp) => emp.id === Number(params.id));
    if (!found) {
      setError('Funcionário não encontrado.');
    } else {
      setEmployee(found);
    }
    setLoading(false);
  }, [params.id, employees]);

  const handleDelete = () => {
    if (!employee) return;

    const confirmDelete = window.confirm(
      `Tem certeza que deseja deletar o funcionário ${employee.name}?`
    );
    if (!confirmDelete) return;

    try {
      deleteEmployee(employee.id);
      navigate('/employee'); // redireciona após exclusão
    } catch (err) {
      console.error(err);
      setError('Erro ao deletar funcionário.');
    }
  };

  if (loading) return <p className={styles.loading}>Carregando funcionário...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!employee) return <p className={styles.error}>Funcionário não encontrado.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Deletar Funcionário</h1>
      <p className={styles.message}>
        Tem certeza que deseja deletar o funcionário <strong>{employee.name}</strong>?
      </p>

      <div className={styles.detailsBox}>
        <p><strong>CPF:</strong> {employee.cpf}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Cargo:</strong> {employee.position}</p>
        <p><strong>Departamento:</strong> {employee.department?.name ?? 'Não informado'}</p>
      </div>

      <div className={styles.buttons}>
        <button onClick={handleDelete} className={styles.btnDelete}>
          Deletar
        </button>
        <button onClick={() => navigate('/employee')} className={styles.btnCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
