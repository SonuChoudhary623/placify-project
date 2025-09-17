const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    cb(null, allowedTypes.includes(file.mimetype));
  }
});

// POST /api/resume/analyze - Analyze uploaded resume
router.post('/analyze', upload.single('resume'), (req, res) => {
  try {
    const { studentId } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ success: false, message: 'No resume file uploaded' });
    }
    
    // Mock AI analysis (in real implementation, use ML/NLP libraries)
    const mockAnalysis = {
      overallScore: Math.floor(Math.random() * 25 + 70), // 70-95
      sections: {
        personalInfo: { 
          score: Math.floor(Math.random() * 3 + 7), 
          max: 10, 
          details: ['Contact information complete', 'Professional email format', 'Add LinkedIn profile'],
          missing: ['LinkedIn URL', 'Portfolio website']
        },
        experience: { 
          score: Math.floor(Math.random() * 4 + 6), 
          max: 10, 
          details: ['Good project descriptions', 'Technical skills evident', 'Add quantifiable results'],
          suggestions: ['Include project metrics', 'Add technology stack details']
        },
        skills: { 
          score: Math.floor(Math.random() * 3 + 7), 
          max: 10, 
          details: ['Relevant technical skills', 'Good programming languages', 'Add frameworks'],
          skillsFound: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL']
        },
        education: { 
          score: 9, 
          max: 10, 
          details: ['Academic details complete', 'CGPA mentioned', 'Coursework relevant']
        }
      },
      improvements: [
        { title: 'Add Projects Section', description: 'Include 2-3 detailed project descriptions with technologies used' },
        { title: 'Quantify Achievements', description: 'Add metrics and numbers to demonstrate impact' },
        { title: 'Include Certifications', description: 'Add relevant technical certifications' }
      ],
      errors: [
        { title: 'Formatting Issues', description: 'Inconsistent bullet points and spacing' },
        { title: 'Length Optimization', description: 'Resume should be 1-2 pages maximum' }
      ],
      jobMatches: [
        { jobTitle: 'Frontend Developer', company: 'TechCorp', matchScore: 85, reasons: ['React skills', 'JavaScript proficiency'] },
        { jobTitle: 'Full Stack Developer', company: 'WebSolutions', matchScore: 78, reasons: ['Full stack skills', 'Node.js experience'] }
      ]
    };
    
    // Save analysis to database (mock)
    const analysisId = Date.now();
    
    res.json({
      success: true,
      analysis: {
        id: analysisId,
        studentId,
        fileName: file.originalname,
        fileSize: file.size,
        analyzedAt: new Date().toISOString(),
        ...mockAnalysis
      },
      message: 'Resume analysis completed successfully'
    });
    
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ success: false, message: 'Error analyzing resume' });
  }
});

// GET /api/resume/history/:studentId - Get analysis history
router.get('/history/:studentId', (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Mock analysis history
    const history = [
      {
        id: 1,
        fileName: 'resume_v1.pdf',
        analyzedAt: '2025-09-10T10:30:00Z',
        overallScore: 72,
        status: 'completed'
      },
      {
        id: 2,
        fileName: 'resume_v2.pdf',
        analyzedAt: '2025-09-12T14:20:00Z',
        overallScore: 85,
        status: 'completed'
      }
    ];
    
    res.json({
      success: true,
      history,
      message: 'Analysis history fetched successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching analysis history' });
  }
});

module.exports = router;
