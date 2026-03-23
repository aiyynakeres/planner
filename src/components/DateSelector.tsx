import React from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  return (
    <div className="flex justify-between items-center bg-[#F2F2F7] p-1 rounded-xl">
      {[-2, -1, 0, 1, 2].map(offset => {
        const date = addDays(new Date(), offset);
        const active = isSameDay(date, selectedDate);
        return (
          <button
            key={offset}
            onClick={() => onDateChange(date)}
            className={cn(
              "flex-1 py-2 rounded-lg flex flex-col items-center transition-all",
              active ? "bg-white shadow-sm text-[#007AFF]" : "text-[#8E8E93]"
            )}
          >
            <span className="text-[10px] font-bold uppercase">{format(date, 'EEE')}</span>
            <span className="text-lg font-semibold">{format(date, 'd')}</span>
          </button>
        );
      })}
    </div>
  );
}
