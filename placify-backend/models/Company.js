const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  // Basic company information
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 3000
  },
  industry: {
    type: String,
    required: true,
    enum: [
      'Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing',
      'Retail', 'Consulting', 'Government', 'Non-profit', 'Other'
    ]
  },
  
  // Company details
  website: String,
  logo: String, // URL to company logo
  founded: Number, // Year founded
  employees: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  },
  
  // Contact information
  contactInfo: {
    email: { type: String, required: true },
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: { type: String, default: 'India' },
      pincode: String
    }
  },
  
  // HR/Recruiter representatives
  recruiters: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    designation: String,
    phone: String,
    isActive: { type: Boolean, default: true }
  }],
  
  // Company metrics and history
  placementHistory: [{
    year: Number,
    totalHires: Number,
    averagePackage: Number,
    highestPackage: Number,
    departments: [String] // Which departments hired from
  }],
  
  // Current status with college
  partnership: {
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'pending', 'blacklisted'],
      default: 'pending'
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // TPO who approved
    approvedAt: Date,
    contractStart: Date,
    contractEnd: Date,
    notes: String
  },
  
  // Analytics
  totalJobsPosted: { type: Number, default: 0 },
  totalApplicationsReceived: { type: Number, default: 0 },
  totalHires: { type: Number, default: 0 },
  averageResponseTime: Number, // in days
  
  // Preferences and requirements
  preferences: {
    preferredDepartments: [String],
    minCGPA: { type: Number, default: 6.0 },
    allowedBacklogs: { type: Number, default: 0 },
    preferredSkills: [String]
  },
  
  // Rating and reviews from students
  rating: {
    overall: { type: Number, default: 0, min: 0, max: 5 },
    workCulture: { type: Number, default: 0, min: 0, max: 5 },
    learningOpportunity: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp
companySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to calculate hiring success rate
companySchema.methods.getHiringRate = function() {
  return this.totalApplicationsReceived > 0 ? 
    (this.totalHires / this.totalApplicationsReceived * 100).toFixed(2) : 0;
};

// Method to add recruiter
companySchema.methods.addRecruiter = function(recruiterData) {
  this.recruiters.push(recruiterData);
  return this.save();
};

module.exports = mongoose.model('Company', companySchema);
