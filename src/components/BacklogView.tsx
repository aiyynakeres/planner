import React from 'react';
import { motion } from 'motion/react';
import { Inbox, GripVertical } from 'lucide-react';
import { Item } from '../types';
import { TaskCard } from './Cards';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  item: Item;
  onToggleComplete: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (item: Item) => void;
  key?: string;
}

function SortableItem({ item, onToggleComplete, onDeleteItem, onEditItem }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 group">
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing p-1 text-[#C7C7CC] hover:text-[#8E8E93]"
      >
        <GripVertical size={20} />
      </div>
      <div className="flex-1">
        <TaskCard 
          item={item} 
          onToggle={() => onToggleComplete(item.id)}
          onDelete={() => onDeleteItem(item.id)}
          onEdit={() => onEditItem(item)}
        />
      </div>
    </div>
  );
}

interface BacklogViewProps {
  items: Item[];
  onToggleComplete: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (item: Item) => void;
  onAddBacklogItem: () => void;
  onReorder: (newItems: Item[]) => void;
}

export function BacklogView({ 
  items, 
  onToggleComplete, 
  onDeleteItem, 
  onEditItem,
  onReorder
}: BacklogViewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <motion.div
      key="backlog"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {items.length === 0 ? (
        <div className="text-center py-20 text-[#8E8E93]">
          <Inbox size={64} className="mx-auto mb-4 opacity-10" />
          <p className="text-lg font-medium">Your backlog is empty</p>
          <p className="text-sm">Store tasks here for the future</p>
        </div>
      ) : (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={items.map(i => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {items.map(item => (
                <SortableItem 
                  key={item.id}
                  item={item}
                  onToggleComplete={onToggleComplete}
                  onDeleteItem={onDeleteItem}
                  onEditItem={onEditItem}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </motion.div>
  );
}
