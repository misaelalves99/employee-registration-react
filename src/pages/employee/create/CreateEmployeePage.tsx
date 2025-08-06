// src/components/employee/create/CreateEmployeePage.tsx

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Department } from '../../../types/department'
import { Position } from '../../../types/position'
import { createMockEmployee } from '../../../lib/mock/employees'
import { getMockDepartments } from '../../../lib/mock/departments'
import { getMockPositions } from '../../../lib/mock/positions'
import styles from './CreateEmployeePage.module.css'

interface EmployeeFormData {
  name: string
  cpf: string
  salary: string
  isActive: boolean
  departmentId: string
  position: Position | ''
}

export default function CreateEmployeePage() {
  const navigate = useNavigate()

  const [departments, setDepartments] = useState<Department[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    cpf: '',
    salary: '',
    isActive: true,
    departmentId: '',
    position: '',
  })

  useEffect(() => {
    async function fetchData() {
      const [deps, pos] = await Promise.all([
        getMockDepartments(),
        getMockPositions(),
      ])
      setDepartments(deps)
      setPositions(pos)
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [name]: newValue }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.name.trim() ||
      !formData.cpf.trim() ||
      !formData.salary.trim() ||
      !formData.departmentId.trim() ||
      formData.position === ''
    ) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    await createMockEmployee({
      id: Date.now(),
      name: formData.name.trim(),
      cpf: formData.cpf.trim(),
      salary: parseFloat(formData.salary),
      position: formData.position,
      departmentId: parseInt(formData.departmentId),
      department: departments.find((d) => d.id === parseInt(formData.departmentId)),
      email: '',
      admissionDate: new Date().toISOString(),
      isActive: formData.isActive,
      phone: '',
      address: '',
    })

    navigate('/employee')
  }

  if (loading) return <p className={styles.loading}>Carregando...</p>

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Criar Funcionário</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Nome:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="cpf" className={styles.label}>
            CPF:
          </label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
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
      </form>
    </div>
  )
}
