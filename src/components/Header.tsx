import React from 'react';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ViewType, ItemType } from '../types';

interface HeaderProps {
  selectedDate: Date;
  currentView: ViewType;
  onAddItem: (type: ItemType) => void;
}

export function Header({ selectedDate, currentView, onAddItem }: HeaderProps) {
  return (
    <header className="px-6 pt-12 pb-4 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-[#E5E5EA]">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[#8E8E93] text-sm font-semibold uppercase tracking-wider">
            {format(selectedDate, 'EEEE, d MMMM')}
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            {currentView === 'today' ? 'Today' : 
             currentView === 'schedule' ? 'Schedule' : 
             currentView === 'week' ? 'Weekly Planner' : 'Settings'}
          </h1>
        </div>
        <button 
          onClick={() => onAddItem('task')}
          className="w-10 h-10 rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-lg shadow-blue-200 active:scale-90 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>
    </header>
  );
}
