import React, { useState, useEffect } from 'react';
import { User, Calendar, MapPin, Clock, CheckCircle, XCircle, Clock3 } from 'lucide-react';
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

interface GuardAvailabilitySectionProps {
  onAssignShift?: (guardId: string) => void;
  onEditPreferences?: (guard: Guard) => void;
}

export const GuardAvailabilitySection: React.FC<GuardAvailabilitySectionProps> = ({
  onAssignShift,
  onEditPreferences
}) => {
  const [guards, setGuards] = useState<Guard[]>([]);
  const [filter, setFilter] = useState<'all' | 'available' | 'on_duty' | 'off_duty'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load guards from localStorage when component mounts
  useEffect(() => {
    const loadGuards = () => {
      const storedGuards = localStorage.getItem('guards');
      if (storedGuards) {
        setGuards(JSON.parse(storedGuards));
      }
    };

    loadGuards();

    // Add event listener for guard updates
    window.addEventListener('guardsUpdated', loadGuards);

    return () => {
      window.removeEventListener('guardsUpdated', loadGuards);
    };
  }, []);

  const filteredGuards = guards.filter(guard => {
    // Apply status filter
    if (filter !== 'all' && guard.status !== filter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm && !guard.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const getStatusColor = (status: Guard['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'on_duty':
        return 'bg-blue-100 text-blue-800';
      case 'off_duty':
        return 'bg-gray-100 text-gray-800';
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

  const handleEditPreferences = (guard: Guard) => {
    if (onEditPreferences) {
      onEditPreferences(guard);
    }
  };

  // Count guards by status
  const guardCounts = {
    all: guards.length,
    available: guards.filter(g => g.status === 'available').length,
    on_duty: guards.filter(g => g.status === 'on_duty').length,
    off_duty: guards.filter(g => g.status === 'off_duty').length
  };

  return (
    <div className="space-y-4">
      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex space-x-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({guardCounts.all})
          </Button>
          <Button 
            variant={filter === 'available' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('available')}
            className={filter === 'available' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Available ({guardCounts.available})
          </Button>
          <Button 
            variant={filter === 'on_duty' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('on_duty')}
            className={filter === 'on_duty' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            On Duty ({guardCounts.on_duty})
          </Button>
          <Button 
            variant={filter === 'off_duty' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('off_duty')}
            className={filter === 'off_duty' ? 'bg-gray-600 hover:bg-gray-700' : ''}
          >
            Unavailable ({guardCounts.off_duty})
          </Button>
        </div>
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search guards..."
            className="w-full px-3 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Guards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGuards.map((guard) => (
          <div key={guard.id} className="bg-white rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium">{guard.name}</h3>
                  <p className="text-sm text-gray-500">{guard.email}</p>
                  <div className="flex items-center mt-1">
                    <span className={`flex items-center text-xs px-2 py-1 rounded-full ${getStatusColor(guard.status)}`}>
                      {getStatusIcon(guard.status)}
                      <span className="ml-1 capitalize">{guard.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                {guard.status === 'available' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAssignClick(guard.id)}
                  >
                    Assign
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditPreferences(guard)}
                >
                  Preferences
                </Button>
              </div>
            </div>

            {/* Skills */}
            {guard.skills.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {guard.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Current Location or Next Shift */}
            {guard.status === 'on_duty' && guard.currentLocation && (
              <div className="mt-3 text-xs text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>Current Location: {guard.currentLocation}</span>
                </div>
              </div>
            )}

            {guard.status === 'available' && guard.nextShift && (
              <div className="mt-3 text-xs text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>Next Shift: {guard.nextShift.time} at {guard.nextShift.location}</span>
                </div>
              </div>
            )}

            {/* Availability Timeline */}
            {guard.status === 'available' && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Availability:</p>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Now</span>
                  <span>Next 7 days</span>
                </div>
              </div>
            )}

            {/* Off Duty Until */}
            {guard.status === 'off_duty' && (
              <div className="mt-3 text-xs text-gray-600">
                <div className="flex items-center">
                  <Clock3 className="w-3 h-3 mr-1" />
                  <span>Unavailable until: June 15, 2025</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredGuards.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500 border rounded-lg">
            {searchTerm ? 
              `No guards found matching "${searchTerm}"` : 
              `No ${filter !== 'all' ? filter.replace('_', ' ') : ''} guards available`
            }
          </div>
        )}
      </div>
    </div>
  );
};