import React from 'react';
import { motion } from 'motion/react';
import { Bell, Calendar, Clock, Trash2 } from 'lucide-react';

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function SettingsItem({ icon, title, value }: SettingsItemProps) {
  return (
    <div className="px-4 py-4 flex items-center justify-between hover:bg-[#F2F2F7] transition-colors border-b border-[#E5E5EA] last:border-0">
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-semibold">{title}</span>
      </div>
      <span className="text-[#8E8E93] text-sm">{value}</span>
    </div>
  );
}

interface SettingsViewProps {
  onResetData: () => void;
}

export function SettingsView({ onResetData }: SettingsViewProps) {
  return (
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
          onClick={onResetData}
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
  );
}
