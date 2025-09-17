const express = require('express');
const router = express.Router();

// Mock jobs database
let jobs = [
  {
    id: 1, title: 'Frontend Developer', company: 'TechCorp', recruiterId: 'recruiter1',
    location: 'Bangalore', salary: '6-8 LPA', type: 'Full-time',
    description: 'Build modern web applications using React and JavaScript',
    requirements: 'React, JavaScript, HTML, CSS, Redux',
    postedDate: '2025-09-10', status: 'active', applications: 45
  },
  {
    id: 2, title: 'Full Stack Developer', company: 'WebSolutions', recruiterId: 'recruiter2',
    location: 'Remote', salary: '7-10 LPA', type: 'Full-time',
    description: 'End-to-end web development with modern technologies',
    requirements: 'Node.js, React, MongoDB, Express.js',
    postedDate: '2025-09-08', status: 'active', applications: 32
  }
];

// GET /api/jobs - Get all jobs with filtering and AI scoring
router.get('/', (req, res) => {
  try {
    const { location, salary, skills, aiMatch, studentId } = req.query;
    
    let filteredJobs = [...jobs];
    
    // Apply filters
    if (location && location !== 'all') {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (salary && salary !== 'all') {
      // Filter by salary range
      const [min, max] = salary.split('-').map(s => parseInt(s) || 999);
      filteredJobs = filteredJobs.filter(job => {
        const jobSalary = parseInt(job.salary.split('-')[0]);
        return jobSalary >= min && (max ? jobSalary <= max : true);
      });
    }
    
    // Add AI scoring for each job
    if (studentId) {
      filteredJobs = filteredJobs.map(job => ({
        ...job,
        aiScore: calculateAIScore(job, studentId)
      }));
      
      // Sort by AI score if aiMatch filter is applied
      if (aiMatch && aiMatch !== 'all') {
        const minScore = aiMatch === 'high' ? 80 : aiMatch === 'medium' ? 60 : 0;
        filteredJobs = filteredJobs.filter(job => job.aiScore.score >= minScore);
      }
      
      // Sort by AI score
      filteredJobs.sort((a, b) => b.aiScore.score - a.aiScore.score);
    }
    
    res.json({
      success: true,
      jobs: filteredJobs,
      totalCount: filteredJobs.length,
      message: 'Jobs fetched successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching jobs' });
  }
});

// POST /api/jobs - Create new job posting
router.post('/', (req, res) => {
  try {
    const { title, company, recruiterId, location, salary, type, description, requirements, eligibility } = req.body;
    
    const newJob = {
      id: jobs.length + 1,
      title, company, recruiterId, location, salary, type, description, requirements,
      eligibility: eligibility || 'No specific requirements',
      postedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      applications: 0,
      views: 0
    };
    
    jobs.push(newJob);
    
    res.status(201).json({
      success: true,
      job: newJob,
      message: 'Job posted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating job posting' });
  }
});

// PUT /api/jobs/:id - Update job posting
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const jobIndex = jobs.findIndex(job => job.id === parseInt(id));
    
    if (jobIndex === -1) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    
    jobs[jobIndex] = { ...jobs[jobIndex], ...req.body, updatedAt: new Date().toISOString() };
    
    res.json({
      success: true,
      job: jobs[jobIndex],
      message: 'Job updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating job' });
  }
});

// DELETE /api/jobs/:id - Delete job posting
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const jobIndex = jobs.findIndex(job => job.id === parseInt(id));
    
    if (jobIndex === -1) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    
    jobs.splice(jobIndex, 1);
    
    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting job' });
  }
});

// Helper function to calculate AI score
function calculateAIScore(job, studentId) {
  // Mock AI scoring algorithm
  const mockStudentSkills = ['JavaScript', 'React', 'Node.js', 'Python'];
  const jobSkills = job.requirements.toLowerCase().split(',').map(s => s.trim());
  
  let score = 50; // Base score
  let reasons = [];
  
  // Skill matching
  const matchingSkills = mockStudentSkills.filter(skill => 
    jobSkills.some(jobSkill => jobSkill.includes(skill.toLowerCase()))
  );
  
  score += (matchingSkills.length / mockStudentSkills.length) * 40;
  
  if (matchingSkills.length > 0) {
    reasons.push(`${matchingSkills.length} matching skills: ${matchingSkills.join(', ')}`);
  }
  
  // Location preference
  if (job.location === 'Remote' || job.location === 'Bangalore') {
    score += 10;
    reasons.push('Preferred location match');
  }
  
  return {
    score: Math.min(Math.round(score), 99),
    reasons: reasons.length > 0 ? reasons : ['Basic requirements match', 'Good learning opportunity']
  };
}

module.exports = router;
