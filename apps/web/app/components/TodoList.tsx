'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './TodoList.module.css';

interface User {
  id: string;
  username: string;
}

interface Todo {
  id: string;
  task: string;
  done: boolean;
  userId: string;
}

interface TodoListProps {
  user: User;
  onLogout: () => void;
}

export default function TodoList({ user, onLogout }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8081');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message:', event.data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const todo: Todo = {
      id: Date.now().toString(),
      task: newTask,
      done: false,
      userId: user.id,
    };

    setTodos([...todos, todo]);
    setNewTask('');

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'add', todo }));
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.done;
    if (filter === 'completed') return todo.done;
    return true;
  });

  const activeTodosCount = todos.filter((t) => !t.done).length;

  return (
    <div className={styles.todoContainer}>
      <div className={styles.todoCard}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>My Tasks</h1>
            <p className={styles.subtitle}>Welcome back, {user.username}</p>
          </div>
          <button onClick={onLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>

        <form onSubmit={addTodo} className={styles.addForm}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="What needs to be done?"
            className={styles.addInput}
          />
          <button type="submit" className={styles.addBtn}>
            Add Task
          </button>
        </form>

        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.activeFilter : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'active' ? styles.activeFilter : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'completed' ? styles.activeFilter : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <div className={styles.todoList}>
          {filteredTodos.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>✓</div>
              <p>No tasks {filter !== 'all' ? filter : 'yet'}</p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div key={todo.id} className={styles.todoItem}>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
                  className={styles.checkbox}
                />
                <span className={`${styles.todoText} ${todo.done ? styles.completed : ''}`}>
                  {todo.task}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className={styles.deleteBtn}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <div className={styles.footer}>
            <span className={styles.count}>
              {activeTodosCount} {activeTodosCount === 1 ? 'task' : 'tasks'} left
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
