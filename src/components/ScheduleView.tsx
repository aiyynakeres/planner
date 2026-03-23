import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Item } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ScheduleViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  items: Item[];
}

export function ScheduleView({ selectedDate, onDateChange, items }: ScheduleViewProps) {
  return (
    <motion.div
      key="schedule"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-6">
         <button onClick={() => onDateChange(addDays(selectedDate, -1))} className="p-2 hover:bg-[#F2F2F7] rounded-full"><ChevronLeft size={20}/></button>
         <span className="font-semibold">{format(selectedDate, 'MMMM d, yyyy')}</span>
         <button onClick={() => onDateChange(addDays(selectedDate, 1))} className="p-2 hover:bg-[#F2F2F7] rounded-full"><ChevronRight size={20}/></button>
      </div>
      
      <div className="relative border-l-2 border-[#E5E5EA] ml-4 pl-6 space-y-8 py-4">
        {Array.from({ length: 24 }).map((_, i) => {
          const hour = i;
          const itemsAtHour = items.filter(item => item.time && parseInt(item.time.split(':')[0]) === hour);
          
          return (
            <div key={i} className="relative">
              <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-[#E5E5EA] border-2 border-white" />
              <div className="flex items-start gap-4">
                <span className="text-xs font-bold text-[#8E8E93] w-10 pt-1">
                  {format(new Date().setHours(hour, 0), 'HH:mm')}
                </span>
                <div className="flex-1 space-y-2">
                  {itemsAtHour.length > 0 ? (
                    itemsAtHour.map(item => (
                      <div key={item.id} className={cn(
                        "p-3 rounded-xl shadow-sm border-l-4",
                        item.type === 'event' ? "bg-blue-50 border-blue-500" : "bg-purple-50 border-purple-500"
                      )}>
                        <p className="font-semibold text-sm">{item.title}</p>
                        {item.time && <p className="text-[10px] text-[#8E8E93]">{item.time}</p>}
                      </div>
                    ))
                  ) : (
                    <div className="h-4 border-b border-[#E5E5EA] opacity-50" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
