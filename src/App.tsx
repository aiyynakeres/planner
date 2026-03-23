/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  Settings, 
  LayoutGrid, 
  ListTodo, 
  Bell,
  Trash2,
  X,
  Flame,
  Edit2
} from 'lucide-react';
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
  startOfDay,
  isPast,
  isFuture,
  differenceInDays,
  subDays
} from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Item, ViewType, ItemType, Habit } from './types';

// Utility for cleaner tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

  const addItem = (title: string, type: ItemType, date: string, time?: string, endTime?: string) => {
    if (editingItem) {
      setItems(prev => prev.map(item => 
        item.id === editingItem.id ? { ...item, title, type, date, time, endTime } : item
      ));
      setEditingItem(null);
    } else {
      const newItem: Item = {
        id: crypto.randomUUID(),
        title,
        completed: false,
        date,
        time,
        endTime,
        type,
      };
      setItems(prev => [...prev, newItem]);
    }
    setIsAddingItem(false);
  };

  const calculateHabitStreak = (completedDates: string[]) => {
    if (completedDates.length === 0) return 0;
    
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    
    // If neither today nor yesterday is completed, the streak is broken
    if (!completedDates.includes(todayStr) && !completedDates.includes(yesterdayStr)) {
      return 0;
    }
    
    // Get unique dates and sort them descending
    const sortedDates = Array.from(new Set(completedDates)).sort((a, b) => b.localeCompare(a));
    
    // Find the latest date that is either today, yesterday, or in the future
    // and is part of a continuous chain reaching today or yesterday.
    let streak = 0;
    let checkDate = parseISO(sortedDates[0]); // Start from the absolute latest date
    
    // If the latest date is more than 1 day away from today, it's not a "current" streak
    // unless it's a future streak that connects back to today.
    // Let's find the chain that includes today or yesterday.
    
    // 1. Find the latest date in the set
    // 2. Count backwards from it
    // 3. If the chain doesn't include today or yesterday, it's not a current streak.
    
    let currentChain: string[] = [];
    let tempCheckDate = parseISO(sortedDates[0]);
    
    while (completedDates.includes(format(tempCheckDate, 'yyyy-MM-dd'))) {
      currentChain.push(format(tempCheckDate, 'yyyy-MM-dd'));
      tempCheckDate = subDays(tempCheckDate, 1);
    }
    
    // Check if this chain includes today or yesterday
    if (currentChain.includes(todayStr) || currentChain.includes(yesterdayStr)) {
      return currentChain.length;
    }
    
    return 0;
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

  // Filtered items for current view
  const todayItems = useMemo(() => 
    items.filter(item => isSameDay(parseISO(item.date), selectedDate)),
    [items, selectedDate]
  );

  const weekItems = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return items.filter(item => {
      const itemDate = parseISO(item.date);
      return itemDate >= start && itemDate <= end;
    });
  }, [items, selectedDate]);

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#1C1C1E] font-sans selection:bg-[#007AFF]/20">
      {/* Mobile Container */}
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="px-6 pt-12 pb-4 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-[#E5E5EA]">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[#8E8E93] text-sm font-semibold uppercase tracking-wider">
                {format(selectedDate, 'EEEE, d MMMM')}
              </p>
              <h1 className="text-3xl font-bold tracking-tight">
                {currentView === 'today' ? 'Today' : 
                 currentView === 'schedule' ? 'Schedule' : 
                 currentView === 'week' ? 'Weekly Planner' : 'Settings'}
              </h1>
            </div>
            <button 
              onClick={() => {
                setNewItemType('task');
                setIsAddingItem(true);
              }}
              className="w-10 h-10 rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-lg shadow-blue-200 active:scale-90 transition-transform"
            >
              <Plus size={24} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24 px-6 pt-6">
          <AnimatePresence mode="wait">
            {currentView === 'today' && (
              <motion.div
                key="today"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Date Selector Mini */}
                <div className="flex justify-between items-center bg-[#F2F2F7] p-1 rounded-xl">
                  {[-2, -1, 0, 1, 2].map(offset => {
                    const date = addDays(new Date(), offset);
                    const active = isSameDay(date, selectedDate);
                    return (
                      <button
                        key={offset}
                        onClick={() => setSelectedDate(date)}
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

                {/* Habits Section */}
                <div className="space-y-4">
                  <div className="px-1">
                    <h2 className="text-xl font-bold">Habits</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {habits.map(habit => {
                      const dateStr = format(selectedDate, 'yyyy-MM-dd');
                      const isDoneOnSelectedDay = habit.completedDates.includes(dateStr);
                      const currentStreak = calculateHabitStreak(habit.completedDates);
                      
                      return (
                        <motion.div 
                          layout
                          key={habit.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="group bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-[#E5E5EA] hover:shadow-md transition-shadow"
                        >
                          <button 
                            onClick={() => toggleHabit(habit.id)}
                            className={cn(
                              "transition-all active:scale-90",
                              isDoneOnSelectedDay ? "text-orange-500" : "text-[#C7C7CC]"
                            )}
                          >
                            {isDoneOnSelectedDay ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                          </button>
                          <div className="flex-1">
                            <h3 className={cn(
                              "font-semibold text-lg transition-all",
                              isDoneOnSelectedDay && "text-[#8E8E93]"
                            )}>
                              {habit.title}
                            </h3>
                            {currentStreak > 0 && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="flex items-center gap-0.5 bg-orange-50 px-2 py-0.5 rounded-full">
                                  <Flame size={12} className="text-orange-500 fill-orange-500" />
                                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-tight">{currentStreak} DAY STREAK</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <button 
                            onClick={() => {
                              if(confirm(`Delete habit "${habit.title}"?`)) deleteHabit(habit.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-2 text-[#FF3B30] hover:bg-red-50 rounded-full transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </motion.div>
                      );
                    })}
                    
                    {/* Add Habit Button */}
                    <button 
                      onClick={() => {
                        const title = prompt('Enter habit name:');
                        if(title) addHabit(title);
                      }}
                      className="w-full py-3 border border-dashed border-[#E5E5EA] rounded-2xl text-[#8E8E93] font-bold text-sm hover:bg-[#F2F2F7] transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      <span>New Habit</span>
                    </button>
                  </div>
                </div>

                {/* Task List */}
                <div className="space-y-3">
                  <h2 className="text-xl font-bold px-1">Tasks</h2>
                  {todayItems.filter(i => i.type === 'task').length === 0 ? (
                    <div className="text-center py-12 text-[#8E8E93]">
                      <ListTodo size={48} className="mx-auto mb-4 opacity-20" />
                      <p>No tasks for today. Relax!</p>
                    </div>
                  ) : (
                    todayItems.filter(i => i.type === 'task').map(item => (
                      <TaskCard 
                        key={item.id} 
                        item={item} 
                        onToggle={() => toggleComplete(item.id)}
                        onDelete={() => deleteItem(item.id)}
                        onEdit={() => {
                          setEditingItem(item);
                          setNewItemType(item.type);
                          setIsAddingItem(true);
                        }}
                      />
                    ))
                  )}
                </div>

                {/* Events List */}
                <div className="space-y-3">
                  <h2 className="text-xl font-bold px-1">Events</h2>
                  {todayItems.filter(i => i.type === 'event').length === 0 ? (
                    <div className="text-center py-8 text-[#8E8E93] border-2 border-dashed border-[#E5E5EA] rounded-2xl">
                      <p className="text-sm">No events scheduled</p>
                    </div>
                  ) : (
                    todayItems.filter(i => i.type === 'event').map(item => (
                      <EventCard 
                        key={item.id} 
                        item={item}
                        onDelete={() => deleteItem(item.id)}
                        onEdit={() => {
                          setEditingItem(item);
                          setNewItemType(item.type);
                          setIsAddingItem(true);
                        }}
                      />
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {currentView === 'schedule' && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-6">
                   <button onClick={() => setSelectedDate(d => addDays(d, -1))} className="p-2 hover:bg-[#F2F2F7] rounded-full"><ChevronLeft size={20}/></button>
                   <span className="font-semibold">{format(selectedDate, 'MMMM d, yyyy')}</span>
                   <button onClick={() => setSelectedDate(d => addDays(d, 1))} className="p-2 hover:bg-[#F2F2F7] rounded-full"><ChevronRight size={20}/></button>
                </div>
                
                <div className="relative border-l-2 border-[#E5E5EA] ml-4 pl-6 space-y-8 py-4">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const hour = i;
                    const itemsAtHour = todayItems.filter(item => item.time && parseInt(item.time.split(':')[0]) === hour);
                    
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
            )}

            {currentView === 'week' && (
              <motion.div
                key="week"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                   <button onClick={() => setSelectedDate(d => subWeeks(d, 1))} className="p-2 hover:bg-[#F2F2F7] rounded-full"><ChevronLeft size={20}/></button>
                   <span className="font-semibold">Week of {format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'MMM d')}</span>
                   <button onClick={() => setSelectedDate(d => addWeeks(d, 1))} className="p-2 hover:bg-[#F2F2F7] rounded-full"><ChevronRight size={20}/></button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {eachDayOfInterval({
                    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
                    end: endOfWeek(selectedDate, { weekStartsOn: 1 })
                  }).map(day => {
                    const dayItems = weekItems.filter(item => isSameDay(parseISO(item.date), day));
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
            )}

            {currentView === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E5EA]">
                  <SettingsItem icon={<Bell size={20} className="text-red-500"/>} title="Notifications" value="Enabled" />
                  <SettingsItem icon={<Calendar size={20} className="text-blue-500"/>} title="Week Starts On" value="Monday" />
                  <SettingsItem icon={<Clock size={20} className="text-orange-500"/>} title="Time Format" value="24-hour" />
                </div>

                <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E5EA]">
                  <button 
                    onClick={() => {
                      if(confirm('Clear all data?')) {
                        setItems([]);
                        localStorage.removeItem('ios-planner-items');
                      }
                    }}
                    className="w-full px-4 py-4 flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={20} />
                    <span className="font-semibold">Reset All Data</span>
                  </button>
                </div>

                <div className="text-center text-[#8E8E93] text-xs pt-12">
                  <p>iOS Planner v1.0.0</p>
                  <p>Designed for AI Studio</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <nav className="h-20 bg-white/80 backdrop-blur-md border-t border-[#E5E5EA] flex items-center justify-around px-4 sticky bottom-0">
          <NavButton 
            active={currentView === 'today'} 
            onClick={() => setCurrentView('today')} 
            icon={<ListTodo size={24} />} 
            label="Today" 
          />
          <NavButton 
            active={currentView === 'schedule'} 
            onClick={() => setCurrentView('schedule')} 
            icon={<Clock size={24} />} 
            label="Schedule" 
          />
          <NavButton 
            active={currentView === 'week'} 
            onClick={() => setCurrentView('week')} 
            icon={<LayoutGrid size={24} />} 
            label="Week" 
          />
          <NavButton 
            active={currentView === 'settings'} 
            onClick={() => setCurrentView('settings')} 
            icon={<Settings size={24} />} 
            label="Settings" 
          />
        </nav>

        {/* Add/Edit Item Modal */}
        <AnimatePresence>
          {(isAddingItem || editingItem) && (
            <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setIsAddingItem(false);
                  setEditingItem(null);
                }}
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
                  <button onClick={() => {
                    setIsAddingItem(false);
                    setEditingItem(null);
                  }} className="p-2 bg-[#F2F2F7] rounded-full"><X size={20}/></button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const title = formData.get('title') as string;
                  const date = formData.get('date') as string;
                  const time = formData.get('time') as string;
                  const endTime = formData.get('endTime') as string;
                  if(title) addItem(title, newItemType, date, time, endTime);
                }} className="space-y-6">
                  <div className="flex p-1 bg-[#F2F2F7] rounded-xl mb-4">
                    <button 
                      type="button"
                      onClick={() => setNewItemType('task')}
                      className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-all", newItemType === 'task' ? "bg-white shadow-sm text-[#007AFF]" : "text-[#8E8E93]")}
                    >Task</button>
                    <button 
                      type="button"
                      onClick={() => setNewItemType('event')}
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
      </div>
    </div>
  );
}

// Sub-components
function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-colors",
        active ? "text-[#007AFF]" : "text-[#8E8E93]"
      )}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}

function TaskCard({ item, onToggle, onDelete, onEdit }: { item: Item, onToggle: () => void, onDelete: () => void, onEdit: () => void, key?: string }) {
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

function EventCard({ item, onDelete, onEdit }: { item: Item, onDelete: () => void, onEdit: () => void, key?: string }) {
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

function SettingsItem({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
  return (
    <div className="px-4 py-4 flex items-center justify-between hover:bg-[#F2F2F7] transition-colors border-b border-[#E5E5EA] last:border-none">
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-semibold">{title}</span>
      </div>
      <div className="flex items-center gap-2 text-[#8E8E93]">
        <span className="text-sm">{value}</span>
        <ChevronRight size={16} />
      </div>
    </div>
  );
}
