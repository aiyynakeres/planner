import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Item, ItemType } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AddItemModalProps {
  isOpen: boolean;
  editingItem: Item | null;
  newItemType: ItemType;
  selectedDate: Date;
  onClose: () => void;
  onTypeChange: (type: ItemType) => void;
  onSubmit: (title: string, type: ItemType, date: string, time?: string, endTime?: string) => void;
}

export function AddItemModal({ 
  isOpen, 
  editingItem, 
  newItemType, 
  selectedDate, 
  onClose, 
  onTypeChange, 
  onSubmit 
}: AddItemModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-white rounded-t-[32px] p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingItem ? 'Edit' : 'New'} {newItemType === 'task' ? 'Task' : 'Event'}</h2>
              <button onClick={onClose} className="p-2 bg-[#F2F2F7] rounded-full"><X size={20}/></button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const title = formData.get('title') as string;
              const date = formData.get('date') as string;
              const time = formData.get('time') as string;
              const endTime = formData.get('endTime') as string;
              if(title) onSubmit(title, newItemType, date, time, endTime);
            }} className="space-y-6">
              <div className="flex p-1 bg-[#F2F2F7] rounded-xl mb-4">
                <button 
                  type="button"
                  onClick={() => onTypeChange('task')}
                  className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-all", newItemType === 'task' ? "bg-white shadow-sm text-[#007AFF]" : "text-[#8E8E93]")}
                >Task</button>
                <button 
                  type="button"
                  onClick={() => onTypeChange('event')}
                  className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-all", newItemType === 'event' ? "bg-white shadow-sm text-[#007AFF]" : "text-[#8E8E93]")}
                >Event</button>
              </div>

              <div className="space-y-4">
                <input 
                  autoFocus
                  name="title"
                  defaultValue={editingItem?.title || ''}
                  placeholder="What needs to be done?" 
                  className="w-full text-xl font-medium border-none focus:ring-0 placeholder:text-[#C7C7CC]"
                />
                
                <div className="flex items-center gap-4 py-3 border-y border-[#E5E5EA]">
                  <Calendar size={20} className="text-[#007AFF]" />
                  <input 
                    type="date" 
                    name="date"
                    defaultValue={editingItem?.date || format(selectedDate, 'yyyy-MM-dd')}
                    className="flex-1 border-none focus:ring-0 text-sm font-semibold"
                  />
                </div>

                <div className="flex items-center gap-4 py-3 border-b border-[#E5E5EA]">
                  <Clock size={20} className="text-[#007AFF]" />
                  <div className="flex-1 flex items-center gap-2">
                    <input 
                      type="time" 
                      name="time"
                      defaultValue={editingItem?.time || ''}
                      className="w-full border-none focus:ring-0 text-sm font-semibold"
                    />
                    <span className="text-[#8E8E93]">—</span>
                    <input 
                      type="time" 
                      name="endTime"
                      defaultValue={editingItem?.endTime || ''}
                      className="w-full border-none focus:ring-0 text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-[#007AFF] text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
              >
                {editingItem ? 'Update' : 'Add'} {newItemType === 'task' ? 'Task' : 'Event'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
