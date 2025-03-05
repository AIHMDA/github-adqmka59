import React from 'react';
import { User, Shield, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Guard {
  id: string;
  name: string;
  email: string;
  status: 'available' | 'on_duty' | 'off_duty';
  currentLocation?: string;
  skills: string[];
  nextShift?: {
    time: string;
    location: string;
  };
}

interface GuardListProps {
  guards: Guard[];
  onAssignShift?: (guardId: string) => void;
}

export const GuardList: React.FC<GuardListProps> = ({ guards, onAssignShift }) => {
  const getStatusColor = (status: Guard['status']) => {
    switch (status) {
      case 'available':
        return 'text-green-600';
      case 'on_duty':
        return 'text-blue-600';
      case 'off_duty':
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: Guard['status']) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'on_duty':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'off_duty':
        return <XCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleAssignClick = (guardId: string) => {
    if (onAssignShift) {
      onAssignShift(guardId);
    }
  };

  return (
    <div className="space-y-4">
      {guards.map((guard) => (
        <div key={guard.id} className="bg-white rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium">{guard.name}</h3>
                <p className="text-sm text-gray-500">{guard.email}</p>
                <div className="flex items-center mt-1 space-x-4">
                  <span className={`flex items-center text-sm ${getStatusColor(guard.status)}`}>
                    {getStatusIcon(guard.status)}
                    <span className="ml-1 capitalize">{guard.status.replace('_', ' ')}</span>
                  </span>
                  {guard.currentLocation && (
                    <span className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {guard.currentLocation}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {guard.status === 'available' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleAssignClick(guard.id)}
              >
                Assign Shift
              </Button>
            )}
          </div>

          {/* Skills */}
          {guard.skills.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Skills:</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {guard.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Next Shift */}
          {guard.nextShift && (
            <div className="mt-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Next Shift:</span>
                <span>{guard.nextShift.time}</span>
                <span>at</span>
                <span>{guard.nextShift.location}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};