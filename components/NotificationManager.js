'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTodos } from '../lib/storage';

const NOTIFIED_TODOS_KEY = 'cue_notified_todos';

export default function NotificationManager() {
  const [permission, setPermission] = useState('default');
  const [pendingNotifications, setPendingNotifications] = useState({});
  
  const getNotifiedTodos = () => {
    try {
      return JSON.parse(localStorage.getItem(NOTIFIED_TODOS_KEY) || '[]');
    } catch {
      return [];
    }
  };
  
  const saveNotifiedTodo = (todoId) => {
    try {
      const notifiedTodos = getNotifiedTodos();
      if (!notifiedTodos.includes(todoId)) {
        localStorage.setItem(NOTIFIED_TODOS_KEY, JSON.stringify([...notifiedTodos, todoId]));
      }
    } catch {
      console.error('Failed to save notified todo');
    }
  };
  
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications');
      return;
    }
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };
  
  const createScheduledNotification = useCallback((todo) => {
    if (!todo.scheduledTime) return;
    
    const scheduledTime = new Date(todo.scheduledTime);
    const now = new Date();
    
    if (scheduledTime <= now) return;
    
    const timeUntilNotification = scheduledTime.getTime() - now.getTime();
    
    if (timeUntilNotification > 24 * 60 * 60 * 1000) return;
    
    if (pendingNotifications[todo.id]) {
      clearTimeout(pendingNotifications[todo.id]);
    }
    
    const timerId = setTimeout(() => {
      if (Notification.permission !== 'granted') return;
      
      const notification = new Notification('Task Due', {
        body: todo.task,
        icon: '/icons/icon-192x192.png',
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      
      saveNotifiedTodo(todo.id);
      
      setPendingNotifications(prev => {
        const updated = { ...prev };
        delete updated[todo.id];
        return updated;
      });
    }, timeUntilNotification);
    
    setPendingNotifications(prev => ({
      ...prev,
      [todo.id]: timerId
    }));
  }, [pendingNotifications]);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (Notification.permission) {
      setPermission(Notification.permission);
    }
    
    const interval = setInterval(() => {
      if (permission !== 'granted') return;
      
      const todos = getTodos();
      todos.forEach(todo => {
        if (!todo.scheduledTime || todo.completed) return;
        
        createScheduledNotification(todo);
      });
    }, 60000); 
    
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
  
  return null;
}
