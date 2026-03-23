/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  format, 
  addDays, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  parseISO, 
  isToday,
  addWeeks,
  subWeeks,
  subDays
} from 'date-fns';
import { AnimatePresence } from 'motion/react';
import { Item, ViewType, ItemType, Habit } from './types';

// Components
import { Header } from './components/Header';
import { DateSelector } from './components/DateSelector';
import { HabitSection } from './components/HabitSection';
import { TaskList } from './components/TaskList';
import { EventList } from './components/EventList';
import { ScheduleView } from './components/ScheduleView';
import { WeekView } from './components/WeekView';
import { BacklogView } from './components/BacklogView';
import { BottomNav } from './components/BottomNav';
import { AddItemModal } from './components/AddItemModal';

export default function App() {
  // State
  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem('ios-planner-items');
    return saved ? JSON.parse(saved) : [];
  });
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('ios-planner-habits');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Drink Water', completedDates: [] },
      { id: '2', title: 'Read 10 pages', completedDates: [] },
      { id: '3', title: 'Exercise', completedDates: [] }
    ];
  });
  const [currentView, setCurrentView] = useState<ViewType>('today');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [newItemType, setNewItemType] = useState<ItemType>('task');

  // Persistence
  useEffect(() => {
    localStorage.setItem('ios-planner-items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('ios-planner-habits', JSON.stringify(habits));
  }, [habits]);

  // Handlers
  const toggleComplete = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const addItem = (title: string, type: ItemType, date: string, time?: string, endTime?: string, isBacklog?: boolean) => {
    if (editingItem) {
      setItems(prev => prev.map(item => 
        item.id === editingItem.id ? { ...item, title, type, date, time, endTime, isBacklog } : item
      ));
      setEditingItem(null);
    } else {
      const backlogCount = items.filter(i => i.isBacklog).length;
      const newItem: Item = {
        id: crypto.randomUUID(),
        title,
        completed: false,
        date,
        time,
        endTime,
        type,
        isBacklog,
        order: isBacklog ? backlogCount : undefined
      };
      setItems(prev => [...prev, newItem]);
    }
    setIsAddingItem(false);
  };

  const toggleHabit = (id: string) => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const alreadyDone = habit.completedDates.includes(dateStr);
        const newDates = alreadyDone 
          ? habit.completedDates.filter(d => d !== dateStr)
          : [...habit.completedDates, dateStr];
        
        return { ...habit, completedDates: newDates };
      }
      return habit;
    }));
  };

  const addHabit = (title: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      title,
      completedDates: []
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const editHabit = (id: string, title: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, title } : h));
  };

  const reorderBacklog = (newItems: Item[]) => {
    // Update all items, maintaining non-backlog items and updating backlog items with new order
    setItems(prev => {
      const nonBacklog = prev.filter(i => !i.isBacklog);
      const updatedBacklog = newItems.map((item, index) => ({ ...item, order: index }));
      return [...nonBacklog, ...updatedBacklog];
    });
  };

  // Filtered items for current view
  const todayItems = useMemo(() => 
    items.filter(item => !item.isBacklog && item.date && isSameDay(parseISO(item.date), selectedDate)),
    [items, selectedDate]
  );

  const weekItems = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return items.filter(item => {
      if (item.isBacklog || !item.date) return false;
      const itemDate = parseISO(item.date);
      return itemDate >= start && itemDate <= end;
    });
  }, [items, selectedDate]);

  const backlogItems = useMemo(() => 
    items.filter(item => item.isBacklog).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [items]
  );

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#1C1C1E] font-sans selection:bg-[#007AFF]/20">
      {/* Mobile Container */}
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative flex flex-col overflow-hidden">
        
        <Header 
          selectedDate={selectedDate} 
          currentView={currentView} 
          onAddItem={() => {
            setNewItemType('task');
            setIsAddingItem(true);
          }} 
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24 px-6 pt-6">
          <AnimatePresence mode="wait">
            {currentView === 'today' && (
              <div className="space-y-6">
                <DateSelector 
                  selectedDate={selectedDate} 
                  onDateChange={setSelectedDate} 
                />

                <HabitSection 
                  habits={habits} 
                  selectedDate={selectedDate} 
                  onToggleHabit={toggleHabit} 
                  onAddHabit={addHabit} 
                  onDeleteHabit={deleteHabit} 
                  onEditHabit={editHabit}
                />

                <TaskList 
                  items={todayItems} 
                  onToggle={toggleComplete} 
                  onDelete={deleteItem} 
                  onEdit={(item) => {
                    setEditingItem(item);
                    setNewItemType(item.type);
                    setIsAddingItem(true);
                  }} 
                />

                <EventList 
                  items={todayItems} 
                  onDelete={deleteItem} 
                  onEdit={(item) => {
                    setEditingItem(item);
                    setNewItemType(item.type);
                    setIsAddingItem(true);
                  }} 
                />
              </div>
            )}

            {currentView === 'schedule' && (
              <ScheduleView 
                selectedDate={selectedDate} 
                onDateChange={setSelectedDate} 
                items={todayItems} 
              />
            )}

            {currentView === 'week' && (
              <WeekView 
                selectedDate={selectedDate} 
                onDateChange={setSelectedDate} 
                items={weekItems} 
              />
            )}

            {currentView === 'backlog' && (
              <BacklogView 
                items={backlogItems}
                onToggleComplete={toggleComplete}
                onDeleteItem={deleteItem}
                onEditItem={(item) => {
                  setEditingItem(item);
                  setNewItemType(item.type);
                  setIsAddingItem(true);
                }}
                onAddBacklogItem={() => {
                  setNewItemType('task');
                  setIsAddingItem(true);
                }}
                onReorder={reorderBacklog}
              />
            )}
          </AnimatePresence>
        </main>

        <BottomNav 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />

        <AddItemModal 
          isOpen={isAddingItem || !!editingItem} 
          editingItem={editingItem} 
          newItemType={newItemType} 
          selectedDate={selectedDate} 
          onClose={() => {
            setIsAddingItem(false);
            setEditingItem(null);
          }} 
          onSubmit={addItem} 
          onTypeChange={setNewItemType} 
        />
      </div>
    </div>
  );
}
