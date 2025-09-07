// src/components/employee/EmployeeEditForm.tsx

import { useState, ChangeEvent, FormEvent } from 'react';
import { Position, POSITIONS } from '../../types/position';
import { Department } from '../../types/department';
import styles from './EmployeeEditForm.module.css';
import { useEmployee } from '../../hooks/useEmployee';
import { Employee } from '../../types/employee';

interface EmployeeEditFormProps {
  employee: Employee;
  departments: Department[];
  onUpdated?: () => void;
}

// Permitir string vazia no select de position
type EmployeeFormState = {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: string;
  position: Position | '';
  departmentId: string;
  salary: string;
  admissionDate: string;
};

export default function EmployeeEditForm({ employee, departments, onUpdated }: EmployeeEditFormProps) {
  const { updateEmployee } = useEmployee();

  const [form, setForm] = useState<EmployeeFormState>({
    name: employee.name,
    cpf: employee.cpf,
    email: employee.email,
    phone: employee.phone ?? '',
    address: employee.address ?? '',
    position: employee.position ?? '',
    departmentId: employee.departmentId?.toString() ?? '',
    salary: employee.salary.toString(),
    admissionDate: employee.admissionDate.slice(0, 10),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!form.name) newErrors.name = 'Nome é obrigatório.';
    if (!form.cpf) newErrors.cpf = 'CPF é obrigatório.';
    if (!form.email) newErrors.email = 'Email é obrigatório.';
    if (!form.position) newErrors.position = 'Cargo é obrigatório.';
    if (!form.departmentId) newErrors.departmentId = 'Departamento é obrigatório.';
    if (!form.salary || isNaN(Number(form.salary))) newErrors.salary = 'Salário inválido.';
    if (!form.admissionDate) newErrors.admissionDate = 'Data de admissão é obrigatória.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const success = updateEmployee(employee.id, {
        name: form.name,
        cpf: form.cpf,
        email: form.email,
        phone: form.phone,
        address: form.address,
        position: form.position as Position,
        departmentId: Number(form.departmentId),
        salary: parseFloat(form.salary),
        admissionDate: form.admissionDate,
      });

      if (success && onUpdated) onUpdated();
    } catch (err) {
      console.error('Erro ao atualizar funcionário:', err);
      alert('Erro ao atualizar funcionário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h1 className={styles.title}>Editar Funcionário</h1>

      {[
        { label: 'Nome', name: 'name', type: 'text' },
        { label: 'CPF', name: 'cpf', type: 'text' },
        { label: 'Email', name: 'email', type: 'email' },
        { label: 'Telefone', name: 'phone', type: 'text' },
        { label: 'Endereço', name: 'address', type: 'text' },
        { label: 'Salário', name: 'salary', type: 'number' },
        { label: 'Data de Admissão', name: 'admissionDate', type: 'date' },
      ].map(({ label, name, type }) => (
        <div key={name} className={styles.formGroup}>
          <label htmlFor={name} className={styles.label}>{label}</label>
          <input
            id={name}
            name={name}
            type={type}
            className={styles.input}
            value={form[name as keyof EmployeeFormState]}
            onChange={handleChange}
          />
          {errors[name] && <small className={styles.errorText}>{errors[name]}</small>}
        </div>
      ))}

      <div className={styles.formGroup}>
        <label htmlFor="position" className={styles.label}>Cargo</label>
        <select
          id="position"
          name="position"
          className={styles.select}
          value={form.position}
          onChange={handleChange}
        >
          <option value="">Selecione</option>
          {POSITIONS.map((pos) => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
        {errors.position && <small className={styles.errorText}>{errors.position}</small>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="departmentId" className={styles.label}>Departamento</label>
        <select
          id="departmentId"
          name="departmentId"
          className={styles.select}
          value={form.departmentId}
          onChange={handleChange}
        >
          <option value="">Selecione</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        {errors.departmentId && <small className={styles.errorText}>{errors.departmentId}</small>}
      </div>

      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? 'Atualizando...' : 'Salvar'}
      </button>
    </form>
  );
}
