const express = require('express');
const router = express.Router();

// Mock users database
let users = [
  {
    id: 1, firstName: 'John', lastName: 'Doe', email: 'john@student.edu',
    role: 'student', department: 'CSE', year: 4, cgpa: 8.5,
    status: 'active', registeredDate: '2025-01-15', verified: true
  },
  {
    id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@recruiter.com',
    role: 'recruiter', company: 'TechCorp', status: 'pending',
    registeredDate: '2025-09-10', verified: false
  }
];

// GET /api/users - Get all users with filtering
router.get('/', (req, res) => {
  try {
    const { role = 'all', status = 'all', department, verified } = req.query;
    
    let filteredUsers = [...users];
    
    if (role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    
    if (status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }
    
    if (department && department !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.department === department);
    }
    
    if (verified !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.verified === (verified === 'true'));
    }
    
    res.json({
      success: true,
      users: filteredUsers,
      totalCount: filteredUsers.length,
      statistics: {
        total: users.length,
        students: users.filter(u => u.role === 'student').length,
        recruiters: users.filter(u => u.role === 'recruiter').length,
        tpo: users.filter(u => u.role === 'tpo').length,
        pendingApprovals: users.filter(u => u.status === 'pending').length
      },
      message: 'Users fetched successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

// PUT /api/users/:id/status - Update user status
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    
    const userIndex = users.findIndex(user => user.id === parseInt(id));
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    users[userIndex].status = status;
    users[userIndex].statusReason = reason;
    users[userIndex].statusUpdatedAt = new Date().toISOString();
    
    // If approving recruiter, set verified to true
    if (status === 'active' && users[userIndex].role === 'recruiter') {
      users[userIndex].verified = true;
    }
    
    res.json({
      success: true,
      user: users[userIndex],
      message: `User status updated to ${status}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user status' });
  }
});

// PUT /api/users/:id/verify - Verify user account
router.put('/:id/verify', (req, res) => {
  try {
    const { id } = req.params;
    const { verified, verificationNotes } = req.body;
    
    const userIndex = users.findIndex(user => user.id === parseInt(id));
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    users[userIndex].verified = verified;
    users[userIndex].verificationNotes = verificationNotes;
    users[userIndex].verifiedAt = new Date().toISOString();
    
    res.json({
      success: true,
      user: users[userIndex],
      message: `User verification ${verified ? 'completed' : 'revoked'}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating verification status' });
  }
});

// POST /api/users/bulk-action - Bulk user operations
router.post('/bulk-action', (req, res) => {
  try {
    const { userIds, action, value } = req.body;
    
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid user IDs provided' });
    }
    
    let updatedUsers = [];
    
    userIds.forEach(userId => {
      const userIndex = users.findIndex(user => user.id === parseInt(userId));
      if (userIndex !== -1) {
        switch (action) {
          case 'status':
            users[userIndex].status = value;
            break;
          case 'verify':
            users[userIndex].verified = value;
            break;
          case 'delete':
            users.splice(userIndex, 1);
            break;
        }
        updatedUsers.push(users[userIndex]);
      }
    });
    
    res.json({
      success: true,
      updatedUsers,
      message: `Bulk ${action} operation completed for ${updatedUsers.length} users`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error performing bulk operation' });
  }
});

module.exports = router;
