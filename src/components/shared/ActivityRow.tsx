import React from 'react';
import { Activity } from 'lucide-react';

interface ActivityRowProps {
  activity: string;
  time: string;
}

export const ActivityRow: React.FC<ActivityRowProps> = ({ activity, time }) => {
  return (
    <div className="flex items-center justify-between py-2 border-b">
      <div className="flex items-center">
        <Activity className="w-4 h-4 mr-2 text-blue-600" />
        <span>{activity}</span>
      </div>
      <span className="text-gray-500 text-sm">{time}</span>
    </div>
  );
};