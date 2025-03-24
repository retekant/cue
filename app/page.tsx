'use client';

import { useState, useEffect } from 'react';
import { getItems, getTodos } from '../lib/storage';
import AddItemForm from '../components/AddItemForm';
import ItemsList from '../components/ItemsList';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';
import NotificationManager from '../components/NotificationManager';
import TaskAdvisor from '../components/TaskAdvisor';
import Calendar from '../components/Calendar';

export default function Home() {
  const [activeTab, setActiveTab] = useState('items');
  const [items, setItems] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  
  useEffect(() => {
    const storedItems = getItems();
    const storedTodos = getTodos();
    setItems(storedItems);
    setTodos(storedTodos);
    
    const interval = setInterval(() => {
      const updatedItems = getItems();
      const updatedTodos = getTodos();
      setItems(updatedItems);
      setTodos(updatedTodos);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleItemsUpdate = (updatedItems: any[]) => {
    setItems(updatedItems);
  };

  const handleTodosUpdate = (updatedTodos: any[]) => {
    setTodos(updatedTodos);
  };
  
  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <h1 className="text-center text-2xl font-bold mb-6">
        
        cue task managment</h1>
      
      <Calendar items={items} todos={todos} />
      
      <div className="mb-6 border-b border-gray-700">
        <div className="flex space-x-6">
          <button 
            onClick={() => setActiveTab('items')}
            className={`py-2 px-1 ${activeTab === 'items' ? 'border-b-2 border-indigo-500 font-medium' : 'text-gray-400 hover:text-white'}`}
          >
            Study Items
          </button>
          <button 
            onClick={() => setActiveTab('todos')}
            className={`py-2 px-1 ${activeTab === 'todos' ? 'border-b-2 border-indigo-500 font-medium' : 'text-gray-400 hover:text-white'}`}
          >
            Tasks
          </button>
        </div>
      </div>
      
      <div>
        {activeTab === 'items' && (
          <>
            <AddItemForm onAdd={handleItemsUpdate} />
            <ItemsList items={items} onUpdate={handleItemsUpdate} />
          </>
        )}
        
        {activeTab === 'todos' && (
          <>
            <TaskAdvisor todos={todos} />
            <TodoForm onAdd={handleTodosUpdate} />
            <TodoList todos={todos} onUpdate={handleTodosUpdate} />
          </>
        )}
      </div>
      
      <NotificationManager />
    </main>
  );
}
