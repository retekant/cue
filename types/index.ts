export interface StudyItem {
  id: string;
  subject: string;
  content?: string;
  createdAt: string;
  nextReviewDate: string;
  reviewCount: number;
  lastReviewedAt?: string;
  easiness: number;
  repetitions: number;
  interval: number;
}

export interface Todo {
  id: string;
  task: string;
  completed: boolean;
  createdAt: string;
  scheduledTime?: string;
}
