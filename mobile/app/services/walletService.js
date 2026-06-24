import apiClient from '../config/api';

const walletService = {
  // Get wallet balance
  getWallet: async (studentId) => {
    try {
      const response = await apiClient.get(`/students/${studentId}/wallet`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add money to wallet
  addMoney: async (studentId, amount, paymentMethod) => {
    try {
      const response = await apiClient.post(`/students/${studentId}/wallet/add`, {
        amount,
        paymentMethod,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get transaction history
  getTransactionHistory: async (studentId, limit = 50, offset = 0) => {
    try {
      const response = await apiClient.get(
        `/students/${studentId}/wallet/transactions?limit=${limit}&offset=${offset}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default walletService;
