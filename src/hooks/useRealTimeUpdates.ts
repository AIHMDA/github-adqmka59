import { useEffect, useCallback } from 'react';
import { socketService } from '../services/socket';

interface ShiftUpdate {
  id: string;
  type: 'created' | 'updated' | 'deleted';
  data?: any;
}

export function useRealTimeUpdates(locationId: string, onUpdate: (update: ShiftUpdate) => void) {
  useEffect(() => {
    // Connect to WebSocket when component mounts
    socketService.connect();

    // Subscribe to location updates
    socketService.subscribeToLocation(locationId);

    // Set up event listeners
    const handleShiftCreated = (event: CustomEvent) => {
      onUpdate({
        id: event.detail.id,
        type: 'created',
        data: event.detail
      });
    };

    const handleShiftUpdated = (event: CustomEvent) => {
      onUpdate({
        id: event.detail.id,
        type: 'updated',
        data: event.detail
      });
    };

    const handleShiftDeleted = (event: CustomEvent) => {
      onUpdate({
        id: event.detail,
        type: 'deleted'
      });
    };

    // Add event listeners
    window.addEventListener('shift:created', handleShiftCreated as EventListener);
    window.addEventListener('shift:updated', handleShiftUpdated as EventListener);
    window.addEventListener('shift:deleted', handleShiftDeleted as EventListener);

    // Cleanup function
    return () => {
      // Unsubscribe from location updates
      socketService.unsubscribeFromLocation(locationId);

      // Remove event listeners
      window.removeEventListener('shift:created', handleShiftCreated as EventListener);
      window.removeEventListener('shift:updated', handleShiftUpdated as EventListener);
      window.removeEventListener('shift:deleted', handleShiftDeleted as EventListener);

      // Disconnect socket
      socketService.disconnect();
    };
  }, [locationId, onUpdate]);

  // Helper function to emit shift updates
  const emitShiftUpdate = useCallback((type: string, data: any) => {
    socketService.emit(`shift:${type}`, data);
  }, []);

  return {
    emitShiftUpdate
  };
}