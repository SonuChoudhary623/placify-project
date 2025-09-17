const express = require('express');
const router = express.Router();
const Application = require('../models/Applications');
const User = require('../models/User');
const Job = require('../models/Job');

// STUDENT: Apply for job
router.post('/', async (req, res) => {
  try {
    const { jobId, studentId, studentName, studentEmail, cgpa, skills, department, year } = req.body;
    
    // Check if already applied
    const existingApp = await Application.findOne({ 
      student: studentId, 
      job: jobId 
    });
    
    if (existingApp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already applied for this job' 
      });
    }
    
    // Get job details for eligibility check
    const job = await Job.findById(jobId);
    const student = await User.findById(studentId);
    
    if (!job || !student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job or student not found' 
      });
    }
    
    // TPO Eligibility Check
    const eligible = checkEligibility(student.studentProfile || {}, job.requirements || {});
    
    const newApplication = new Application({
      student: studentId,
      job: jobId,
      recruiter: job.postedBy,
      status: eligible ? 'tpo_review' : 'applied',
      tpoApproval: eligible ? 'approved' : 'pending',
      eligibilityCheck: {
        cgpaRequired: job.requirements?.minCGPA || 6.0,
        cgpaActual: cgpa || student.studentProfile?.cgpa || 0,
        eligible: eligible
      }
    });
    
    await newApplication.save();
    
    res.status(201).json({
      success: true,
      application: newApplication,
      message: eligible ? 'Application submitted and pre-approved' : 'Application submitted for TPO review'
    });
    
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error submitting application: ' + error.message 
    });
  }
});

// STUDENT: Get my applications
router.get('/students/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const applications = await Application.find({ student: studentId })
      .populate('job', 'title company salary location')
      .populate('recruiter', 'firstName lastName recruiterProfile.company')
      .sort({ appliedDate: -1 });
    
    const stats = {
      total: applications.length,
      pending: applications.filter(a => a.status === 'applied').length,
      shortlisted: applications.filter(a => a.status === 'shortlisted').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
      selected: applications.filter(a => a.status === 'selected').length
    };
    
    res.json({
      success: true,
      applications,
      statistics: stats,
      message: 'Student applications fetched successfully'
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching applications: ' + error.message 
    });
  }
});

// RECRUITER: Get applications (only TPO-approved)
router.get('/recruiters/:recruiterId', async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const { status, jobId, limit = 50 } = req.query;
    
    let query = {
      recruiter: recruiterId,
      tpoApproval: 'approved' // Only TPO-approved applications
    };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    if (jobId) {
      query.job = jobId;
    }
    
    const applications = await Application.find(query)
      .populate('student', 'firstName lastName studentProfile')
      .populate('job', 'title company')
      .sort({ appliedDate: -1 })
      .limit(parseInt(limit));
    
    const stats = {
      total: applications.length,
      pending: applications.filter(a => a.status === 'applied').length,
      shortlisted: applications.filter(a => a.status === 'shortlisted').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
      selected: applications.filter(a => a.status === 'selected').length
    };
    
    res.json({
      success: true,
      applications,
      statistics: stats,
      message: 'Recruiter applications fetched successfully'
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching recruiter applications: ' + error.message 
    });
  }
});

