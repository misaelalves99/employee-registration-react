// src/App.tsx

import { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import HomePage from './pages/home/HomePage';
import EmployeePage from './pages/employee/EmployeePage';
import PrivacyPage from './pages/privacy/PrivacyPage';
import NotFoundPage from './pages/not-found/NotFoundPage';
import DetailsEmployeePage from './pages/employee/details/DetailsEmployeePage';
import EditEmployeePage from './pages/employee/edit/EditEmployeePage';
import CreateEmployeePage from './pages/employee/create/CreateEmployeePage';
import { EmployeeProvider } from './context/EmployeeProvider';
import styles from './App.module.css';

function App(): ReactNode {
  return (
    <EmployeeProvider>
      <Router>
        <Navbar />
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/employee" element={<EmployeePage />} />
            <Route path="/employee/create" element={<CreateEmployeePage />} />
            <Route path="/employee/:id" element={<EmployeeDetailsWrapper />} />
            <Route path="/employee/edit/:id" element={<EmployeeEditWrapper />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </EmployeeProvider>
  );
}

function EmployeeDetailsWrapper() {
  const { id } = useParams<{ id: string }>();
  return id ? <DetailsEmployeePage id={id} /> : <NotFoundPage />;
}

function EmployeeEditWrapper() {
  const { id } = useParams<{ id: string }>();
  return id ? <EditEmployeePage params={{ id }} /> : <NotFoundPage />;
}

export default App;
