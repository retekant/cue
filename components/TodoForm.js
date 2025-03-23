'use client';

import { useState } from 'react';
import { addTodo } from '../lib/storage';

export default function TodoForm({ onAdd }) {
  const [task, setTask] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!task.trim()) return;
    
    const newTodo = {
      task: task.trim(),
      scheduledTime: scheduledTime ? new Date(scheduledTime).toISOString() : null,
    };
    
    const updatedTodos = addTodo(newTodo);
    onAdd(updatedTodos);
    
    setTask('');
    setScheduledTime('');
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
      >
        + Add Todo
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-gray-800 p-4 rounded-md">
      <div>
        <label htmlFor="task" className="block text-sm font-medium text-gray-300 mb-1">
          Task
        </label>
        <input
          type="text"
          id="task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 bg-gray-700 text-white"
          required
        />
      </div>
      
      <div>
        <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-300 mb-1">
          Scheduled Time
        </label>
        <input
          type="datetime-local"
          id="scheduledTime"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 bg-gray-700 text-white"
        />
      </div>
      
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="py-2 px-4 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
