'use client';

import { useState } from 'react';
import styles from './AuthForm.module.css';

interface User {
  id: string;
  username: string;
}

interface AuthFormProps {
  onLogin: (user: User) => void;
}

export default function AuthForm({ onLogin }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await fetch('http://localhost:8080/users');
        const data = await response.json();
        const user = data.users.find(
          (u: { username: string; password: string }) =>
            u.username === username && u.password === password
        );

        if (user) {
          onLogin({ id: user.id, username: user.username });
        } else {
          setError('Invalid username or password');
        }
      } else {
        const response = await fetch('http://localhost:8080/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const user = await response.json();
          onLogin({ id: user.id, username: user.username });
        } else {
          setError('Failed to create account');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Todo App</h1>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${isLogin ? styles.active : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`${styles.tab} ${!isLogin ? styles.active : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
