import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Users, MapPin, Clock, Shield, X, Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Shift {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  securityLevel: string;
  requirements: string[];
  bookingType?: 'private' | 'public';
  staffOnly?: boolean;
   assigned?: {
    name: string;
    avatar?: string;
  };
}

interface SortableShiftProps {
  shift: Shift;
  onUnassign?: () => void;
}

export function SortableShift({ shift, onUnassign }: SortableShiftProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: shift.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white border rounded-lg p-4 cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center">
            <h4 className="font-medium">{shift.title}</h4>
            <div className="flex ml-2 space-x-1">
              {shift.bookingType && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                  shift.bookingType === 'private' 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {shift.bookingType === 'private' ? (
                    <Lock className="w-3 h-3 mr-1" />
                  ) : (
                    <Globe className="w-3 h-3 mr-1" />
                  )}
                  {shift.bookingType}
                </span>
              )}
              {shift.staffOnly && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">
                  <Users className="w-3 h-3 mr-1" />
                  Staff Only
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {shift.location}
          </div>
        </div>
        {shift.assigned && onUnassign && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onUnassign();
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          {shift.time}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Shield className="w-4 h-4 mr-1" />
          {shift.securityLevel}
        </div>
      </div>

      {shift.requirements.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {shift.requirements.map((req, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700"
            >
              {req}
            </span>
          ))}
        </div>
      )}

      {shift.assigned && (
        <div className="mt-3 flex items-center">
          {shift.assigned.avatar ? (
            <img
              src={shift.assigned.avatar}
              alt={shift.assigned.name}
              className="w-6 h-6 rounded-full mr-2"
            />
          ) : (
            <Users className="w-6 h-6 mr-2 text-gray-400" />
          )}
          <span className="text-sm text-gray-700">{shift.assigned.name}</span>
        </div>
      )}
    </div>
  );
}