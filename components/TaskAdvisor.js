'use client';

import { useState } from 'react';

export default function TaskAdvisor({ todos }) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    try {
      setIsLoading(true);
      setResponse('');
      
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          type: 'advice',
          todos: todos.map(todo => ({
            task: todo.task,
            completed: todo.completed,
            scheduledTime: todo.scheduledTime
          }))
        }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data = await res.json();
      setResponse(data.content);
    } catch (error) {
      console.error('Error getting AI advice:', error);
      setResponse('Sorry, I had trouble processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e) => {
    // Submit form on Enter press (without Shift for new lines)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <h3 className="text-lg font-semibold">AI Assistant</h3>
      </div>
      
      <p className="text-sm text-gray-400 mb-4">
        Ask for advice on task prioritization, productivity tips, or any other questions about your tasks.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What tasks should I prioritize today? How can I manage my workload better?"
            rows="3"
            className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:outline-none text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Press Enter to submit, Shift+Enter for new line</p>
        </div>
        
        <div
          className="text-xs text-gray-500 mt-1"
        >
          {isLoading ? 'Thinking...' : ''}
        </div>
      </form>
      
      {response && (
        <div className="mt-4 p-4 rounded-md bg-gray-700 text-sm">
          <div className="text-white whitespace-pre-line">{response}</div>
        </div>
      )}
    </div>
  );
}
