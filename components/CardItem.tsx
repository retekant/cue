import { StudyItem } from '@/types';
import { formatDistance } from '@/lib/spaced-repetition';

interface CardItemProps {
  item: StudyItem;
  onDelete: (id: string) => void;
}

export default function CardItem({ item, onDelete }: CardItemProps) {
  const nextReviewDate = new Date(item.nextReview);
  const now = new Date();
  const isReviewDue = nextReviewDate <= now;
  
  return (
    <div className={`border rounded-lg p-4 mb-4 ${isReviewDue ? 'border-red-500' : 'border-gray-200'}`}>
      <p className="font-medium">{item.content}</p>
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>
          Next review: {nextReviewDate.toLocaleDateString()} 
          {isReviewDue && <span className="text-red-500 ml-2">Due now!</span>}
        </span>
        <button 
          onClick={() => onDelete(item.id)} 
          className="text-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}