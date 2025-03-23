const ITEMS_STORAGE_KEY = 'cue_items';
const TODOS_STORAGE_KEY = 'cue_todos';

const initializeStorage = () => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(ITEMS_STORAGE_KEY)) {
    localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(TODOS_STORAGE_KEY)) {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify([]));
  }
};

export const getItems = () => {
  if (typeof window === 'undefined') return [];
  
  initializeStorage();
  
  try {
    const items = JSON.parse(localStorage.getItem(ITEMS_STORAGE_KEY) || '[]');
    
    return items.sort((a, b) => {
      return new Date(a.nextReviewDate || 0) - new Date(b.nextReviewDate || 0);
    });
  } catch (error) {
    console.error('Error getting items:', error);
    return [];
  }
};

export const addItem = (item) => {
  if (typeof window === 'undefined') return [];
  
  initializeStorage();
  
  try {
    const items = getItems();
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      nextReviewDate: new Date().toISOString(),
      reviewCount: 0
    };
    
    const updatedItems = [...items, newItem];
    localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(updatedItems));
    
    return updatedItems;
  } catch (error) {
    console.error('Error adding item:', error);
    return getItems();
  }
};

export const updateItem = (updatedItem) => {
  if (typeof window === 'undefined') return [];
  
  initializeStorage();
  
  try {
    const items = getItems();
    const updatedItems = items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    
    localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(updatedItems));
    
    return updatedItems;
  } catch (error) {
    console.error('Error updating item:', error);
    return getItems();
  }
};

export const deleteItem = (id) => {
  if (typeof window === 'undefined') return [];
  
  initializeStorage();
  
  try {
    const items = getItems();
    const updatedItems = items.filter(item => item.id !== id);
    
    localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(updatedItems));
    
    return updatedItems;
  } catch (error) {
    console.error('Error deleting item:', error);
    return getItems();
  }
};

export const getTodos = () => {
  if (typeof window === 'undefined') return [];
  
  initializeStorage();
  
  try {
    const todos = JSON.parse(localStorage.getItem(TODOS_STORAGE_KEY) || '[]');
    
    
    return todos.sort((a, b) => {
      return new Date(a.scheduledTime || 0) - new Date(b.scheduledTime || 0);
    });
  } catch (error) {
    console.error('Error getting todos:', error);
    return [];
  }
};

export const addTodo = (todo) => {
  if (typeof window === 'undefined') return [];
  
  initializeStorage();
  
  try {
    const todos = getTodos();
    const newTodo = {
      ...todo,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completed: false
    };
    
    const updatedTodos = [...todos, newTodo];
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(updatedTodos));
    
    return updatedTodos;
  } catch (error) {
    console.error('Error adding todo:', error);
    return getTodos();
  }
};

export const updateTodo = (updatedTodo) => {
  if (typeof window === 'undefined') return [];
  
  initializeStorage();
  
  try {
    const todos = getTodos();
    const updatedTodos = todos.map(todo => 
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(updatedTodos));
    
    return updatedTodos;
  } catch (error) {
    console.error('Error updating todo:', error);
    return getTodos();
  }
};

export const deleteTodo = (id) => {
  if (typeof window === 'undefined') return [];
  
  initializeStorage();
  
  try {
    const todos = getTodos();
    const updatedTodos = todos.filter(todo => todo.id !== id);
    
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(updatedTodos));
    
    return updatedTodos;
  } catch (error) {
    console.error('Error deleting todo:', error);
    return getTodos();
  }
};
