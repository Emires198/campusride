import io from 'socket.io-client';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:5000';

class TrackingService {
  constructor() {
    this.socket = null;
  }

  connect(studentId) {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(SOCKET_URL, {
          query: { studentId },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
          console.log('Socket connected:', this.socket.id);
          resolve(this.socket);
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Listen for bus location updates
  onBusLocationUpdate(callback) {
    if (this.socket) {
      this.socket.on('bus_location_update', callback);
    }
  }

  // Listen for booking status updates
  onBookingStatusUpdate(callback) {
    if (this.socket) {
      this.socket.on('booking_status_update', callback);
    }
  }

  // Emit student location
  updateStudentLocation(latitude, longitude) {
    if (this.socket) {
      this.socket.emit('student_location_update', { latitude, longitude });
    }
  }

  // Remove listeners
  removeListener(eventName) {
    if (this.socket) {
      this.socket.off(eventName);
    }
  }
}

export default new TrackingService();
