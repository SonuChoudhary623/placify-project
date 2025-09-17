const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// Student applies for a job
exports.applyForJob = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { jobId } = req.body;

    // Prevent duplicate applications
    const exists = await Application.findOne({ student: studentId, job: jobId });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Already applied.' });
    }

    // Snapshot student profile
    const student = await User.findById(studentId).select('studentProfile');
    const snapshot = {
      resumeUrl: student.studentProfile.resume,
      skills: student.studentProfile.skills,
      cgpa: student.studentProfile.cgpa,
      backlogs: student.studentProfile.backlogs,
      attendance: student.studentProfile.attendance
    };

    const app = new Application({
      student: studentId,
      job: jobId,
      resumeSnapshot: snapshot
    });
    await app.save();

    // Update job analytics
    await Job.findByIdAndUpdate(jobId, { $inc: { totalApplications: 1 } });

    res.json({ success: true, message: 'Application submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// TPO reviews application eligibility
exports.tpoReview = async (req, res) => {
  try {
    const { applicationId, approve, notes } = req.body;
    const app = await Application.findById(applicationId).populate('resumeSnapshot');

    // Eligibility checks
    const job = await Job.findById(app.job);
    const profile = app.resumeSnapshot;
    const eligibility = {
      cgpaMatch: profile.cgpa >= job.eligibilityCriteria.minCGPA,
      attendanceMatch: profile.attendance >= job.eligibilityCriteria.minAttendance,
      backlogMatch: profile.backlogs <= job.eligibilityCriteria.maxBacklogs,
      departmentMatch: job.eligibilityCriteria.allowedDepartments.includes(req.user.studentProfile.department)
    };

    app.eligibilityChecked = eligibility;
    app.tpoNotes = notes || '';
    app.tpoReviewedAt = new Date();
    app.tpoApprovedBy = req.user.id;
    app.status = approve ? 'tpo-approved' : 'tpo-rejected';
    await app.save();

    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Recruiter updates application status
exports.updateStatus = async (req, res) => {
  try {
    const { applicationId, status, feedback, rating } = req.body;
    const app = await Application.findById(applicationId);
    if (!app.canUpdateStatus(status, req.user.role)) {
      return res.status(400).json({ success: false, message: 'Invalid status transition.' });
    }

    // Set fields based on status
    app.status = status;
    if (feedback) app.recruiterNotes = feedback;
    if (rating) app.recruiterRating = rating;
    if (status === 'selected') {
      app.finalDecisionAt = new Date();
      // Update job selectedCandidates count
      await Job.findByIdAndUpdate(app.job, { $inc: { selectedCandidates: 1 } });
    }
    await app.save();

    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Fetch student applications
exports.getStudentApplications = async (req, res) => {
  try {
    const studentId = req.user.id;
    const apps = await Application.find({ student: studentId })
      .populate('job', 'title companyName')
      .sort({ appliedAt: -1 });
    res.json({ success: true, count: apps.length, applications: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Fetch recruiter applications for their jobs
exports.getRecruiterApplications = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobs = await Job.find({ company: recruiterId }).select('_id');
    const jobIds = jobs.map(j => j._id);
    const apps = await Application.find({ job: { $in: jobIds }, status: 'tpo-approved' })
      .populate('student', 'firstName lastName studentProfile')
      .populate('job', 'title')
      .sort({ tpoReviewedAt: -1 });
    res.json({ success: true, count: apps.length, applications: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  applyForJob: exports.applyForJob,
  tpoReview: exports.tpoReview,
  updateStatus: exports.updateStatus,
  getStudentApplications: exports.getStudentApplications,
  getRecruiterApplications: exports.getRecruiterApplications
};
