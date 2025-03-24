'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Calendar({ items, todos }) {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  
  useEffect(() => {
    const days = [];
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const startDay = monthStart.getDay();
    
    for (let i = 0; i < startDay; i++) {
      const prevMonthDay = new Date(monthStart);
      prevMonthDay.setDate(prevMonthDay.getDate() - (startDay - i));
      days.push({ date: prevMonthDay, currentMonth: false });
    }
    
    for (let day = 1; day <= monthEnd.getDate(); day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      days.push({ date, currentMonth: true });
    }
    
    const totalDaysNeeded = 42; 
    const remainingDays = totalDaysNeeded - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDay = new Date(monthEnd);
      nextMonthDay.setDate(nextMonthDay.getDate() + i);
      days.push({ date: nextMonthDay, currentMonth: false });
    }
    
    setCalendarDays(days);
  }, [currentMonth]);
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
 
  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  const getItemsForDate = (date) => {
    if (!items || !todos) {
      return { reviewItems: [], scheduledTodos: [] };
    }
    
    const dateKey = formatDateKey(date);
    
    const reviewItems = items.filter(item => {
      if (!item || !item.nextReviewDate) return false;
      const reviewDate = new Date(item.nextReviewDate);
      return formatDateKey(reviewDate) === dateKey;
    });
    
    const scheduledTodos = todos.filter(todo => {
      if (!todo || !todo.scheduledTime) return false;
      const todoDate = new Date(todo.scheduledTime);
      return formatDateKey(todoDate) === dateKey;
    });
    
    return { reviewItems, scheduledTodos };
  };
  
  const handleReviewItemClick = (itemId) => {
    router.push(`/review/${itemId}`);
  };
  
  const isToday = (date) => {
    const today = new Date();
    return formatDateKey(date) === formatDateKey(today);
  };
  
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };
  
  const safeSubstring = (text, start, end) => {
    if (!text || typeof text !== 'string') return '';
    return text.substring(start, end);
  };
  
  const monthYearString = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const getItemSubject = (item) => {
    return item.subject || item.front || item.text || item.content || 'Untitled Item';
  };
  
  const getDisplayText = (text) => {
    if (!text) return 'Todo';
    return text.length > 15 ? text.substring(0, 15) + '...' : text;
  };
  
  return (
    <div className="w-full bg-gray-800 rounded-lg p-4 mb-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold ml-8">{monthYearString}</h2>
        <div className="flex gap-2 mr-8">
          
          <button 
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-700 bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-700 bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        
        
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayObj, index) => {
          const { date, currentMonth } = dayObj;
          const { reviewItems, scheduledTodos } = getItemsForDate(date);
          const totalEvents = reviewItems.length + scheduledTodos.length;
          const hasEvents = totalEvents > 0;
          
          const dayClasses = `
            min-h-[80px] p-1 rounded-md relative
            ${isToday(date) ? 'bg-indigo-900 bg-opacity-40' : 'bg-gray-700'}
            ${!currentMonth ? 'text-gray-500' : 'text-white'}
            ${(hasEvents && !isPastDate(date)) ? 'ring-1 ring-indigo-500' : ''}
            ${isPastDate(date) && !isToday(date) ? 'opacity-70' : ''}`;
          
          return (
            <div key={index} className={dayClasses}>
              <div className="text-right text-sm mb-1">
                {date.getDate()}
              </div>
              
              {hasEvents && (
                <div className="space-y-1 overflow-y-auto max-h-[60px] text-xs">
                  {reviewItems.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => handleReviewItemClick(item.id)}
                      className="bg-blue-600 hover:bg-blue-500 rounded cursor-pointer"
                    >
                      <div className="px-1.5 py-1">
                        <span className="text-white font-medium block">
                          {getDisplayText(getItemSubject(item))}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {scheduledTodos.map(todo => (
                    <div 
                      key={todo.id}
                      className={todo.completed ? "bg-green-700 rounded" : "bg-red-700 rounded"}
                    >
                      <div className="px-1.5 py-1">
                        <span className={`text-white block ${todo.completed ? 'line-through' : ''}`}>
                          {getDisplayText(todo.task)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 flex gap-4 text-xs text-gray-400 justify-center">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-blue-600 rounded"></span>
          <span>Review Items</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-700 rounded"></span>
          <span>Tasks</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-700 rounded"></span>
          <span>Completed Tasks</span>
        </div>
      </div>
    </div>
  );
}
