'use client';

import { useState, useEffect } from 'react';
import AuthForm from './AuthForm';
import TodoList from './TodoList';
import styles from './TodoApp.module.css';

interface User {
  id: string;
  username: string;
}

export default function TodoApp() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {!user ? (
        <AuthForm onLogin={handleLogin} />
      ) : (
        <TodoList user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
