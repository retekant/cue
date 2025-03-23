
export function calculateNextReview(reviewCount, performance) {

  const intervals = [
    1,     
    3,     
    7,     
    14,    
    30,     
    60,     
    120,    
  ];
  
  let nextInterval;
  
  if (performance <= 2) {
    nextInterval = 1;
  } else {
    const intervalIndex = Math.min(reviewCount, intervals.length - 1);
    nextInterval = intervals[intervalIndex];
    
    if (performance === 5) {
      nextInterval = Math.round(nextInterval * 1.3);
    } else if (performance === 3) {
      nextInterval = Math.round(nextInterval * 0.8);
    }
  }
  
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);
  
  return {
    nextReviewDate: nextReviewDate.toISOString(),
    reviewCount: performance <= 2 ? 0 : reviewCount + 1
  };
}

export function getDueItems(items) {
  const now = new Date();
  return items.filter(item => {
    const reviewDate = new Date(item.nextReviewDate);
    return reviewDate <= now;
  });
}
