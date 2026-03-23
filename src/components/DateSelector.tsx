import React, { useEffect, useRef } from 'react';
import { format, addDays, isSameDay, subDays } from 'date-fns';
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Generate a range of dates (e.g., 30 days before and after today)
  const dates = Array.from({ length: 61 }, (_, i) => subDays(addDays(new Date(), 30), 60 - i));

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const scrollContainer = scrollRef.current;
      const activeElement = activeRef.current;
      
      const scrollLeft = activeElement.offsetLeft - (scrollContainer.clientWidth / 2) + (activeElement.clientWidth / 2);
      scrollContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [selectedDate]);

  return (
    <div 
      ref={scrollRef}
      className="flex overflow-x-auto no-scrollbar bg-[#F2F2F7] p-1 rounded-xl gap-1 snap-x"
    >
      {dates.map((date, i) => {
        const active = isSameDay(date, selectedDate);
        return (
          <button
            key={i}
            ref={active ? activeRef : null}
            onClick={() => onDateChange(date)}
            className={cn(
              "flex-shrink-0 w-16 py-2 rounded-lg flex flex-col items-center transition-all snap-center",
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
