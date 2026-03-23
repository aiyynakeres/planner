import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Edit2, Trash2, Calendar, Clock } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Item } from '../types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function TaskCard({ item, onToggle, onDelete, onEdit }: { item: Item, onToggle: () => void, onDelete: () => void, onEdit: () => void }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-[#E5E5EA] hover:shadow-md transition-shadow"
    >
      <button onClick={onToggle} className={cn(
        "transition-colors",
        item.completed ? "text-[#34C759]" : "text-[#C7C7CC] hover:text-[#007AFF]"
      )}>
        {item.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
      </button>
      <div className="flex-1" onClick={onEdit}>
        <h3 className={cn(
          "font-semibold text-lg transition-all",
          item.completed && "line-through text-[#8E8E93]"
        )}>
          {item.title}
        </h3>
        {(item.time || item.endTime) && (
          <p className="text-xs text-[#8E8E93]">
            {item.time || '--:--'} {item.endTime ? `— ${item.endTime}` : ''}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
        <button onClick={onEdit} className="p-2 text-[#007AFF] hover:bg-blue-50 rounded-full">
          <Edit2 size={18} />
        </button>
        <button onClick={onDelete} className="p-2 text-[#FF3B30] hover:bg-red-50 rounded-full">
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}

export function EventCard({ item, onDelete, onEdit }: { item: Item, onDelete: () => void, onEdit: () => void }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-blue-50 p-4 rounded-2xl flex items-center gap-4 border border-blue-100 shadow-sm"
    >
      <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center" onClick={onEdit}>
        <Calendar size={20} />
      </div>
      <div className="flex-1" onClick={onEdit}>
        <h3 className="font-bold text-[#007AFF]">{item.title}</h3>
        <div className="flex items-center gap-1 text-xs text-blue-600/70 font-medium">
          <Clock size={12} />
          <span>{item.time || 'All Day'} {item.endTime ? `— ${item.endTime}` : ''}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
        <button onClick={onEdit} className="p-2 text-[#007AFF] hover:bg-blue-100 rounded-full">
          <Edit2 size={18} />
        </button>
        <button onClick={onDelete} className="p-2 text-[#FF3B30] hover:bg-red-100 rounded-full">
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}
