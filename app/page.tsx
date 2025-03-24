'use client';

import { useState, useEffect } from 'react';
import AddItemForm from '../components/AddItemForm';
import ItemsList from '../components/ItemsList';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import TaskAdvisor from '../components/TaskAdvisor';
import NotificationManager from '../components/NotificationManager';
import { getItems, getTodos } from '../lib/storage';

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('cards');

  useEffect(() => {
    setIsClient(true);
    setItems(getItems());
    setTodos(getTodos());
  }, []);

  const handleItemsUpdate = (updatedItems: any[]) => {
    setItems(updatedItems);
  };

  const handleTodosUpdate = (updatedTodos: any[]) => {
    setTodos(updatedTodos);
  };

  if (!isClient) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const dueItems = items.filter(item => new Date(item.nextReviewDate) <= new Date());
  const pendingTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      <NotificationManager />
      
      <header className="w-full max-w-5xl mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">cue</h1>
      </header>

      <main className="flex flex-col items-center w-full max-w-5xl">
    
        <div className="w-full gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Review Cards</h2>
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-4xl font-bold">{dueItems.length}</p>
                <p className="text-sm text-gray-400">Due for review</p>
              </div>
              <div>
                <p className="text-4xl font-bold">{items.length}</p>
                <p className="text-sm text-gray-400">Total cards</p>
              </div>
            </div>
            <a 
              href={dueItems.length > 0 ? `/review/${dueItems[0].id}` : '#'}
              className={`block text-center py-2 px-4 rounded-md ${
                dueItems.length > 0 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {dueItems.length > 0 ? 'Start Review' : 'No Cards Due'}
            </a>
          </div>
  
        </div>

        <div className="w-full border-b border-gray-700 mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('cards')}
              className={`py-3 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'cards' 
                  ? 'border-indigo-500 text-indigo-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Review Cards
            </button>
            <button
              onClick={() => setActiveTab('todos')}
              className={`py-3 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'todos' 
                  ? 'border-indigo-500 text-indigo-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Todo List
            </button>
          </div>
        </div>
        
        <div className="w-full">
          {activeTab === 'cards' && (
            <div className="space-y-12">
              <AddItemForm onAdd={handleItemsUpdate} />
              <ItemsList items={items} onUpdate={handleItemsUpdate} />
            </div>
          )}
          
          {activeTab === 'todos' && (
            <div className="space-y-8">
              <TaskAdvisor todos={todos} />
              <TodoForm onAdd={handleTodosUpdate} />
              <TodoList todos={todos} onUpdate={handleTodosUpdate} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
