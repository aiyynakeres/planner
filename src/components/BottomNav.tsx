import React from 'react';
import { ListTodo, Clock, LayoutGrid, Inbox } from 'lucide-react';
import { ViewType } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function NavButton({ active, onClick, icon, label }: NavButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-colors",
        active ? "text-[#007AFF]" : "text-[#8E8E93]"
      )}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}

interface BottomNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  return (
    <nav className="h-20 bg-white/80 backdrop-blur-md border-t border-[#E5E5EA] flex items-center justify-around px-4 sticky bottom-0">
      <NavButton 
        active={currentView === 'today'} 
        onClick={() => onViewChange('today')} 
        icon={<ListTodo size={24} />} 
        label="Today" 
      />
      <NavButton 
        active={currentView === 'schedule'} 
        onClick={() => onViewChange('schedule')} 
        icon={<Clock size={24} />} 
        label="Schedule" 
      />
      <NavButton 
        active={currentView === 'week'} 
        onClick={() => onViewChange('week')} 
        icon={<LayoutGrid size={24} />} 
        label="Week" 
      />
      <NavButton 
        active={currentView === 'backlog'} 
        onClick={() => onViewChange('backlog')} 
        icon={<Inbox size={24} />} 
        label="Backlog" 
      />
    </nav>
  );
}
