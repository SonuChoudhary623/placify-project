const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');

// Manage students list for TPO
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('firstName lastName email studentProfile')
      .sort({ 'studentProfile.cgpa': -1 });
    res.json({ success: true, count: students.length, students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Approve company partnership
exports.approveCompany = async (req, res) => {
  try {
    const { companyId, approve } = req.body;
    const comp = await Company.findById(companyId);
    comp.partnership.status = approve ? 'active' : 'inactive';
    comp.partnership.approvedBy = req.user.id;
    comp.partnership.approvedAt = new Date();
    await comp.save();
    res.json({ success: true, company: comp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Schedule campus drive
exports.scheduleDrive = async (req, res) => {
  try {
    const { companyId, date, time, venue } = req.body;
    const drive = {
      company: companyId,
      scheduledAt: new Date(`${date}T${time}`),
      venue,
      createdBy: req.user.id
    };
    // Push to company drives array
    await Company.findByIdAndUpdate(companyId, { $push: { campusDrives: drive } });
    res.json({ success: true, drive });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Generate placement analytics report
exports.getPlacementAnalytics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalApplications = await Application.countDocuments();
    const selectedCount = await Application.countDocuments({ status: 'selected' });
    const placementRate = totalStudents > 0 ? (selectedCount / totalStudents * 100).toFixed(2) : 0;

    // Department-wise placement data
    const deptData = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$studentProfile.department', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      analytics: {
        totalStudents,
        totalApplications,
        selectedCount,
        placementRate,
        departmentStats: deptData
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Manage student eligibility and send to recruiter
exports.forwardToRecruiter = async (req, res) => {
  try {
    const { applicationId } = req.body;
    const app = await Application.findById(applicationId);
    if (app.status !== 'tpo-approved') {
      return res.status(400).json({ success: false, message: 'Application not approved yet.' });
    }
    app.status = 'recruiter-review';
    await app.save();
    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllStudents: exports.getAllStudents,
  approveCompany: exports.approveCompany,
  scheduleDrive: exports.scheduleDrive,
  getPlacementAnalytics: exports.getPlacementAnalytics,
  forwardToRecruiter: exports.forwardToRecruiter
};
