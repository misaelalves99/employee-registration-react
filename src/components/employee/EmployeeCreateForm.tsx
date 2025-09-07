// src/components/employee/EmployeeCreateForm.tsx

import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployee } from '../../hooks/useEmployee';
import styles from './EmployeeCreateForm.module.css';
import { Position, POSITIONS } from '../../types/position';
import { Department } from '../../types/department';

interface EmployeeCreateFormProps {
  departments: Department[];
}

export function EmployeeCreateForm({ departments }: EmployeeCreateFormProps) {
  const { addEmployee } = useEmployee();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    address: '',
    position: '' as Position | '',
    departmentId: '' as number | '',
    salary: '',
    admissionDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const value = e.target.name === 'departmentId' ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  }

  function validateForm() {
    const newErrors: Record<string, string> = {};
    if (!form.name) newErrors.name = 'Nome é obrigatório.';
    if (!form.cpf) newErrors.cpf = 'CPF é obrigatório.';
    if (!form.email) newErrors.email = 'Email é obrigatório.';
    if (!form.position) newErrors.position = 'Cargo é obrigatório.';
    if (!form.departmentId) newErrors.departmentId = 'Departamento é obrigatório.';
    if (!form.salary || isNaN(Number(form.salary))) newErrors.salary = 'Salário inválido.';
    if (!form.admissionDate) newErrors.admissionDate = 'Data de admissão é obrigatória.';
    return newErrors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // Cria o funcionário usando o contexto
    addEmployee({
      name: form.name,
      cpf: form.cpf,
      email: form.email,
      phone: form.phone,
      address: form.address,
      position: form.position as Position,
      departmentId: form.departmentId || null,
      salary: Number(form.salary),
      admissionDate: form.admissionDate,
      isActive: true, // por padrão ativo
    });

    navigate('/employee'); // volta para lista
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h1 className={styles.title}>Cadastrar Funcionário</h1>

      {/* Campos do formulário */}
      {/* Reaproveitar o mesmo código de campos e erros do seu código atual */}
      {['name','cpf','email','phone','address'].map((key) => (
        <div className={styles.formGroup} key={key}>
          <label htmlFor={key} className={styles.label}>{key[0].toUpperCase() + key.slice(1)}</label>
          <input
            id={key}
            name={key}
            type="text"
            className={styles.input}
            value={form[key as keyof typeof form] as string}
            onChange={handleChange}
          />
          {errors[key] && <small className={styles.errorText}>{errors[key]}</small>}
        </div>
      ))}

      {/* Position */}
      <div className={styles.formGroup}>
        <label htmlFor="position" className={styles.label}>Cargo</label>
        <select id="position" name="position" className={styles.select} value={form.position} onChange={handleChange}>
          <option value="">Selecione</option>
          {POSITIONS.map((pos) => <option key={pos} value={pos}>{pos}</option>)}
        </select>
        {errors.position && <small className={styles.errorText}>{errors.position}</small>}
      </div>

      {/* Department */}
      <div className={styles.formGroup}>
        <label htmlFor="departmentId" className={styles.label}>Departamento</label>
        <select id="departmentId" name="departmentId" className={styles.select} value={form.departmentId} onChange={handleChange}>
          <option value="">Selecione</option>
          {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        {errors.departmentId && <small className={styles.errorText}>{errors.departmentId}</small>}
      </div>

      {/* Salary */}
      <div className={styles.formGroup}>
        <label htmlFor="salary" className={styles.label}>Salário</label>
        <input id="salary" name="salary" type="number" step="0.01" className={styles.input} value={form.salary} onChange={handleChange} />
        {errors.salary && <small className={styles.errorText}>{errors.salary}</small>}
      </div>

      {/* Admission Date */}
      <div className={styles.formGroup}>
        <label htmlFor="admissionDate" className={styles.label}>Data de Admissão</label>
        <input id="admissionDate" name="admissionDate" type="date" className={styles.input} value={form.admissionDate} onChange={handleChange} />
        {errors.admissionDate && <small className={styles.errorText}>{errors.admissionDate}</small>}
      </div>

      <button type="submit" className={styles.button}>Salvar</button>
    </form>
  );
}
