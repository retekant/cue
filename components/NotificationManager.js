'use client';

import { useState, useEffect } from 'react';
import { getTodos } from '../lib/storage';

const NOTIFIED_TODOS_KEY = 'cue_notified_todos';

export default function NotificationManager() {
  const [permission, setPermission] = useState('default');
  const [pendingNotifications, setPendingNotifications] = useState({});
  
  const getNotifiedTodos = () => {
    try {
      return JSON.parse(localStorage.getItem(NOTIFIED_TODOS_KEY) || '[]');
    } catch (_) {
      return [];
    }
  };
  
  const saveNotifiedTodo = (todoId) => {
    try {
      const notifiedTodos = getNotifiedTodos();
      if (!notifiedTodos.includes(todoId)) {
        localStorage.setItem(NOTIFIED_TODOS_KEY, JSON.stringify([...notifiedTodos, todoId]));
      }
    } catch (_) {
      console.error('Failed to save notified todo');
    }
  };
  
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);
  
  const requestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
    }
  };
  
  const createScheduledNotification = (todo) => {
    const todoTime = new Date(todo.scheduledTime);
    const now = new Date();
    
    const timeUntilNotification = todoTime.getTime() - now.getTime();
    
    if (timeUntilNotification <= 0) {
      showNotification(todo);
    } else {
      const timerId = setTimeout(() => {
        showNotification(todo);
      }, timeUntilNotification);
      
      setPendingNotifications(prev => ({
        ...prev,
        [todo.id]: timerId
      }));
    }
  };
  
  const showNotification = (todo) => {

    setPendingNotifications(prev => {
      const newPending = { ...prev };
      delete newPending[todo.id];
      return newPending;
    });
    
    saveNotifiedTodo(todo.id);
    
    if (permission === 'granted') {
      new Notification('Cue: Task Reminder', {
        body: `It's time for: ${todo.task}`,
        icon: '/favicon.ico'
      });
      
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = `Time for: ${todo.task}`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 5000);
    }
  };
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (Notification.permission) {
      setPermission(Notification.permission);
    }
    
    const interval = setInterval(() => {
      if (permission !== 'granted') return;
      
      // Check for todos that need notifications
      const todos = getTodos();
      todos.forEach(todo => {
        if (!todo.scheduledTime || todo.completed) return;
        
        createScheduledNotification(todo);
      });
    }, 60000); // Check every minute
    
    return () => {
      clearInterval(interval);
      Object.values(pendingNotifications).forEach(timerId => {
        clearTimeout(timerId);
      });
    };
  }, [permission, pendingNotifications, createScheduledNotification]);
  
  if (permission !== 'granted') {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 p-3 rounded-md shadow-lg z-50 max-w-sm">
        <p className="text-sm mb-2">Enable Notifications for Reminders</p>
        <button
          onClick={requestPermission}
          className="text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Enable Notifications
        </button>
      </div>
    );
  }
  
  return null; // No UI when permission granted
}
