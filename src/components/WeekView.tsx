import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, subWeeks, addWeeks, isToday } from 'date-fns';
import { Item } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface WeekViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  items: Item[];
}

export function WeekView({ selectedDate, onDateChange, items }: WeekViewProps) {
  return (
    <motion.div
      key="week"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
         <button onClick={() => onDateChange(subWeeks(selectedDate, 1))} className="p-2 hover:bg-[#F2F2F7] rounded-full"><ChevronLeft size={20}/></button>
         <span className="font-semibold">Week of {format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'MMM d')}</span>
         <button onClick={() => onDateChange(addWeeks(selectedDate, 1))} className="p-2 hover:bg-[#F2F2F7] rounded-full"><ChevronRight size={20}/></button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {eachDayOfInterval({
          start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
          end: endOfWeek(selectedDate, { weekStartsOn: 1 })
        }).map(day => {
          const dayItems = items.filter(item => isSameDay(parseISO(item.date), day));
          return (
            <div key={day.toString()} className="bg-white rounded-2xl p-4 border border-[#E5E5EA] shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className={cn(
                  "font-bold",
                  isToday(day) ? "text-[#007AFF]" : "text-[#1C1C1E]"
                )}>
                  {format(day, 'EEEE, d')}
                </h3>
                <span className="text-xs text-[#8E8E93]">{dayItems.length} items</span>
              </div>
              <div className="space-y-1">
                {dayItems.slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center gap-2 text-sm">
                    <div className={cn("w-1.5 h-1.5 rounded-full", item.type === 'task' ? "bg-purple-500" : "bg-blue-500")} />
                    <span className={cn("truncate", item.completed && "line-through opacity-50")}>{item.title}</span>
                  </div>
                ))}
                {dayItems.length > 3 && (
                  <p className="text-[10px] text-[#8E8E93] pl-3.5">+ {dayItems.length - 3} more</p>
                )}
                {dayItems.length === 0 && (
                  <p className="text-xs text-[#8E8E93] italic">No plans yet</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
