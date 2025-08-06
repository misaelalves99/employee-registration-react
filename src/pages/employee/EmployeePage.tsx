// src/pages/employee/EmployeePage.tsx

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Employee } from '../../types/employee';
import EmployeeFilter from '../../components/employee/EmployeeFilter';
import { EmployeeDeleteModal } from '../../components/employee/EmployeeDeleteModal';
import { mockEmployees } from '../../lib/mock/employees';
import styles from './EmployeePage.module.css';

interface EmployeeFilters {
  search?: string;
  departmentId?: number;
  position?: string;
  isActive?: boolean;
  admissionDateFrom?: string;
  admissionDateTo?: string;
}

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<EmployeeFilters>({});
  const [selectedEmployeeToDelete, setSelectedEmployeeToDelete] = useState<Employee | null>(null);

  const fetchEmployees = useCallback(() => {
    let filtered = [...mockEmployees];

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.cpf.includes(q) ||
        emp.phone?.includes(q)
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'isActive' && typeof value === 'boolean') {
          filtered = filtered.filter(emp => emp.isActive === value);
        } else if (key === 'departmentId' && typeof value === 'number') {
          filtered = filtered.filter(emp => emp.department?.id === value);
        } else if (key === 'position' && typeof value === 'string') {
          filtered = filtered.filter(emp => emp.position === value);
        } else if (key === 'admissionDateFrom' && typeof value === 'string') {
          filtered = filtered.filter(emp => new Date(emp.admissionDate) >= new Date(value));
        } else if (key === 'admissionDateTo' && typeof value === 'string') {
          filtered = filtered.filter(emp => new Date(emp.admissionDate) <= new Date(value));
        }
      }
    });

    setEmployees(filtered);
  }, [query, filters]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const openDeleteModal = (employee: Employee) => setSelectedEmployeeToDelete(employee);
  const closeDeleteModal = () => setSelectedEmployeeToDelete(null);

  const handleDeleteConfirmed = () => {
    if (!selectedEmployeeToDelete) return;
    const index = mockEmployees.findIndex(e => e.id === selectedEmployeeToDelete.id);
    if (index !== -1) {
      mockEmployees.splice(index, 1);
      fetchEmployees();
    }
    closeDeleteModal();
  };

  const toggleActiveStatus = (emp: Employee) => {
    const index = mockEmployees.findIndex(e => e.id === emp.id);
    if (index !== -1) {
      mockEmployees[index].isActive = !mockEmployees[index].isActive;
      fetchEmployees();
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Lista de Funcionários</h1>

      <div className={styles.contentWrapper}>
        <aside className={styles.sidebar}>
          <EmployeeFilter onFilterChange={setFilters} />
        </aside>

        <section className={styles.rightSection}>
          <div className={styles.topBar}>
            <Link to="/employee/create" className={styles.btnPrimary}>
              Novo Funcionário
            </Link>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar por nome, CPF, e-mail ou telefone..."
              className={styles.searchInput}
            />
          </div>

          {employees.length === 0 ? (
            <p className={styles.noResults}>Nenhum funcionário encontrado.</p>
          ) : (
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th className={styles.th}>Nome</th>
                  <th className={styles.th}>CPF</th>
                  <th className={styles.th}>Cargo</th>
                  <th className={styles.th}>Departamento</th>
                  <th className={styles.th}>Admissão</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id} className={styles.trHover}>
                    <td className={styles.td}>{emp.name}</td>
                    <td className={styles.td}>{emp.cpf}</td>
                    <td className={styles.td}>{emp.position}</td>
                    <td className={styles.td}>{emp.department?.name || '-'}</td>
                    <td className={styles.td}>
                      {new Date(emp.admissionDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className={styles.td}>{emp.isActive ? 'Ativo' : 'Inativo'}</td>
                    <td className={`${styles.td} ${styles.actions}`}>
                      <Link to={`/employee/${emp.id}`} className={`${styles.btn} ${styles.btnInfo}`}>
                        Detalhes
                      </Link>
                      <Link to={`/employee/edit/${emp.id}`} className={`${styles.btn} ${styles.btnWarning}`}>
                        Editar
                      </Link>
                      <button
                        onClick={() => toggleActiveStatus(emp)}
                        className={`${styles.btn} ${emp.isActive ? styles.btnSecondary : styles.btnSuccess}`}
                      >
                        {emp.isActive ? 'Inativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => openDeleteModal(emp)}
                        className={`${styles.btn} ${styles.btnDanger}`}
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      {selectedEmployeeToDelete && (
        <EmployeeDeleteModal
          employee={selectedEmployeeToDelete}
          onClose={closeDeleteModal}
          onDeleted={handleDeleteConfirmed}
        />
      )}
    </main>
  );
}
