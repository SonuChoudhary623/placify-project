class SmartResumeAnalyzer {
  constructor() {
    // Database of skills to look for
    this.skills = {
      tech: ['javascript', 'python', 'java', 'react', 'node.js', 'mongodb', 'html', 'css', 'sql'],
      soft: ['leadership', 'teamwork', 'communication', 'problem solving', 'creative'],
      tools: ['git', 'docker', 'aws', 'figma']
    };
    console.log('🤖 Smart Resume Analyzer Ready!');
  }

  // Main analysis function - this is the AI magic!
  analyzeResume(resumeText) {
    console.log('🔍 Analyzing resume with AI...');
    
    // Extract different parts of resume
    const skills = this.findSkills(resumeText);
    const experience = this.checkExperience(resumeText);
    const education = this.checkEducation(resumeText);
    const projects = this.countProjects(resumeText);
    
    // Calculate AI score
    const aiScore = this.calculateAIScore(skills, experience, education, projects);
    
    // Generate smart recommendations
    const suggestions = this.generateSuggestions(skills, experience, projects);
    
    // Predict job success
    const prediction = this.predictSuccess(aiScore, skills.total);
    
    return {
      // Skills found
      skillsFound: skills,
      
      // Experience analysis
      experience: {
        hasInternship: experience.internship,
        hasProjects: projects.count > 0,
        experienceLevel: experience.level
      },
      
      // Education details
      education: {
        degree: education.degree,
        cgpa: education.cgpa,
        academicScore: education.score
      },
      
      // AI predictions
      aiScore: aiScore,
      placementProbability: prediction.probability,
      suggestedRoles: prediction.roles,
      salaryRange: prediction.salary,
      
      // Smart recommendations
      recommendations: suggestions,
      
      // Overall analysis
      summary: `Based on AI analysis: ${prediction.summary}`
    };
  }

  // Find skills in resume text
  findSkills(text) {
    const lowerText = text.toLowerCase();
    const found = {
      technical: [],
      soft: [],
      tools: [],
      total: 0
    };

    // Check for technical skills
    this.skills.tech.forEach(skill => {
      if (lowerText.includes(skill)) {
        found.technical.push(skill);
      }
    });

    // Check for soft skills
    this.skills.soft.forEach(skill => {
      if (lowerText.includes(skill)) {
        found.soft.push(skill);
      }
    });

    // Check for tools
    this.skills.tools.forEach(tool => {
      if (lowerText.includes(tool)) {
        found.tools.push(tool);
      }
    });

    found.total = found.technical.length + found.soft.length + found.tools.length;
    return found;
  }

  // Check experience level
  checkExperience(text) {
    const lowerText = text.toLowerCase();
    
    const hasInternship = lowerText.includes('internship') || lowerText.includes('intern');
    const hasWorkExp = lowerText.includes('work experience') || lowerText.includes('job');
    const projectCount = (text.match(/project/gi) || []).length;
    
    let level = 'Fresher';
    if (hasWorkExp) level = 'Experienced';
    else if (hasInternship) level = 'Intern';
    
    return {
      internship: hasInternship,
      work: hasWorkExp,
      level: level
    };
  }

  // Check education details
  checkEducation(text) {
    const lowerText = text.toLowerCase();
    
    // Find degree
    let degree = 'Not specified';
    if (lowerText.includes('b.tech') || lowerText.includes('btech')) degree = 'B.Tech';
    if (lowerText.includes('m.tech') || lowerText.includes('mtech')) degree = 'M.Tech';
    
    // Find CGPA
    const cgpaMatch = text.match(/cgpa:?\s*(\d+\.?\d*)/i);
    const cgpa = cgpaMatch ? parseFloat(cgpaMatch[1]) : null;
    
    // Calculate academic score
    let score = 50; // default
    if (cgpa) {
      score = cgpa >= 8 ? 90 : cgpa >= 7 ? 75 : cgpa >= 6 ? 60 : 40;
    }
    
    return { degree, cgpa, score };
  }

  // Count projects
  countProjects(text) {
    const projectMentions = (text.toLowerCase().match(/project/g) || []).length;
    const githubMentions = text.toLowerCase().includes('github');
    
    return {
      count: Math.min(projectMentions, 5), // Max 5 projects
      hasGithub: githubMentions
    };
  }

  // Calculate AI score (0-100)
  calculateAIScore(skills, experience, education, projects) {
    let score = 0;
    
    // Skills contribute 40%
    score += Math.min(40, skills.total * 4);
    
    // Experience contributes 30%
    if (experience.work) score += 30;
    else if (experience.internship) score += 20;
    else score += 10;
    
    // Education contributes 20%
    score += education.score * 0.2;
    
    // Projects contribute 10%
    score += Math.min(10, projects.count * 2);
    
    return Math.round(Math.min(100, Math.max(20, score)));
  }

  // Predict job success
  predictSuccess(score, skillCount) {
    let probability = Math.min(95, Math.max(15, score));
    
    // Suggest roles based on skills
    let roles = ['Software Developer'];
    if (skillCount >= 5) roles = ['Senior Developer', 'Full Stack Developer'];
    if (skillCount >= 8) roles = ['Tech Lead', 'Senior Engineer'];
    
    // Predict salary
    const baseSalary = 300000 + (skillCount * 50000); // Base 3 LPA + skill bonus
    const salary = {
      min: Math.round(baseSalary * 0.8),
      max: Math.round(baseSalary * 1.4),
      currency: 'INR'
    };
    
    // Generate summary
    let summary = 'Good potential for placement';
    if (probability >= 80) summary = 'Excellent placement prospects!';
    else if (probability >= 60) summary = 'Strong candidate profile';
    else if (probability < 40) summary = 'Needs skill development';
    
    return { probability, roles, salary, summary };
  }

  // Generate smart suggestions
  generateSuggestions(skills, experience, projects) {
    const suggestions = [];
    
    if (skills.total < 5) {
      suggestions.push('Add more technical skills - learn React, Python, or Node.js');
    }
    
    if (!experience.internship && !experience.work) {
      suggestions.push('Gain practical experience through internships or freelance projects');
    }
    
    if (projects.count < 2) {
      suggestions.push('Build more projects to showcase your skills');
    }
    
    if (!projects.hasGithub) {
      suggestions.push('Create a GitHub profile and upload your projects');
    }
    if (suggestions.length === 0) {
      suggestions.push('Great resume! Consider learning advanced technologies like AI/ML');
    }
    return suggestions.slice(0, 4); // Return top 4 suggestions
  }
}

module.exports = new SmartResumeAnalyzer();
