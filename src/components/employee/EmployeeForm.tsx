// src/components/employee/EmployeeForm.tsx

import { useState, useCallback, useMemo, ChangeEvent, FormEvent } from 'react';
import { Department } from '../../types/department';
import { POSITIONS, Position } from '../../types/position';
import styles from './EmployeeForm.module.css';
import { useEmployee } from '../../hooks/useEmployee';

interface EmployeeFormProps {
  departments: Department[];
}

export function EmployeeForm({ departments }: EmployeeFormProps) {
  const { addEmployee } = useEmployee();

  const initialFormData = {
    name: '',
    cpf: '',
    email: '',
    phone: '',
    address: '',
    position: '' as Position | '',
    departmentId: '',
    salary: '',
    admissionDate: '',
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof initialFormData, string>>>({});

  const validate = useCallback(() => {
    const newErrors: Partial<Record<keyof typeof initialFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório.';
    if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório.';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório.';
    if (!formData.position) newErrors.position = 'Cargo é obrigatório.';
    if (!formData.departmentId) newErrors.departmentId = 'Departamento é obrigatório.';
    if (!formData.salary) {
      newErrors.salary = 'Salário é obrigatório.';
    } else if (isNaN(Number(formData.salary)) || Number(formData.salary) < 0) {
      newErrors.salary = 'Salário deve ser um número positivo.';
    }
    if (!formData.admissionDate) newErrors.admissionDate = 'Data de admissão é obrigatória.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'position' ? (value as Position | '') : value,
    }));
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addEmployee({
      ...formData,
      departmentId: Number(formData.departmentId),
      salary: Number(formData.salary),
      position: formData.position as Position,
    });

    setFormData(initialFormData);
  };

  const departmentOptions = useMemo(
    () =>
      departments.map((dept) => (
        <option key={dept.id} value={dept.id}>
          {dept.name}
        </option>
      )),
    [departments]
  );

  const positionOptions = useMemo(
    () =>
      POSITIONS.map((pos) => (
        <option key={pos} value={pos}>
          {pos}
        </option>
      )),
    []
  );

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <label className={styles.label}>Nome</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className={styles.input} />
        {errors.name && <p className={styles.errorText}>{errors.name}</p>}
      </div>

      <div>
        <label className={styles.label}>CPF</label>
        <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} className={styles.input} />
        {errors.cpf && <p className={styles.errorText}>{errors.cpf}</p>}
      </div>

      <div>
        <label className={styles.label}>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} />
        {errors.email && <p className={styles.errorText}>{errors.email}</p>}
      </div>

      <div>
        <label className={styles.label}>Telefone</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={styles.input} />
      </div>

      <div>
        <label className={styles.label}>Endereço</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} className={styles.input} />
      </div>

      <div>
        <label className={styles.label}>Cargo</label>
        <select name="position" value={formData.position} onChange={handleChange} className={styles.select}>
          <option value="">Selecione</option>
          {positionOptions}
        </select>
        {errors.position && <p className={styles.errorText}>{errors.position}</p>}
      </div>

      <div>
        <label className={styles.label}>Departamento</label>
        <select name="departmentId" value={formData.departmentId} onChange={handleChange} className={styles.select}>
          <option value="">Selecione</option>
          {departmentOptions}
        </select>
        {errors.departmentId && <p className={styles.errorText}>{errors.departmentId}</p>}
      </div>

      <div>
        <label className={styles.label}>Salário</label>
        <input type="number" name="salary" value={formData.salary} onChange={handleChange} className={styles.input} step="0.01" />
        {errors.salary && <p className={styles.errorText}>{errors.salary}</p>}
      </div>

      <div>
        <label className={styles.label}>Data de Admissão</label>
        <input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} className={styles.input} />
        {errors.admissionDate && <p className={styles.errorText}>{errors.admissionDate}</p>}
      </div>

      <div className={styles.checkboxContainer}>
        <input type="checkbox" checked={formData.isActive} onChange={handleCheckboxChange} className={styles.formCheckbox} id="isActive" />
        <label htmlFor="isActive">Ativo</label>
      </div>

      <button type="submit" className={styles.submitButton}>
        Cadastrar Funcionário
      </button>
    </form>
  );
}
