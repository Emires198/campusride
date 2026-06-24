import apiClient from '../config/api';

const bookingService = {
  // Get available routes
  getRoutes: async () => {
    try {
      const response = await apiClient.get('/routes');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get buses for a route
  getBusesForRoute: async (routeId) => {
    try {
      const response = await apiClient.get(`/routes/${routeId}/buses`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create booking
  createBooking: async (bookingData) => {
    try {
      const response = await apiClient.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get student bookings
  getMyBookings: async (studentId) => {
    try {
      const response = await apiClient.get(`/students/${studentId}/bookings`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    try {
      const response = await apiClient.delete(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default bookingService;
