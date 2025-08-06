// src/components/navbar/Navbar.tsx

import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.brand}>
          Sistema de Funcionários
        </NavLink>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? styles.activeLink : '')}
              end
            >
              Início
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink
              to="/employee"
              className={({ isActive }) => (isActive ? styles.activeLink : '')}
            >
              Funcionários
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink
              to="/privacy"
              className={({ isActive }) => (isActive ? styles.activeLink : '')}
            >
              Privacidade
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}
