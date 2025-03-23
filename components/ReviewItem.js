'use client';

import { useState, useEffect } from 'react';
import { updateItem } from '../lib/storage';
import { useRouter } from 'next/navigation';
import { calculateNextReview } from '../lib/spacedRepetition';

export default function ReviewItem({ item }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [selfAssessment, setSelfAssessment] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div>Loading...</div>;
  if (!item) return <div>Item not found</div>;

  const handleAiScheduling = async () => {
    if (!selfAssessment.trim()) {
      setFeedback("Please describe how you feel about this topic first");
      return;
    }
    
    setIsScheduling(true);
    setFeedback("AI is determining the best schedule...");
    
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: selfAssessment,
          type: 'schedule'
        })
      });
      
      if (!response.ok) throw new Error('Failed to get AI schedule');
      
      const data = await response.json();
      const daysUntilNextReview = data.days || 7; 
      
      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + daysUntilNextReview);
      
      const updatedItem = {
        ...item,
        nextReviewDate: nextReviewDate.toISOString(),
        reviewCount: (item.reviewCount || 0) + 1,
        lastReviewedAt: new Date().toISOString(),
        lastAssessment: selfAssessment
      };
      
      updateItem(updatedItem);
      
      setFeedback(`${data.explanation} Scheduled for ${nextReviewDate.toLocaleDateString()}`);
      
      setTimeout(() => {
        router.push('/');
      }, 3000);
      
    } catch (error) {
      console.error('Error scheduling with AI:', error);
      setFeedback('Failed to schedule with AI. Using default schedule.');
      
      const { nextReviewDate } = calculateNextReview(item.reviewCount || 0, 3);
      const updatedItem = {
        ...item,
        nextReviewDate,
        reviewCount: (item.reviewCount || 0) + 1,
        lastReviewedAt: new Date().toISOString(),
        lastAssessment: selfAssessment
      };
      
      updateItem(updatedItem);
      
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } finally {
      setIsScheduling(false);
    }
  };

  

  return (
    <div className="w-full max-w-2xl p-6 bg-gray-800 rounded-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">{item.subject}</h2>
        
        {!showAnswer && (
          <button
            onClick={() => setShowAnswer(true)}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Show Answer
          </button>
        )}
      </div>
      
      {showAnswer && (
        <div className="mb-8">
          <div className="p-4 bg-gray-700 rounded-md mb-6">
            <p className="whitespace-pre-wrap">{item.notes || "No additional notes."}</p>
          </div>
          
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">How do you feel about this topic?</h3>
            <textarea
              value={selfAssessment}
              onChange={(e) => setSelfAssessment(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe your understanding and comfort level with this topic..."
              rows={3}
            />
            
            <button
              onClick={handleAiScheduling}
              disabled={isScheduling || !selfAssessment.trim()}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isScheduling ? "Scheduling..." : "Schedule with AI"}
            </button>
            
            {feedback && (
              <div className="text-center text-green-400 font-medium mt-4">
                {feedback}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
