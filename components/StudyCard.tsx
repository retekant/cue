import { useState } from 'react';
import { StudyItem } from '@/types';
import { calculateNextReview } from '@/lib/spaced-repetition';

interface StudyCardProps {
  item: StudyItem;
  onComplete: (updatedItem: StudyItem) => void;
  onSkip: () => void;
  onGetHint?: () => Promise<string>;
}

export default function StudyCard({ item, onComplete, onSkip, onGetHint }: StudyCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  
  const handleReveal = () => {
    setRevealed(true);
  };
  
  const handleRating = (quality: number) => {
    const updatedSpacingData = calculateNextReview(
      item.easiness,
      item.repetitions,
      item.interval,
      quality
    );
    
    onComplete({
      ...item,
      ...updatedSpacingData
    });
    
    setRevealed(false);
    setHint(null);
  };
  
  const handleGetHint = async () => {
    if (onGetHint) {
      setLoading(true);
      try {
        const hintText = await onGetHint();
        setHint(hintText);
      } catch (error) {
        console.error("Error getting hint:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <div className="border rounded-lg p-6 max-w-lg mx-auto bg-white shadow-md">
      <h2 className="text-xl font-semibold mb-4">Review Card</h2>
      
      <div className="mb-6">
        <p className="text-lg">{item.content}</p>
      </div>
      
      {hint && (
        <div className="mb-6 p-3 bg-blue-50 rounded-md">
          <p className="text-sm italic">{hint}</p>
        </div>
      )}
      
      {!revealed ? (
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleReveal}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Show Answer
          </button>
          
          {onGetHint && (
            <button
              onClick={handleGetHint}
              disabled={loading}
              className="bg-gray-100 text-gray-800 py-2 px-4 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Get Hint"}
            </button>
          )}
          
          <button
            onClick={onSkip}
            className="text-gray-500 hover:underline py-1"
          >
            Skip for now
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-4">How well did you remember this?</p>
          <div className="grid grid-cols-6 gap-2">
            {[0, 1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRating(rating)}
                className={`py-2 rounded text-center 
                  ${rating < 3 ? 'bg-red-100 hover:bg-red-200' : 
                    rating < 5 ? 'bg-yellow-100 hover:bg-yellow-200' : 
                    'bg-green-100 hover:bg-green-200'}`}
              >
                {rating}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2 flex justify-between">
            <span>Complete blackout</span>
            <span>Perfect recall</span>
          </div>
        </div>
      )}
    </div>
  );
}