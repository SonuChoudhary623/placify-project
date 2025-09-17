// Helper functions for common operations
const formatResponse = (success, message, data = null) => {
  return {
    success,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

const generateTestId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const calculatePercentage = (correct, total) => {
  return Math.round((correct / total) * 100);
};

module.exports = {
  formatResponse,
  generateTestId,
  calculatePercentage
};
