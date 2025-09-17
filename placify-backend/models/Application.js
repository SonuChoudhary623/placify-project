const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Core references
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  
  // Application status workflow
  status: {
    type: String,
    enum: [
      'pending',           // Student applied
      'tpo-review',        // TPO reviewing eligibility  
      'tpo-approved',      // TPO approved, sent to recruiter
      'tpo-rejected',      // TPO rejected (ineligible)
      'recruiter-review',  // Recruiter reviewing
      'shortlisted',       // Recruiter shortlisted
      'interview-scheduled', // Interview scheduled
      'interview-completed', // Interview done
      'selected',          // Finally selected
      'rejected'           // Rejected by recruiter
    ],
    default: 'pending'
  },
  
  // Timestamps for workflow tracking
  appliedAt: { type: Date, default: Date.now },
  tpoReviewedAt: Date,
  recruiterReviewedAt: Date,
  interviewScheduledAt: Date,
  finalDecisionAt: Date,
  
  // TPO Section
  tpoNotes: String,
  tpoApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  eligibilityChecked: {
    cgpaMatch: Boolean,
    attendanceMatch: Boolean,
    backlogMatch: Boolean,
    departmentMatch: Boolean
  },
  
  // Recruiter Section  
  recruiterNotes: String,
  recruiterRating: { type: Number, min: 1, max: 5 },
  recruiterFeedback: String,
  
  // Interview Details
  interviewDetails: {
    date: Date,
    time: String,
    mode: { type: String, enum: ['online', 'offline', 'phone'] },
    location: String,
    meetingLink: String,
    interviewerName: String,
    duration: { type: Number, default: 30 } // minutes
  },
  
  // Interview Results
  interviewResult: {
    technicalScore: { type: Number, min: 0, max: 100 },
    communicationScore: { type: Number, min: 0, max: 100 },
    overallScore: { type: Number, min: 0, max: 100 },
    feedback: String,
    recommendation: { type: String, enum: ['strong-hire', 'hire', 'no-hire'] }
  },
  
  // Resume data at time of application
  resumeSnapshot: {
    resumeUrl: String,
    skills: [String],
    cgpa: Number,
    backlogs: Number,
    attendance: Number
  }
});

// Compound index for efficient queries
applicationSchema.index({ student: 1, job: 1 }, { unique: true });
applicationSchema.index({ status: 1, appliedAt: -1 });

// Method to check if application can be updated
applicationSchema.methods.canUpdateStatus = function(newStatus, userRole) {
  const statusFlow = {
    'pending': ['tpo-review'],
    'tpo-review': ['tpo-approved', 'tpo-rejected'],
    'tpo-approved': ['recruiter-review'],
    'recruiter-review': ['shortlisted', 'rejected'],
    'shortlisted': ['interview-scheduled', 'selected', 'rejected'],
    'interview-scheduled': ['interview-completed', 'rejected'],
    'interview-completed': ['selected', 'rejected']
  };
  
  return statusFlow[this.status] && statusFlow[this.status].includes(newStatus);
};

module.exports = mongoose.model('Application', applicationSchema);
