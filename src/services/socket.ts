import { io } from 'socket.io-client';

// Create a socket instance
const socket = io('http://localhost:3000', {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Socket event handlers
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

socket.on('error', (error) => {
  console.error('WebSocket error:', error);
});

// Shift-specific events
socket.on('shift:created', (shift) => {
  console.log('New shift created:', shift);
  // Dispatch event to update UI
  window.dispatchEvent(new CustomEvent('shift:created', { detail: shift }));
});

socket.on('shift:updated', (shift) => {
  console.log('Shift updated:', shift);
  // Dispatch event to update UI
  window.dispatchEvent(new CustomEvent('shift:updated', { detail: shift }));
});

socket.on('shift:deleted', (shiftId) => {
  console.log('Shift deleted:', shiftId);
  // Dispatch event to update UI
  window.dispatchEvent(new CustomEvent('shift:deleted', { detail: shiftId }));
});

socket.on('shift:conflict', (conflict) => {
  console.log('Shift conflict detected:', conflict);
  // Dispatch event to show conflict alert
  window.dispatchEvent(new CustomEvent('shift:conflict', { detail: conflict }));
});

// Export socket instance and helper functions
export const socketService = {
  connect() {
    socket.connect();
  },

  disconnect() {
    socket.disconnect();
  },

  emit(event: string, data: any) {
    socket.emit(event, data);
  },

  // Shift-specific methods
  createShift(shiftData: any) {
    socket.emit('shift:create', shiftData);
  },

  updateShift(shiftId: string, shiftData: any) {
    socket.emit('shift:update', { id: shiftId, ...shiftData });
  },

  deleteShift(shiftId: string) {
    socket.emit('shift:delete', shiftId);
  },

  // Subscribe to real-time updates for a specific location
  subscribeToLocation(locationId: string) {
    socket.emit('location:subscribe', locationId);
  },

  // Unsubscribe from location updates
  unsubscribeFromLocation(locationId: string) {
    socket.emit('location:unsubscribe', locationId);
  }
};