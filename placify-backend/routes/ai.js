const express = require('express');
const router = express.Router();
const smartAnalyzer = require('../ai/mlModel');

// AI Resume Analysis endpoint
router.post('/analyze-resume', async (req, res) => {
  try {
    const { resumeText, jobRequirements } = req.body;
    
    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({ 
        message: 'Resume text is too short for analysis' 
      });
    }

    console.log('📊 Processing resume with AI...');
    
    const analysis = smartAnalyzer.analyzeResume(resumeText);
    
    if (jobRequirements && jobRequirements.length > 20) {
      const jobSkills = smartAnalyzer.findSkills(jobRequirements);
      const matchScore = calculateJobMatch(analysis.skillsFound, jobSkills);
      analysis.jobMatch = {
        score: matchScore.score,
        matched: matchScore.matched,
        missing: matchScore.missing
      };
    }

    console.log('✅ AI Analysis completed successfully');
    
    res.json({
      message: 'Resume analyzed with Advanced AI',
      analysis: analysis,
      timestamp: new Date(),
      aiVersion: 'SmartAnalyzer v1.0'
    });

  } catch (error) {
    console.error('❌ AI Analysis error:', error);
    res.status(500).json({ 
      message: 'AI analysis failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Job recommendation endpoint
router.get('/recommend-jobs', (req, res) => {
  // Implementation here
  res.json({ message: 'Job recommendations coming soon' });
});

// Helper function
function calculateJobMatch(resumeSkills, jobSkills) {
  const resumeSkillsList = [
    ...resumeSkills.technical,
    ...resumeSkills.soft,
    ...resumeSkills.tools
  ];
  
  const jobSkillsList = [
    ...jobSkills.technical,
    ...jobSkills.soft,
    ...jobSkills.tools
  ];
  
  if (jobSkillsList.length === 0) {
    return { score: 0, matched: [], missing: [] };
  }
  
  const matched = jobSkillsList.filter(skill => 
    resumeSkillsList.some(resumeSkill => 
      resumeSkill.toLowerCase() === skill.toLowerCase()
    )
  );
  
  const missing = jobSkillsList.filter(skill => !matched.includes(skill));
  const score = Math.round((matched.length / jobSkillsList.length) * 100);
  
  return { score, matched, missing };
}

module.exports = router;
