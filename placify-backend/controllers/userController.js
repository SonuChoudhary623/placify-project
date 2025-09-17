const User = require('../models/User');
const { formatResponse } = require('../utils/helpers');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(formatResponse(true, 'Users fetched successfully', users));
  } catch (error) {
    res.status(500).json(formatResponse(false, 'Error fetching users'));
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(formatResponse(true, 'Profile fetched successfully', user));
  } catch (error) {
    res.status(500).json(formatResponse(false, 'Error fetching profile'));
  }
};

module.exports = {
  getAllUsers,
  getUserProfile
};
