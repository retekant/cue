'use client';

import { useState, useEffect } from 'react';
import { getDueItems } from '../lib/spacedRepetition';
import { deleteItem } from '../lib/storage';
import Link from 'next/link';

export default function ItemsList({ items, onUpdate }) {
  const [dueItems, setDueItems] = useState([]);
  const [upcomingItems, setUpcomingItems] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [localItems, setLocalItems] = useState([]);

  useEffect(() => {
    setMounted(true);
    setLocalItems(items);

    if (!items.length) return;
    
    const due = getDueItems(items);
    const upcoming = items.filter(item => !due.includes(item));
    
    upcoming.sort((a, b) => new Date(a.nextReviewDate) - new Date(b.nextReviewDate));
    
    setDueItems(due);
    setUpcomingItems(upcoming);
  }, [items]);

  if (!mounted) {
    return <div className="w-full max-w-md h-[300px] bg-gray-800 rounded-md animate-pulse"></div>;
  }

  const handleDelete = (id) => {
    const newLocalItems = localItems.filter(item => item.id !== id);
    setLocalItems(newLocalItems);
    
    setDueItems(dueItems.filter(item => item.id !== id));
    setUpcomingItems(upcomingItems.filter(item => item.id !== id));
    
    const updatedItems = deleteItem(id);
    onUpdate(updatedItems);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const displayDueItems = getDueItems(localItems);
  const displayUpcomingItems = localItems
    .filter(item => !displayDueItems.includes(item))
    .sort((a, b) => new Date(a.nextReviewDate) - new Date(b.nextReviewDate));

  return (
    <div className="w-full max-w-4xl">
      {displayDueItems.length > 0 && (
        <div className="mb-8 text-center">
          <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">
            Due for Review ({displayDueItems.length})
          </h2>
          <ul className="space-y-2 text-start">
            {displayDueItems.map(item => (
              <li 
                key={item.id} 
                className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">{item.subject}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Due: {formatDate(item.nextReviewDate)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link 
                    href={`/review/${item.id}`}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                  >
                    Review
                  </Link>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {displayUpcomingItems.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Upcoming ({displayUpcomingItems.length})
          </h2>
          <ul className="space-y-2 text-start">
            {displayUpcomingItems.map(item => (
              <li 
                key={item.id} 
                className=" rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">{item.subject}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Next review: {formatDate(item.nextReviewDate)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link 
                    href={`/review/${item.id}`}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                  >
                    Review
                  </Link>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {localItems.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-400">
            No items added yet. Add something you've learned to get started!
          </p>
        </div>
      )}
    </div>
  );
}
