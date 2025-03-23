'use client';

import { useState, useEffect } from 'react';
import AddItemForm from '../components/AddItemForm';
import ItemsList from '../components/ItemsList';
import { getItems } from '../lib/storage';

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setItems(getItems());
  }, []);

  const handleItemsUpdate = (updatedItems: any[]) => {
    setItems(updatedItems);
  };

  if (!isClient) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-3xl font-bold">cue</h1>
      </header>

      <main className="flex flex-col items-center w-full gap-12">
        <AddItemForm onAdd={handleItemsUpdate} />
        <ItemsList items={items} onUpdate={handleItemsUpdate} />
      </main>
    </div>
  );
}
