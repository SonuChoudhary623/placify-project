const express = require('express');
const router = express.Router();

// Mock campus drives database
let campusDrives = [
  {
    id: 1, company: 'TechCorp Solutions', companyId: 1,
    date: '2025-09-20', time: '10:00', venue: 'Main Auditorium',
    positions: ['Software Engineer', 'Frontend Developer'],
    eligibility: 'CGPA >= 7.0, CSE/IT only',
    registeredStudents: 45, eligibleStudents: 120,
    status: 'scheduled', notes: 'Technical + HR rounds same day',
    createdBy: 'tpo1', createdAt: '2025-09-05'
  },
  {
    id: 2, company: 'WebSolutions Inc', companyId: 2,
    date: '2025-09-18', time: '14:00', venue: 'Seminar Hall A',
    positions: ['UI/UX Designer', 'React Developer'],
    eligibility: 'Portfolio required', notes: 'Design challenge included',
    registeredStudents: 32, eligibleStudents: 85,
    status: 'ongoing', createdBy: 'tpo1', createdAt: '2025-09-01'
  }
];

// GET /api/drives - Get all campus drives
router.get('/', (req, res) => {
  try {
    const { status = 'all', company, date } = req.query;
    
    let filteredDrives = [...campusDrives];
    
    if (status !== 'all') {
      filteredDrives = filteredDrives.filter(drive => drive.status === status);
    }
    
    if (company && company !== 'all') {
      filteredDrives = filteredDrives.filter(drive => 
        drive.company.toLowerCase().includes(company.toLowerCase())
      );
    }
    
    if (date) {
      filteredDrives = filteredDrives.filter(drive => drive.date === date);
    }
    
    // Sort by date (upcoming first)
    filteredDrives.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    res.json({
      success: true,
      drives: filteredDrives,
      totalCount: filteredDrives.length,
      message: 'Campus drives fetched successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching campus drives' });
  }
});

// POST /api/drives - Schedule new campus drive
router.post('/', (req, res) => {
  try {
    const { 
      company, companyId, date, time, venue, positions, 
      eligibility, notes, createdBy 
    } = req.body;
    
    const newDrive = {
      id: campusDrives.length + 1,
      company, companyId, date, time, venue,
      positions: Array.isArray(positions) ? positions : positions.split(',').map(p => p.trim()),
      eligibility: eligibility || 'No specific requirements',
      notes: notes || '',
      registeredStudents: 0,
      eligibleStudents: Math.floor(Math.random() * 100 + 50), // Mock calculation
      status: 'scheduled',
      createdBy: createdBy || 'tpo',
      createdAt: new Date().toISOString()
    };
    
    campusDrives.push(newDrive);
    
    res.status(201).json({
      success: true,
      drive: newDrive,
      message: 'Campus drive scheduled successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error scheduling campus drive' });
  }
});

// PUT /api/drives/:id - Update campus drive
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const driveIndex = campusDrives.findIndex(drive => drive.id === parseInt(id));
    
    if (driveIndex === -1) {
      return res.status(404).json({ success: false, message: 'Campus drive not found' });
    }
    
    campusDrives[driveIndex] = { 
      ...campusDrives[driveIndex], 
      ...req.body, 
      updatedAt: new Date().toISOString() 
    };
    
    res.json({
      success: true,
      drive: campusDrives[driveIndex],
      message: 'Campus drive updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating campus drive' });
  }
});

// PUT /api/drives/:id/status - Update drive status
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const driveIndex = campusDrives.findIndex(drive => drive.id === parseInt(id));
    
    if (driveIndex === -1) {
      return res.status(404).json({ success: false, message: 'Campus drive not found' });
    }
    
    campusDrives[driveIndex].status = status;
    if (notes) campusDrives[driveIndex].notes = notes;
    campusDrives[driveIndex].statusUpdatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      drive: campusDrives[driveIndex],
      message: `Drive status updated to ${status}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating drive status' });
  }
});

// POST /api/drives/:id/register - Student registration for drive
router.post('/:id/register', (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, studentName, department, cgpa } = req.body;
    
    const drive = campusDrives.find(d => d.id === parseInt(id));
    
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Campus drive not found' });
    }
    
    if (drive.status !== 'scheduled') {
      return res.status(400).json({ success: false, message: 'Registration not available for this drive' });
    }
    
    // Update registered count
    drive.registeredStudents += 1;
    
    res.json({
      success: true,
      message: 'Successfully registered for campus drive',
      registrationId: Date.now()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error registering for campus drive' });
  }
});

module.exports = router;