// TPO: Get all applications for review
router.get('/tpo/all', async (req, res) => {
  try {
    const { department, status, company, limit = 100 } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      if (status === 'pending_review') {
        query.tpoApproval = 'pending';
      } else {
        query.status = status;
      }
    }
    
    const applications = await Application.find(query)
      .populate('student', 'firstName lastName studentProfile')
      .populate('job', 'title company')
      .populate('recruiter', 'firstName lastName recruiterProfile.company')
      .sort({ appliedDate: -1 })
      .limit(parseInt(limit));
    
    // Filter by department if specified
    let filteredApps = applications;
    if (department && department !== 'all') {
      filteredApps = applications.filter(app => 
        app.student?.studentProfile?.department === department
      );
    }
    
    // Filter by company if specified
    if (company && company !== 'all') {
      filteredApps = filteredApps.filter(app => 
        app.job?.company?.toLowerCase().includes(company.toLowerCase())
      );
    }
    
    const analytics = {
      totalApplications: filteredApps.length,
      byStatus: {
        pending: filteredApps.filter(a => a.tpoApproval === 'pending').length,
        approved: filteredApps.filter(a => a.tpoApproval === 'approved').length,
        rejected: filteredApps.filter(a => a.tpoApproval === 'rejected').length,
        shortlisted: filteredApps.filter(a => a.status === 'shortlisted').length,
        selected: filteredApps.filter(a => a.status === 'selected').length
      },
      byDepartment: {
        CSE: filteredApps.filter(a => a.student?.studentProfile?.department === 'CSE').length,
        IT: filteredApps.filter(a => a.student?.studentProfile?.department === 'IT').length,
        ECE: filteredApps.filter(a => a.student?.studentProfile?.department === 'ECE').length
      }
    };
    
    res.json({
      success: true,
      applications: filteredApps,
      analytics,
      message: 'TPO applications data fetched successfully'
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching TPO applications: ' + error.message 
    });
  }
});

// TPO: Approve/Reject application
router.put('/tpo/:applicationId/review', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { action, feedback, updatedBy } = req.body; // 'approve' or 'reject'
    
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Application not found' 
      });
    }
    
    const oldStatus = application.status;
    
    application.tpoApproval = action === 'approve' ? 'approved' : 'rejected';
    application.tpoFeedback = feedback;
    application.status = action === 'approve' ? 'shortlisted' : 'rejected';
    application.lastUpdated = new Date();
    
    // ✅ FIX: Initialize statusHistory if it doesn't exist
    if (!application.statusHistory) {
      application.statusHistory = [];
    }
    // Add to status history
    application.statusHistory.push({
      from: oldStatus,
      to: application.status,
      updatedBy: updatedBy,
      updatedAt: new Date(),
      notes: feedback || `TPO ${action}d the application`
    });
    
    await application.save();
    
    res.json({ 
      success: true, 
      message: `Application ${action}d successfully`,
      application: application
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating application: ' + error.message 
    });
  }
});

// UPDATE APPLICATION STATUS: Recruiter action
router.put('/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, interviewDate, notes, updatedBy } = req.body;
    
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Application not found' 
      });
    }
    
    const oldStatus = application.status;
    
    application.status = status;
    if (interviewDate) application.interviewDate = interviewDate;
    application.recruiterFeedback = notes;
    application.lastUpdated = new Date();
    
    // Initialize statusHistory if it doesn't exist
    if (!application.statusHistory) {
      application.statusHistory = [];
    }
    // Add to status history
    application.statusHistory.push({
      from: oldStatus,
      to: status,
      updatedBy: updatedBy,
      updatedAt: new Date(),
      notes: notes || `Status updated to ${status}`
    });
    
    await application.save();
    
    res.json({
      success: true,
      application: application,
      message: `Application status updated to ${status}`
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating application status: ' + error.message 
    });
  }
});

// GET SINGLE APPLICATION: Cross-role access
router.get('/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await Application.findById(applicationId)
      .populate('student', 'firstName lastName studentProfile')
      .populate('job', 'title company requirements')
      .populate('recruiter', 'firstName lastName recruiterProfile');
    
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Application not found' 
      });
    }
    
    res.json({
      success: true,
      application,
      message: 'Application details fetched successfully'
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching application details: ' + error.message 
    });
  }
});

// Eligibility Check Function
function checkEligibility(studentProfile, jobRequirements) {
  const cgpaOK = (studentProfile.cgpa || 0) >= (jobRequirements.minCGPA || 6.0);
  const backlogsOK = (studentProfile.backlogs || 0) <= (jobRequirements.maxBacklogs || 0);
  const attendanceOK = (studentProfile.attendance || 0) >= (jobRequirements.minAttendance || 75);
  
  return cgpaOK && backlogsOK && attendanceOK;
}

module.exports = router;
