const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  requirements: {
    minCGPA: { type: Number, default: 6.0 },
    maxBacklogs: { type: Number, default: 0 },
    minAttendance: { type: Number, default: 75 },
    skills: [String],
    experience: String,
    course: [String] // ['BTech', 'MTech', etc]
  },
  salary: String,
  location: String,
  jobType: { type: String, enum: ['full-time', 'part-time', 'internship'] },
  applicationDeadline: Date,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postedDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Job', jobSchema);
