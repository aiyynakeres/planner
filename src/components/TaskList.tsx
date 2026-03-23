import React from 'react';
import { ListTodo } from 'lucide-react';
import { Item } from '../types';
import { TaskCard } from './Cards';

interface TaskListProps {
  items: Item[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (item: Item) => void;
}

export function TaskList({ items, onToggle, onDelete, onEdit }: TaskListProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold px-1">Tasks</h2>
      {items.length === 0 ? (
        <div className="text-center py-12 text-[#8E8E93]">
          <ListTodo size={48} className="mx-auto mb-4 opacity-20" />
          <p>No tasks for today. Relax!</p>
        </div>
      ) : (
        items.map(item => (
          <TaskCard 
            key={item.id} 
            item={item} 
            onToggle={() => onToggle(item.id)}
            onDelete={() => onDelete(item.id)}
            onEdit={() => onEdit(item)}
          />
        ))
      )}
    </div>
  );
}
