// src/components/employee/EmployeeList.tsx

import { Employee } from '../../types/employee';
import styles from './EmployeeList.module.css';
import { Link } from 'react-router-dom';

interface EmployeeListProps {
  employees: Employee[];
  onDelete: (employee: Employee) => void;
  onToggleStatus?: (employee: Employee) => void; // opcional, melhor que usar <form>
}

export default function EmployeeList({ employees, onDelete, onToggleStatus }: EmployeeListProps) {
  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>
          <th className={styles.th}>Nome</th>
          <th className={styles.th}>CPF</th>
          <th className={styles.th}>Email</th>
          <th className={styles.th}>Telefone</th>
          <th className={styles.th}>Cargo</th>
          <th className={styles.th}>Departamento</th>
          <th className={styles.th}>Salário</th>
          <th className={styles.th}>Admissão</th>
          <th className={styles.th}>Status</th>
          <th className={styles.th}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp) => (
          <tr key={emp.id} className={styles.trHover}>
            <td className={styles.td}>{emp.name}</td>
            <td className={styles.td}>{emp.cpf}</td>
            <td className={styles.td}>{emp.email}</td>
            <td className={styles.td}>{emp.phone}</td>
            <td className={styles.td}>{emp.position}</td>
            <td className={styles.td}>{emp.department?.name ?? '—'}</td>
            <td className={styles.td}>
              {emp.salary.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </td>
            <td className={styles.td}>
              {new Date(emp.admissionDate).toLocaleDateString('pt-BR')}
            </td>
            <td className={styles.td}>{emp.isActive ? 'Ativo' : 'Inativo'}</td>
            <td className={`${styles.td} ${styles.actions}`}>
              <Link to={`/employee/details/${emp.id}`} className={`${styles.btn} ${styles.btnInfo}`}>
                Detalhes
              </Link>
              <Link to={`/employee/edit/${emp.id}`} className={`${styles.btn} ${styles.btnWarning}`}>
                Editar
              </Link>

              {onToggleStatus && (
                <button
                  type="button"
                  className={`${styles.btn} ${emp.isActive ? styles.btnSecondary : styles.btnSuccess}`}
                  onClick={() => onToggleStatus(emp)}
                  title={emp.isActive ? 'Inativar' : 'Ativar'}
                >
                  {emp.isActive ? 'Inativar' : 'Ativar'}
                </button>
              )}

              <button
                onClick={() => onDelete(emp)}
                className={`${styles.btn} ${styles.btnDanger}`}
                title="Deletar"
              >
                Deletar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
