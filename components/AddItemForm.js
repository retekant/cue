'use client';

import { useState, useEffect } from 'react';
import { addItem } from '../lib/storage';

export default function AddItemForm({ onAdd }) {
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [aiError, setAiError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!subject.trim()) return;
    
    const newItem = {
      subject: subject.trim(),
      notes: notes.trim(),
    };
    
    const updatedItems = addItem(newItem);
    onAdd(updatedItems);
    
    setSubject('');
    setNotes('');
    setAiError('');
    setRetryCount(0);
  };

  const generateNotes = async () => {
    if (!subject.trim()) {
      setAiError('Please enter a subject first');
      return;
    }

    setIsGeneratingNotes(true);
    setAiError('');
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Create concise, informative notes about this topic: ${subject.trim()}. Include key points, definitions, and if applicable, examples.`
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate notes');
      }
      
      const data = await response.json();
      const aiNotes = data.response || data.content || '';
      
      if (aiNotes) {
        setNotes(aiNotes);
        setRetryCount(0); // Reset retry count on success
      } else {
        setAiError('Could not generate notes. Please try again or add your own notes.');
      }
    } catch (error) {
      console.error('Error generating notes:', error);
      
      // Handle AbortError (timeout)
      if (error.name === 'AbortError') {
        setAiError('Request timed out. The AI server might be busy.');
      } else {
        setAiError(`Failed to generate notes: ${error.message || 'Unknown error'}`);
      }
      
      // Auto-retry logic
      if (retryCount < MAX_RETRIES) {
        setAiError(`Retrying (${retryCount + 1}/${MAX_RETRIES})...`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          generateNotes();
        }, 2000); // Wait 2 seconds before retrying
      }
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  if (!mounted) {
    return <div className="w-full max-w-md h-[300px] bg-gray-800 rounded-md animate-pulse"></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-300">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 bg-gray-800 text-white"
          required
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-300">
            Notes (optional)
          </label>
          <button
            type="button"
            onClick={generateNotes}
            disabled={isGeneratingNotes || !subject.trim()}
            className="text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {isGeneratingNotes ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="4"
          className="mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 bg-gray-800 text-white"
        />
        {aiError && (
          <p className="mt-1 text-xs text-red-400">{aiError}</p>
        )}
      </div>
      
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white
         bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add to Review
      </button>
    </form>
  );
}
