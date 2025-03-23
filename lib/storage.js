export const STORAGE_KEY = 'cue-items';


const isBrowser = () => typeof window !== 'undefined';


export function getItems() {
  if (!isBrowser()) return [];
  
  try {
    const items = localStorage.getItem(STORAGE_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error getting items from localStorage:', error);
    return [];
  }
}


export function saveItems(items) {
  if (!isBrowser()) return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving items to localStorage:', error);
  }
}


export function addItem(item) {
  if (!isBrowser()) return [];
  
  try {
    const items = getItems();
    const newItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      nextReviewDate: new Date().toISOString(),
      reviewCount: 0
    };
    
    items.push(newItem);
    saveItems(items);
    return items;
  } catch (error) {
    console.error('Error adding item:', error);
    return getItems();
  }
}


export function updateItem(updatedItem) {
  if (!isBrowser()) return [];
  
  try {
    const items = getItems();
    const index = items.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      items[index] = updatedItem;
      saveItems(items);
    }
    return items;
  } catch (error) {
    console.error('Error updating item:', error);
    return getItems();
  }
}


export function deleteItem(id) {
  if (!isBrowser()) return [];
  
  try {
    let items = getItems();
    items = items.filter(item => item.id !== id);
    saveItems(items);
    return items;
  } catch (error) {
    console.error('Error deleting item:', error);
    return getItems();
  }
}
