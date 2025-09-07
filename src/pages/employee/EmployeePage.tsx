// src/pages/employee/EmployeePage.tsx

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EmployeeFilter } from '../../components/employee/EmployeeFilter';
import { EmployeeDeleteModal } from '../../components/employee/EmployeeDeleteModal';
import { useEmployee } from '../../hooks/useEmployee';
import styles from './EmployeePage.module.css';

export interface EmployeeFilters {
  search?: string;
  departmentId?: number;
  position?: string;
  isActive?: boolean;
}

export default function EmployeePage() {
  const { employees: allEmployees, updateEmployee, deleteEmployee } = useEmployee();

  const [filters, setFilters] = useState<EmployeeFilters>({});
  const [query, setQuery] = useState('');
  const [selectedEmployeeToDelete, setSelectedEmployeeToDelete] = useState<number | null>(null);

  // Aplica os filtros
  const filteredEmployees = useMemo(() => {
    let result = [...allEmployees];

    // Filtro global da barra de pesquisa
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (emp) =>
          emp.name.toLowerCase().includes(q) ||
          emp.email.toLowerCase().includes(q) ||
          emp.phone?.includes(q)
      );
    }

    // Filtros do EmployeeFilter
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'isActive' && typeof value === 'boolean') {
          result = result.filter((emp) => emp.isActive === value);
        } else if (key === 'departmentId' && typeof value === 'number') {
          result = result.filter((emp) => emp.department?.id === value);
        } else if (key === 'position' && typeof value === 'string') {
          result = result.filter((emp) => emp.position === value);
        } else if (key === 'search' && typeof value === 'string') {
          const q = value.toLowerCase();
          result = result.filter(
            (emp) =>
              emp.name.toLowerCase().includes(q) ||
              emp.email.toLowerCase().includes(q) ||
              emp.phone?.includes(q) ||
              emp.cpf.includes(q)
          );
        }
      }
    });

    return result.sort((a, b) => a.id - b.id);
  }, [allEmployees, filters, query]);

  const openDeleteModal = (id: number) => setSelectedEmployeeToDelete(id);
  const closeDeleteModal = () => setSelectedEmployeeToDelete(null);

  const handleDeleteConfirmed = () => {
    if (selectedEmployeeToDelete === null) return;
    deleteEmployee(selectedEmployeeToDelete);
    closeDeleteModal();
  };

  const toggleActiveStatus = (empId: number) => {
    const emp = allEmployees.find((e) => e.id === empId);
    if (!emp) return;

    const action = emp.isActive ? 'inativar' : 'ativar';
    const confirmAction = window.confirm(
      `Tem certeza que deseja ${action} o funcionário ${emp.name}?`
    );
    if (!confirmAction) return;

    updateEmployee(emp.id, { isActive: !emp.isActive });
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Lista de Funcionários</h1>

      <div className={styles.contentWrapper}>
        <aside className={styles.sidebar}>
          <EmployeeFilter onFilterChange={setFilters} />
        </aside>

        <section className={styles.rightSection}>
          {/* Barra superior com botão Novo Funcionário e busca global */}
          <div className={styles.topBar}>
            <Link to="/employee/create" className={styles.btnPrimary}>
              Novo Funcionário
            </Link>
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou telefone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {filteredEmployees.length === 0 ? (
            <p className={styles.noResults}>Nenhum funcionário encontrado.</p>
          ) : (
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th className={styles.th}>ID</th>
                  <th className={styles.th}>Nome</th>
                  <th className={styles.th}>Cargo</th>
                  <th className={styles.th}>Departamento</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className={styles.trHover}>
                    <td className={styles.td}>{emp.id}</td>
                    <td className={styles.td}>{emp.name}</td>
                    <td className={styles.td}>{emp.position}</td>
                    <td className={styles.td}>{emp.department?.name || '-'}</td>
                    <td className={styles.td}>{emp.isActive ? 'Ativo' : 'Inativo'}</td>
                    <td className={`${styles.td} ${styles.actions}`}>
                      <Link to={`/employee/${emp.id}`} className={`${styles.btn} ${styles.btnInfo}`}>
                        Detalhes
                      </Link>
                      <Link to={`/employee/edit/${emp.id}`} className={`${styles.btn} ${styles.btnWarning}`}>
                        Editar
                      </Link>
                      <button
                        onClick={() => toggleActiveStatus(emp.id)}
                        className={`${styles.btn} ${emp.isActive ? styles.btnSecondary : styles.btnSuccess}`}
                      >
                        {emp.isActive ? 'Inativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => openDeleteModal(emp.id)}
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

      {selectedEmployeeToDelete !== null && (
        <EmployeeDeleteModal
          employee={allEmployees.find((e) => e.id === selectedEmployeeToDelete)!}
          onClose={closeDeleteModal}
          onDeleted={handleDeleteConfirmed}
        />
      )}
    </main>
  );
}
