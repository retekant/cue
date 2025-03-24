'use client';

import { useState, useEffect } from 'react';
import { getTodos, updateTodo, deleteTodo } from '../lib/storage';

export default function TodoList({ todos, onUpdate }) {
  const [showCompleted, setShowCompleted] = useState(false);
  
  const formatDateTime = (dateString) => {
    if (!dateString) return 'No scheduled time';
    
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  const handleToggleComplete = (todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    const updatedTodos = updateTodo(updatedTodo);
    onUpdate(updatedTodos);
  };
  
  const handleDelete = (id) => {
    const updatedTodos = deleteTodo(id);
    onUpdate(updatedTodos);
  };
  
 
  const filteredTodos = todos.filter(todo => showCompleted || !todo.completed);
  
  if (todos.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400">
        No todos yet. Add one to get started.
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold ml-2">Todo List</h2>
        <button 
          onClick={() => setShowCompleted(!showCompleted)}
          className="text-sm text-indigo-400 hover:text-indigo-300"
        >
          {showCompleted ? 'Hide Completed' : 'Show Completed'}
        </button>
      </div>
      
      <div className="space-y-3">
        {filteredTodos.map(todo => (
          <div 
            key={todo.id} 
            className={`flex items-center justify-between p-3 rounded-md ${
              todo.completed ? 'bg-gray-800/50' : 'bg-gray-800'
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo)}
                className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex flex-col">
                <span className={todo.completed ? 'line-through text-gray-500' : ''}>{todo.task}</span>
                <span className="text-xs text-gray-500">{formatDateTime(todo.scheduledTime)}</span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(todo.id)}
              className="text-red-500 hover:text-red-400 text-sm"
              aria-label="Delete todo"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
