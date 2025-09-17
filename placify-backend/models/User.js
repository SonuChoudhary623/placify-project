const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'tpo', 'recruiter'], required: true },
  
  // Student Profile (only for students)
  studentProfile: {
    rollNumber: String,
    department: { type: String, enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'] },
    course: String,
    year: { type: Number, min: 1, max: 4 },
    graduationYear: Number,
    cgpa: { type: Number, min: 0, max: 10 },
    backlogs: { type: Number, default: 0 },
    attendance: { type: Number, min: 0, max: 100 },
    skills: [String],
    resume: String,
    phoneNumber: String,
    address: String
  },
  
  // Recruiter Profile (only for recruiters)
  recruiterProfile: {
    company: String,
    designation: String,
    experience: String,
    companyWebsite: String,
    phoneNumber: String,
    linkedIn: String
  },
  
  // TPO Profile (only for TPO)
  tpoProfile: {
    department: String,
    designation: String,
    college: String,
    phoneNumber: String
  },
  
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', UserSchema);
