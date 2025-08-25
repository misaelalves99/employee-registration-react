// src/components/employee/EmployeeEditForm.tsx
import { useState, FormEvent, ChangeEvent } from 'react';
import { Position, PositionFormValue, POSITIONS } from '../../types/position';
import { Department } from '../../types/department';
import styles from './EmployeeEditForm.module.css';

interface EmployeeEditFormProps {
  employee: {
    id: number;
    name: string;
    cpf: string;
    email: string;
    phone?: string;
    address?: string;
    position: Position;
    departmentId: number;
    salary: number;
    admissionDate: string;
  };
  departments: Department[];
  onUpdate: (data: FormData) => Promise<void>;
}

export default function EmployeeEditForm({
  employee,
  departments,
  onUpdate,
}: EmployeeEditFormProps) {
  const [form, setForm] = useState({
    name: employee.name,
    cpf: employee.cpf,
    email: employee.email,
    phone: employee.phone ?? '',
    address: employee.address ?? '',
    position: employee.position as PositionFormValue, // ✅ usa PositionFormValue
    departmentId: employee.departmentId.toString(),
    salary: employee.salary.toString(),
    admissionDate: employee.admissionDate.slice(0, 10),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!form.name) newErrors.name = 'Nome é obrigatório.';
    if (!form.cpf) newErrors.cpf = 'CPF é obrigatório.';
    if (!form.email) newErrors.email = 'Email é obrigatório.';
    if (!form.position) newErrors.position = 'Cargo é obrigatório.'; // ✅ pode ser ""
    if (!form.departmentId || form.departmentId === '0') newErrors.departmentId = 'Departamento é obrigatório.';
    if (!form.salary || isNaN(Number(form.salary))) newErrors.salary = 'Salário inválido.';
    if (!form.admissionDate) newErrors.admissionDate = 'Data de admissão é obrigatória.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value ?? '');
    });

    await onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h1 className={styles.title}>Editar Funcionário</h1>

      {/* Campos de input */}
      {['name', 'cpf', 'email', 'phone', 'address', 'salary', 'admissionDate'].map((field) => (
        <div key={field} className={styles.formGroup}>
          <label htmlFor={field} className={styles.label}>{field}</label>
          <input
            id={field}
            name={field}
            type={field === 'salary' ? 'number' : field === 'admissionDate' ? 'date' : 'text'}
            value={form[field as keyof typeof form]}
            onChange={handleChange}
            className={styles.input}
          />
          {errors[field] && <small className={styles.errorText}>{errors[field]}</small>}
        </div>
      ))}

      {/* Cargo */}
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
          {POSITIONS.map(pos => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
        {errors.position && <small className={styles.errorText}>{errors.position}</small>}
      </div>

      {/* Departamento */}
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
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        {errors.departmentId && <small className={styles.errorText}>{errors.departmentId}</small>}
      </div>

      <button type="submit" className={styles.button}>Salvar</button>
    </form>
  );
}
