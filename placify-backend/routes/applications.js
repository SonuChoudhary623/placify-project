const express = require('express');
const {
  applyForJob,
  tpoReview,
  updateStatus,
  getStudentApplications,
  getRecruiterApplications
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/apply', protect, applyForJob);
router.put('/tpo-review', protect, tpoReview);
router.put('/update-status', protect, updateStatus);
router.get('/student', protect, getStudentApplications);
router.get('/recruiter', protect, getRecruiterApplications);

module.exports = router;
