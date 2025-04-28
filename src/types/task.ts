
export interface Task {
  id: string;
  name: string;
  totalDuration: number; // in seconds
  timeRemaining: number; // in seconds
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  completedAt?: string;
}
