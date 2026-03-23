import React from 'react';
import { Item } from '../types';
import { EventCard } from './Cards';

interface EventListProps {
  items: Item[];
  onDelete: (id: string) => void;
  onEdit: (item: Item) => void;
}

export function EventList({ items, onDelete, onEdit }: EventListProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold px-1">Events</h2>
      {items.length === 0 ? (
        <div className="text-center py-8 text-[#8E8E93] border-2 border-dashed border-[#E5E5EA] rounded-2xl">
          <p className="text-sm">No events scheduled</p>
        </div>
      ) : (
        items.map(item => (
          <EventCard 
            key={item.id} 
            item={item}
            onDelete={() => onDelete(item.id)}
            onEdit={() => onEdit(item)}
          />
        ))
      )}
    </div>
  );
}
