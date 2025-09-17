const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References recruiter user
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  requirements: [String], // Array of requirements
  skillsRequired: [String], // Array of skills
  location: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship'],
    default: 'Full-time'
  },
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'INR' }
  },
  experience: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 5 }
  },
  // Eligibility criteria for students
  eligibilityCriteria: {
    minCGPA: { type: Number, default: 6.0, min: 0, max: 10 },
    maxBacklogs: { type: Number, default: 0 },
    allowedDepartments: [String], // ['CSE', 'IT', 'ECE']
    minAttendance: { type: Number, default: 75 }
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  // Status flags
  isActive: { type: Boolean, default: true },
  approvedByTPO: { type: Boolean, default: false },
  tpoApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Analytics
  totalApplications: { type: Number, default: 0 },
  selectedCandidates: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for application rate
jobSchema.virtual('applicationRate').get(function() {
  return this.totalApplications > 0 ? 
    (this.selectedCandidates / this.totalApplications * 100).toFixed(2) : 0;
});

module.exports = mongoose.model('Job', jobSchema);
