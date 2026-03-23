import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Flame, Trash2, Plus, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { Habit } from '../types';
import { calculateHabitStreak } from '../utils/habitUtils';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HabitSectionProps {
  habits: Habit[];
  selectedDate: Date;
  onToggleHabit: (id: string) => void;
  onDeleteHabit: (id: string) => void;
  onAddHabit: (title: string) => void;
  onEditHabit: (id: string, title: string) => void;
}

export function HabitSection({ habits, selectedDate, onToggleHabit, onDeleteHabit, onAddHabit, onEditHabit }: HabitSectionProps) {
  const lastHabitRef = React.useRef<HTMLInputElement>(null);

  // Auto-focus the last added habit if it's empty
  React.useEffect(() => {
    if (habits.length > 0) {
      const lastHabit = habits[habits.length - 1];
      if (lastHabit.title === '' && lastHabitRef.current) {
        lastHabitRef.current.focus();
      }
    }
  }, [habits.length]);

  return (
    <div className="space-y-4">
      <div className="px-1">
        <h2 className="text-xl font-bold">Habits</h2>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {habits.map((habit, index) => {
          const dateStr = format(selectedDate, 'yyyy-MM-dd');
          const isDoneOnSelectedDay = habit.completedDates.includes(dateStr);
          const currentStreak = calculateHabitStreak(habit.completedDates);
          const isLast = index === habits.length - 1;
          
          return (
            <motion.div 
              layout
              key={habit.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-[#E5E5EA] hover:shadow-md transition-shadow"
            >
              <button 
                onClick={() => onToggleHabit(habit.id)}
                className={cn(
                  "transition-all active:scale-90",
                  isDoneOnSelectedDay ? "text-orange-500" : "text-[#C7C7CC]"
                )}
              >
                {isDoneOnSelectedDay ? <CheckCircle2 size={28} /> : <Circle size={28} />}
              </button>
              <div className="flex-1">
                <input 
                  ref={isLast ? lastHabitRef : null}
                  type="text"
                  value={habit.title}
                  onChange={(e) => onEditHabit(habit.id, e.target.value)}
                  className={cn(
                    "w-full bg-transparent border-none focus:ring-0 p-0 font-semibold text-lg transition-all",
                    isDoneOnSelectedDay && "text-[#8E8E93]"
                  )}
                  placeholder="Habit name..."
                />
                {currentStreak > 0 && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex items-center gap-0.5 bg-orange-50 px-2 py-0.5 rounded-full w-fit">
                      <Flame size={12} className="text-orange-500 fill-orange-500" />
                      <span className="text-[10px] font-bold text-orange-600 uppercase tracking-tight">{currentStreak} DAY STREAK</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={() => onDeleteHabit(habit.id)}
                  className="p-2 text-[#FF3B30] hover:bg-red-50 rounded-full transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          );
        })}
        
        <button 
          onClick={() => onAddHabit('')}
          className="w-full py-3 border border-dashed border-[#E5E5EA] rounded-2xl text-[#8E8E93] font-bold text-sm hover:bg-[#F2F2F7] transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          <span>New Habit</span>
        </button>
      </div>
    </div>
  );
}
