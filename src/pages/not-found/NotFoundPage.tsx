// src/pages/not-found/NotFoundPage.tsx

import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Erro 404</h1>
      <p className={styles.description}>A página que você está procurando não foi encontrada.</p>
      <Link to="/" className={styles.btn}>
        Voltar à página inicial
      </Link>
    </section>
  )
}
