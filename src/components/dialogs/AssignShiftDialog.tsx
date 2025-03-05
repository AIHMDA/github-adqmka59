import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Shield, User, AlertTriangle, Users, Lock, Globe } from 'lucide-react';

interface Guard {
  id: string;
  name: string;
  status: 'available' | 'on_duty' | 'off_duty';
  skills: string[];
  isStaff?: boolean;
}

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
}

interface AssignShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift: Shift;
  availableGuards: Guard[];
  onAssign: (shiftId: string, guardId: string) => void;
  conflicts?: Array<{
    guardId: string;
    reason: string;
  }>;
}

export const AssignShiftDialog: React.FC<AssignShiftDialogProps> = ({
  open,
  onOpenChange,
  shift,
  availableGuards,
  onAssign,
  conflicts = []
}) => {
  const [selectedGuardId, setSelectedGuardId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredGuards, setFilteredGuards] = useState<Guard[]>([]);

  // Filter guards based on staffOnly setting
  useEffect(() => {
    if (shift.staffOnly) {
      // Only show staff guards for staff-only shifts
      setFilteredGuards(availableGuards.filter(guard => guard.isStaff));
    } else {
      // Show all guards for non-staff-only shifts
      setFilteredGuards(availableGuards);
    }
  }, [shift.staffOnly, availableGuards]);

  const handleAssign = async () => {
    if (!selectedGuardId) return;

    setIsSubmitting(true);
    try {
      await onAssign(shift.id, selectedGuardId);
      onOpenChange(false);
    } catch (error) {
      console.error('Error assigning shift:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getGuardConflict = (guardId: string) => {
    return conflicts.find(c => c.guardId === guardId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Assign Shift</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Shift Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <h3 className="font-medium mb-3">{shift.title}</h3>
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
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {shift.location}
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {shift.date}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {shift.time}
              </div>
              <div className="flex items-center text-gray-600">
                <Shield className="w-4 h-4 mr-2" />
                {shift.securityLevel}
              </div>
            </div>
            {shift.requirements.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Requirements:</p>
                <div className="flex flex-wrap gap-2">
                  {shift.requirements.map((req, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Staff Only Warning */}
          {shift.staffOnly && filteredGuards.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg flex items-start">
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Staff Only Shift</p>
                <p className="text-sm">This shift is marked as "Staff Only" but no staff guards are available. Only guards uploaded by the client can be assigned to this shift.</p>
              </div>
            </div>
          )}

          {/* Available Guards */}
          <div>
            <h3 className="font-medium mb-3">Available Guards</h3>
            {filteredGuards.length > 0 ? (
              <div className="space-y-2">
                {filteredGuards.map((guard) => {
                  const conflict = getGuardConflict(guard.id);
                  
                  return (
                    <div
                      key={guard.id}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border
                        ${conflict ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'}
                        ${selectedGuardId === guard.id ? 'border-blue-500 bg-blue-50' : ''}
                        ${!conflict ? 'cursor-pointer' : ''}
                      `}
                      onClick={() => !conflict && setSelectedGuardId(guard.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium">{guard.name}</p>
                            {guard.isStaff && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">
                                <Users className="w-3 h-3 mr-1" />
                                Staff
                              </span>
                            )}
                          </div>
                          <div className="flex items-center mt-1">
                            {guard.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="text-xs text-gray-500 mr-2"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          {conflict && (
                            <div className="flex items-center mt-1 text-yellow-600 text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {conflict.reason}
                            </div>
                          )}
                        </div>
                      </div>
                      {!conflict && (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          {selectedGuardId === guard.id && (
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 border rounded-lg">
                {shift.staffOnly 
                  ? "No staff guards are available. Only guards uploaded by the client can be assigned to this shift."
                  : "No guards are available for assignment."}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedGuardId || isSubmitting || filteredGuards.length === 0}
            >
              {isSubmitting ? 'Assigning...' : 'Assign Guard'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};