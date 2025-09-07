// src/pages/employee/create/CreateEmployeePage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Department } from '../../../types/department';
import { Position } from '../../../types/position';
import { getMockDepartments } from '../../../lib/mock/departments';
import { getMockPositions } from '../../../lib/mock/positions';
import { useEmployee } from '../../../hooks/useEmployee';
import styles from './CreateEmployeePage.module.css';

interface EmployeeFormData {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: string;
  salary: string;
  admissionDate: string;
  isActive: boolean;
  departmentId: string;
  position: Position | '';
}

export default function CreateEmployeePage() {
  const navigate = useNavigate();
  const { addEmployee } = useEmployee(); // hook do contexto

  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    address: '',
    salary: '',
    admissionDate: '',
    isActive: true,
    departmentId: '',
    position: '',
  });

  useEffect(() => {
    async function fetchData() {
      const [deps, pos] = await Promise.all([getMockDepartments(), getMockPositions()]);
      setDepartments(deps);
      setPositions(pos);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.cpf.trim() ||
      !formData.email.trim() ||
      !formData.salary.trim() ||
      !formData.departmentId.trim() ||
      formData.position === '' ||
      !formData.admissionDate.trim()
    ) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Usando contexto para adicionar funcionário
    addEmployee({
      name: formData.name.trim(),
      cpf: formData.cpf.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      salary: parseFloat(formData.salary),
      admissionDate: formData.admissionDate,
      position: formData.position,
      departmentId: parseInt(formData.departmentId),
      department: departments.find((d) => d.id === parseInt(formData.departmentId)),
      isActive: formData.isActive,
    });

    navigate('/employee');
  };

  if (loading) return <p className={styles.loading}>Carregando...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Criar Funcionário</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {[
          ['name', 'Nome'],
          ['cpf', 'CPF'],
          ['email', 'Email'],
          ['phone', 'Telefone'],
          ['address', 'Endereço'],
        ].map(([key, label]) => (
          <div className={styles.field} key={key}>
            <label htmlFor={key} className={styles.label}>
              {label}:
            </label>
            <input
              type="text"
              id={key}
              name={key}
              value={formData[key as keyof EmployeeFormData] as string}
              onChange={handleChange}
              required={key !== 'phone' && key !== 'address'}
              className={styles.input}
            />
          </div>
        ))}

        <div className={styles.field}>
          <label htmlFor="salary" className={styles.label}>
            Salário:
          </label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            required
            step="0.01"
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="admissionDate" className={styles.label}>
            Data de Admissão:
          </label>
          <input
            type="date"
            id="admissionDate"
            name="admissionDate"
            value={formData.admissionDate}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="departmentId" className={styles.label}>
            Departamento:
          </label>
          <select
            id="departmentId"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="">Selecione...</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id.toString()}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="position" className={styles.label}>
            Cargo:
          </label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="">Selecione...</option>
            {positions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className={styles.checkboxInput}
          />
          <label htmlFor="isActive">Ativo</label>
        </div>

        <button type="submit" className={styles.button}>
          Criar Funcionário
        </button>

        <button
          type="button"
          className={`${styles.button} ${styles.backButton}`}
          onClick={() => navigate('/employee')}
        >
          Voltar
        </button>
      </form>
    </div>
  );
}
