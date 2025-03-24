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

// Define proper types for items and todos
interface Item {
  id: string;
  subject: string;
  content?: string;
  createdAt: string;
  nextReviewDate: string;
  reviewCount: number;
  lastReviewedAt?: string;
}

interface Todo {
  id: string;
  task: string;
  completed: boolean;
  createdAt: string;
  scheduledTime?: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'items' | 'todos'>('items');
  const [items, setItems] = useState<Item[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  
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

  const handleItemsUpdate = (updatedItems: Item[]) => {
    setItems(updatedItems);
  };

  const handleTodosUpdate = (updatedTodos: Todo[]) => {
    setTodos(updatedTodos);
  };
  
  return (
    <div className="w-full bg-gray-900">
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-center text-2xl font-bold mb-6">
        Cue Task Management
      </h1>
      
      <Calendar items={items} todos={todos} />
      
      <div className="mb-6 border-b border-gray-700">
        <div className="flex justify-center space-x-10">
          <button 
            onClick={() => setActiveTab('items')}
            className={`py-2 px-4 relative ${activeTab === 'items' 
              ? 'border-b-2 border-indigo-500 font-medium' 
              : 'text-gray-400 hover:text-white'}`}
          >
            Study Items
          </button>
          <button 
            onClick={() => setActiveTab('todos')}
            className={`py-2 px-4 relative ${activeTab === 'todos' 
              ? 'border-b-2 border-indigo-500 font-medium' 
              : 'text-gray-400 hover:text-white'}`}
          >
            Tasks
          </button>
        </div>
      </div>
      
      <div className="flex justify-center">
        <div className="max-w-3xl w-full bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
          {activeTab === 'items' && (
            <>
            <div className="mb-12 w-full flex justify-center">
              <AddItemForm onAdd={handleItemsUpdate} />
              </div>
              <ItemsList items={items} onUpdate={handleItemsUpdate} />
            
            </>
          )}
          
          {activeTab === 'todos' && (
            <>
              <TaskAdvisor todos={todos} />
              <TodoForm onAdd={handleTodosUpdate} />
              <div className='mt-7'>
              <TodoList todos={todos} onUpdate={handleTodosUpdate} />
              </div>
              
            </>
          )}
        </div>
      </div>
      
      <NotificationManager />
    </div>
    </div>
  );
}
