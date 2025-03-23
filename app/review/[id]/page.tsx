'use client';

import { useEffect, useState } from 'react';
import { getItems } from '../../../lib/storage';
import ReviewItem from '../../../components/ReviewItem';
import { useParams } from 'next/navigation';

export default function ReviewPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
  
    setIsClient(true);
    
    const items = getItems();
    const foundItem = items.find((i: any) => i.id === id);
    
    setItem(foundItem || null);
    setLoading(false);
  }, [id]);

  if (!isClient) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Item not found</h1>
        <p className="mb-4">The item you are looking for doesn't exist or has been removed.</p>
        <a 
          href="/"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Go back home
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-3xl font-bold">Review</h1>
        <a 
          href="/"
          className="mt-2 inline-block text-indigo-400 hover:text-indigo-300"
        >
          ← Back to home
        </a>
      </header>

      <main className="flex flex-col items-center w-full">
        <ReviewItem item={item} />
      </main>
    </div>
  );
}
