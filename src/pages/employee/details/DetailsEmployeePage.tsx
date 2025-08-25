// src/components/employee/details/DetailsEmployeePage.tsx

import { Employee } from '../../../types/employee'
import { getEmployeeById } from '../../../lib/mock/employees'
import styles from './DetailsEmployeePage.module.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  id: string
}

export default function DetailsEmployeePage({ id }: Props) {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [notFound, setNotFound] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const numericId = Number(id)

    if (isNaN(numericId)) {
      setNotFound(true)
      return
    }

    const foundEmployee = getEmployeeById(numericId)

    if (!foundEmployee) {
      setNotFound(true)
      return
    }

    setEmployee(foundEmployee)
  }, [id])

  if (notFound) {
    return <NotFound onBack={() => navigate('/employee')} />
  }

  if (!employee) {
    return <p className={styles.loading}>Carregando funcionário...</p>
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalhes do Funcionário</h1>

      <div className={styles.card}>
        <p>
          <strong className={styles.label}>Nome:</strong> {employee.name}
        </p>
        <p>
          <strong className={styles.label}>CPF:</strong> {employee.cpf}
        </p>
        <p>
          <strong className={styles.label}>Email:</strong> {employee.email}
        </p>
        <p>
          <strong className={styles.label}>Telefone:</strong>{' '}
          {employee.phone || 'Não informado'}
        </p>
        <p>
          <strong className={styles.label}>Endereço:</strong>{' '}
          {employee.address || 'Não informado'}
        </p>
        <p>
          <strong className={styles.label}>Cargo:</strong> {employee.position}
        </p>
        <p>
          <strong className={styles.label}>Departamento:</strong>{' '}
          {employee.department?.name || 'Não informado'}
        </p>
        <p>
          <strong className={styles.label}>Salário:</strong>{' '}
          {employee.salary.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </p>
        <p>
          <strong className={styles.label}>Data de Admissão:</strong>{' '}
          {new Date(employee.admissionDate).toLocaleDateString('pt-BR')}
        </p>
        <p>
          <strong className={styles.label}>Status:</strong>{' '}
          {employee.isActive ? 'Ativo' : 'Inativo'}
        </p>
      </div>

      <div className={styles.buttonGroup}>
        <button
          className={styles.btnSecondary}
          onClick={() => navigate('/employee')}
          type="button"
        >
          Voltar
        </button>
        <button
          className={styles.btnPrimary}
          onClick={() => navigate(`/employee/edit/${employee.id}`)}
          type="button"
        >
          Editar
        </button>
      </div>
    </div>
  )
}

function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className={styles.notFoundContainer}>
      <h1 className={styles.notFoundTitle}>Funcionário não encontrado</h1>
      <button className={styles.btnPrimary} onClick={onBack} type="button">
        Voltar para a lista
      </button>
    </div>
  )
}
