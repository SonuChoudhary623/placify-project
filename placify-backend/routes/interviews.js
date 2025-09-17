const express = require('express');
const router = express.Router();

// Mock interviews database
let interviews = [
  {
    id: 1, applicationId: 1, candidateId: 'student123', recruiterId: 'recruiter1',
    candidateName: 'Sarah Wilson', jobTitle: 'Frontend Developer', company: 'TechCorp',
    scheduledDate: '2025-09-16', scheduledTime: '10:00 AM', duration: 45,
    mode: 'Video Call', status: 'scheduled', notes: 'Technical + HR rounds',
    interviewLink: 'https://meet.google.com/abc-def-ghi'
  }
];

// GET /api/interviews/recruiter/:recruiterId - Get interviews for recruiter
router.get('/recruiter/:recruiterId', (req, res) => {
  try {
    const { recruiterId } = req.params;
    const { status = 'all', date } = req.query;
    
    let recruiterInterviews = interviews.filter(interview => interview.recruiterId === recruiterId);
    
    if (status !== 'all') {
      recruiterInterviews = recruiterInterviews.filter(interview => interview.status === status);
    }
    
    if (date) {
      recruiterInterviews = recruiterInterviews.filter(interview => interview.scheduledDate === date);
    }
    
    res.json({
      success: true,
      interviews: recruiterInterviews,
      message: 'Interviews fetched successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching interviews' });
  }
});

// POST /api/interviews/schedule - Schedule new interview
router.post('/schedule', (req, res) => {
  try {
    const { 
      applicationId, candidateId, recruiterId, candidateName, 
      jobTitle, company, scheduledDate, scheduledTime, 
      duration, mode, notes 
    } = req.body;
    
    const newInterview = {
      id: interviews.length + 1,
      applicationId, candidateId, recruiterId, candidateName,
      jobTitle, company, scheduledDate, scheduledTime, duration,
      mode, notes: notes || '',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      interviewLink: mode === 'Video Call' ? `https://meet.google.com/${Math.random().toString(36).substring(7)}` : null
    };
    
    interviews.push(newInterview);
    
    // Update application status
    // In real implementation, update applications table
    
    res.status(201).json({
      success: true,
      interview: newInterview,
      message: 'Interview scheduled successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error scheduling interview' });
  }
});

// PUT /api/interviews/:id/status - Update interview status
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback, rating } = req.body;
    
    const interviewIndex = interviews.findIndex(interview => interview.id === parseInt(id));
    
    if (interviewIndex === -1) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }
    
    interviews[interviewIndex] = {
      ...interviews[interviewIndex],
      status,
      feedback: feedback || interviews[interviewIndex].feedback,
      rating: rating || interviews[interviewIndex].rating,
      completedAt: status === 'completed' ? new Date().toISOString() : interviews[interviewIndex].completedAt
    };
    
    res.json({
      success: true,
      interview: interviews[interviewIndex],
      message: 'Interview status updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating interview status' });
  }
});

// GET /api/interviews/student/:studentId - Get interviews for student
router.get('/student/:studentId', (req, res) => {
  try {
    const { studentId } = req.params;
    
    const studentInterviews = interviews.filter(interview => interview.candidateId === studentId);
    
    res.json({
      success: true,
      interviews: studentInterviews,
      message: 'Student interviews fetched successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching student interviews' });
  }
});

module.exports = router;
