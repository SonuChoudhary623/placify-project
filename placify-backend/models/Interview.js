const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  // Core references
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
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
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Interview scheduling details
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true // Format: "10:30 AM"
  },
  duration: {
    type: Number,
    default: 30 // minutes
  },
  
  // Interview mode and location
  mode: {
    type: String,
    enum: ['online', 'offline', 'phone'],
    required: true
  },
  location: String, // For offline interviews
  meetingLink: String, // For online interviews
  meetingPassword: String,
  
  // Interview panel
  interviewers: [{
    name: String,
    designation: String,
    email: String
  }],
  
  // Interview rounds
  rounds: [{
    name: { type: String, required: true }, // "Technical", "HR", "Managerial"
    duration: Number, // minutes
    status: { 
      type: String, 
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled'
    },
    score: { type: Number, min: 0, max: 100 },
    feedback: String
  }],
  
  // Overall interview status
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  
  // Results and feedback
  overallScore: { type: Number, min: 0, max: 100 },
  technicalScore: { type: Number, min: 0, max: 100 },
  communicationScore: { type: Number, min: 0, max: 100 },
  culturalFitScore: { type: Number, min: 0, max: 100 },
  
  feedback: String,
  recommendation: {
    type: String,
    enum: ['strong-hire', 'hire', 'maybe', 'no-hire']
  },
  
  // Scheduling metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
  
  // Notification tracking
  studentNotified: { type: Boolean, default: false },
  reminderSent: { type: Boolean, default: false }
});

// Index for efficient queries
interviewSchema.index({ scheduledDate: 1, status: 1 });
interviewSchema.index({ student: 1, status: 1 });

// Method to check if interview is upcoming
interviewSchema.methods.isUpcoming = function() {
  return this.scheduledDate > new Date() && this.status === 'scheduled';
};

// Method to get formatted interview time
interviewSchema.methods.getFormattedDateTime = function() {
  return {
    date: this.scheduledDate.toDateString(),
    time: this.scheduledTime,
    datetime: `${this.scheduledDate.toDateString()} at ${this.scheduledTime}`
  };
};

module.exports = mongoose.model('Interview', interviewSchema);
