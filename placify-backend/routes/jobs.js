const express = require('express');
const { getAllJobs, getJobsForStudent } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Test route first (no auth needed)
router.get('/test', (req, res) => {
  res.json({ message: 'Jobs route is working!' });
});

router.get('/', protect, getAllJobs);
router.get('/eligible', protect, getJobsForStudent);

module.exports = router;
