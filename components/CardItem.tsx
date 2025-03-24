import { useRouter } from 'next/navigation';

interface StudyItem {
  id: string;
  subject: string;
  content?: string;
  createdAt: string;
  nextReviewDate: string;
  reviewCount: number;
}

interface CardItemProps {
  item: StudyItem;
  onClick?: () => void;
}

export default function CardItem({ item, onClick }: CardItemProps) {
  const router = useRouter();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (item.id) {
      router.push(`/review/${item.id}`);
    }
  };
  
  return (
    <div 
      className="bg-gray-800 rounded-lg p-4 transition-shadow hover:shadow-lg cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-white">{item.subject}</h3>
          {item.content && (
            <p className="text-gray-400 mt-1 text-sm truncate">{item.content}</p>
          )}
        </div>
        {item.nextReviewDate && (
          <span className="text-sm text-gray-500">
            {new Date(item.nextReviewDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}