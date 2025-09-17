const express = require('express');
const router = express.Router();

// Sample student data
let students = [
  { id: 1, name: 'John Doe', email: 'john@example.com', cgpa: 8.5, attendance: 85, backlogs: 0, department: 'CSE', year: 4 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', cgpa: 7.2, attendance: 90, backlogs: 1, department: 'IT', year: 4 },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', cgpa: 9.1, attendance: 95, backlogs: 0, department: 'CSE', year: 4 },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', cgpa: 6.8, attendance: 78, backlogs: 2, department: 'ECE', year: 3 },
  { id: 5, name: 'Alex Brown', email: 'alex@example.com', cgpa: 7.8, attendance: 88, backlogs: 0, department: 'IT', year: 4 },
  { id: 6, name: 'Lisa Davis', email: 'lisa@example.com', cgpa: 6.2, attendance: 65, backlogs: 3, department: 'CSE', year: 3 }
];

// Get all students with filtering
router.get('/', (req, res) => {
  try {
    const { minCGPA, minAttendance, maxBacklogs, department } = req.query;
    
    let filteredStudents = [...students];
    
    if (minCGPA) {
      filteredStudents = filteredStudents.filter(s => s.cgpa >= parseFloat(minCGPA));
    }
    
    if (minAttendance) {
      filteredStudents = filteredStudents.filter(s => s.attendance >= parseInt(minAttendance));
    }
    
    if (maxBacklogs !== undefined) {
      filteredStudents = filteredStudents.filter(s => s.backlogs <= parseInt(maxBacklogs));
    }
    
    if (department && department !== 'all') {
      filteredStudents = filteredStudents.filter(s => s.department === department);
    }
    
    res.json({
      students: filteredStudents,
      totalStudents: students.length,
      filteredCount: filteredStudents.length,
      filterCriteria: { minCGPA, minAttendance, maxBacklogs, department }
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students' });
  }
});

module.exports = router;
