const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');

// Get all jobs (with filters)
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .populate('company', 'firstName lastName recruiterProfile')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      count: jobs.length,
      jobs: jobs
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

// Get jobs for specific student
const getJobsForStudent = async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await User.findById(studentId);
    
    if (!student || student.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Student only.'
      });
    }
    
    const jobs = await Job.find({
      isActive: true,
      approvedByTPO: true
    }).populate('company', 'firstName lastName');
    
    res.json({
      success: true,
      count: jobs.length,
      jobs: jobs
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

module.exports = {
  getAllJobs,
  getJobsForStudent
};
