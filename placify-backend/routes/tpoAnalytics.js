const express = require('express');
const {
  getAllStudents,
  approveCompany,
  scheduleDrive,
  getPlacementAnalytics,
  forwardToRecruiter
} = require('../controllers/tpoController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/students', protect, getAllStudents);
router.post('/company-approve', protect, approveCompany);
router.post('/schedule-drive', protect, scheduleDrive);
router.get('/analytics', protect, getPlacementAnalytics);
router.post('/forward-recruiter', protect, forwardToRecruiter);

module.exports = router;
