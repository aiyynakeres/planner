export type ItemType = 'task' | 'event';

export interface Item {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  date?: string; // ISO string (YYYY-MM-DD), optional for backlog
  time?: string; // HH:mm (Start time)
  endTime?: string; // HH:mm (End time)
  duration?: number; // in minutes (for events)
  type: ItemType;
  category?: string;
  isBacklog?: boolean;
  order?: number;
}

export interface Habit {
  id: string;
  title: string;
  completedDates: string[]; // Array of ISO strings (YYYY-MM-DD)
}

export type ViewType = 'today' | 'schedule' | 'week' | 'backlog';
