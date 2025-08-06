// src/components/employee/edit/EditEmployeePage.tsx

import { useState, useEffect, FormEvent } from 'react'
import { EmployeeForm } from '../../../types/employeeForm'
import { Department } from '../../../types/department'
import { POSITIONS } from '../../../types/position'
import { getEmployeeById, updateMockEmployee } from '../../../lib/mock/employees'
import { getMockDepartments } from '../../../lib/mock/departments'
import styles from './EditEmployeePage.module.css'

interface EditEmployeePageProps {
  id: string
}

interface Props {
  params: EditEmployeePageProps
}

export default function EditEmployeePage({ params }: Props) {
  const [employee, setEmployee] = useState<EmployeeForm | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    const id = Number(params.id)
    const data = getEmployeeById(id)

    if (!data) {
      setErrors(['Funcionário não encontrado'])
      setLoading(false)
      return
    }

    setEmployee({
      id: data.id,
      name: data.name,
      cpf: data.cpf,
      email: data.email,
      phone: data.phone || '',
      address: data.address || '',
      position: data.position,
      departmentId: data.department?.id ?? null,
      salary: data.salary,
      admissionDate: data.admissionDate.slice(0, 10),
      isActive: data.isActive,
    })

    getMockDepartments().then((deps) => {
      setDepartments(deps)
      setLoading(false)
    })
  }, [params.id])

  function handleChange<K extends keyof EmployeeForm>(key: K, value: EmployeeForm[K]) {
    if (!employee) return
    setEmployee({ ...employee, [key]: value })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!employee) return

    const updated = updateMockEmployee(employee.id, employee)
    if (updated) {
      window.location.href = '/employee'
    } else {
      setErrors(['Erro ao salvar dados do funcionário.'])
    }
  }

  if (loading) return <p className={styles.loading}>Carregando...</p>
  if (!employee) return <p className={styles.error}>Funcionário não encontrado</p>

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Editar Funcionário</h1>

      {errors.length > 0 && (
        <div className={styles.errorContainer}>
          {errors.map((err, i) => (
            <p key={i} className={styles.errorText}>
              {err}
            </p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {[
          ['name', 'Nome'],
          ['cpf', 'CPF'],
          ['email', 'Email'],
          ['phone', 'Telefone'],
          ['address', 'Endereço'],
        ].map(([key, label]) => (
          <div className={styles.field} key={key}>
            <label className={styles.label} htmlFor={key}>
              {label}
            </label>
            <input
              id={key}
              type="text"
              className={styles.input}
              value={employee[key as keyof EmployeeForm] as string}
              onChange={(e) => handleChange(key as keyof EmployeeForm, e.target.value)}
              required={key !== 'phone' && key !== 'address'}
            />
          </div>
        ))}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="position">
            Cargo
          </label>
          <select
            id="position"
            className={styles.input}
            value={employee.position}
            onChange={(e) => handleChange('position', e.target.value as typeof POSITIONS[number])}
            required
          >
            {POSITIONS.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="departmentId">
            Departamento
          </label>
          <select
            id="departmentId"
            className={styles.input}
            value={employee.departmentId ?? ''}
            onChange={(e) =>
              handleChange('departmentId', e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Nenhum</option>
            {departments.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="salary">
            Salário
          </label>
          <input
            id="salary"
            type="number"
            step="0.01"
            className={styles.input}
            value={employee.salary}
            onChange={(e) => handleChange('salary', parseFloat(e.target.value))}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="admissionDate">
            Data de Admissão
          </label>
          <input
            id="admissionDate"
            type="date"
            className={styles.input}
            value={employee.admissionDate}
            onChange={(e) => handleChange('admissionDate', e.target.value)}
            required
          />
        </div>

        <div className={styles.checkboxContainer}>
          <label htmlFor="isActive" className={styles.checkboxLabel}>
            <input
              id="isActive"
              type="checkbox"
              checked={employee.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
            />
            Ativo
          </label>
        </div>

        <div className={styles.buttons}>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Salvar
          </button>
          <a href="/employee" className={`${styles.btn} ${styles.btnSecondary}`}>
            Voltar
          </a>
        </div>
      </form>
    </div>
  )
}
