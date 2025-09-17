import { useState, useEffect } from 'react';
import api from '../services/api';

// AI Recommendation Badge
const AIBadge = ({ score, reason }) => (
  <div style={{
    background: score >= 85 ? '#dcfce7' : score >= 70 ? '#fef3c7' : '#fee2e2',
    border: '1px solid ' + (score >= 85 ? '#22c55e' : score >= 70 ? '#f59e0b' : '#ef4444'),
    borderRadius: '16px', padding: '4px 12px', display: 'inline-flex',
    alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600',
    color: score >= 85 ? '#166534' : score >= 70 ? '#92400e' : '#dc2626'
  }}>
    <span>🤖</span>
    <span>{score}% Match</span>
    <span title={reason} style={{ cursor: 'help' }}>ℹ️</span>
  </div>
);

// Filter Component
const FilterPanel = ({ filters, onFilterChange, onReset }) => (
  <div style={{
    background: '#e2e7f9ff', border: '1px solid #dceaf8ff',
    borderRadius: '12px', padding: '20px', marginBottom: '24px'
  }}>
    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
      🔍 Smart Job Filters
    </h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
      
      <div>
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>
          🎯 AI Match Level
        </label>
        <select value={filters.aiMatch} onChange={(e) => onFilterChange('aiMatch', e.target.value)} style={{
          width: '100%', padding: '8px 12px', border: '1px solid #d1d5db',
          borderRadius: '6px', fontSize: '14px', background: '#ffffff'
        }}>
          <option value="all">All Matches</option>
          <option value="high">High Match (80%+)</option>
          <option value="medium">Good Match (60%+)</option>
          <option value="any">Any Match</option>
        </select>
      </div>

      <div>
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>
          📍 Location
        </label>
        <select value={filters.location} onChange={(e) => onFilterChange('location', e.target.value)} style={{
          width: '100%', padding: '8px 12px', border: '1px solid #d1d5db',
          borderRadius: '6px', fontSize: '14px', background: '#ffffff'
        }}>
          <option value="all">All Locations</option>
          <option value="bangalore">Bangalore</option>
          <option value="hyderabad">Hyderabad</option>
          <option value="mumbai">Mumbai</option>
          <option value="remote">Remote</option>
        </select>
      </div>

      <div>
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>
          💰 Salary Range
        </label>
        <select value={filters.salary} onChange={(e) => onFilterChange('salary', e.target.value)} style={{
          width: '100%', padding: '8px 12px', border: '1px solid #d1d5db',
          borderRadius: '6px', fontSize: '14px', background: '#ffffff'
        }}>
          <option value="all">All Salaries</option>
          <option value="0-5">0-5 LPA</option>
          <option value="5-10">5-10 LPA</option>
          <option value="10+">10+ LPA</option>
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'end' }}>
        <button onClick={onReset} style={{
          background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db',
          borderRadius: '6px', padding: '8px 16px', fontSize: '14px', fontWeight: '600',
          cursor: 'pointer', height: 'fit-content'
        }}>
          🔄 Reset
        </button>
      </div>
    </div>
  </div>
);

// Enhanced Job Card
const JobCard = ({ job, onApply, isApplied, aiScore }) => (
  <div style={{
    background: '#ffffff', border: '1px solid #e1e5e9', borderRadius: '12px',
    padding: '24px', marginBottom: '16px', transition: 'all 0.2s ease',
    position: 'relative'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = '#3b82f6';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.1)';
    e.currentTarget.style.transform = 'translateY(-2px)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = '#e1e5e9';
    e.currentTarget.style.boxShadow = 'none';
    e.currentTarget.style.transform = 'translateY(0)';
  }}>
    
    {/* AI Badge */}
    <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
      <AIBadge 
        score={aiScore.score} 
        reason={aiScore.reasons.join(', ')}
      />
    </div>

    {/* Company Logo & Basic Info */}
    <div style={{ display: 'flex', alignItems: 'start', gap: '16px', marginBottom: '16px' }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '12px', backgroundColor: '#f8fafc',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px', fontWeight: '700', color: '#3b82f6'
      }}>{job.company[0]}</div>
      
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
          {job.title}
        </h3>
        <p style={{ fontSize: '16px', fontWeight: '500', color: '#3b82f6', margin: '0 0 8px 0' }}>
          {job.company}
        </p>
        <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
          <span>📍 {job.location}</span>
          <span>💰 {job.salary}</span>
          <span>🕒 {job.type}</span>
        </div>
      </div>
    </div>

    {/* Job Description */}
    <div style={{ marginBottom: '16px' }}>
      <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5', margin: '0 0 12px 0' }}>
        {job.description?.substring(0, 200)}...
      </p>
    </div>

    {/* Skills & Requirements */}
    <div style={{ marginBottom: '20px' }}>
      <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>
        🛠️ Required Skills:
      </h5>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {job.requirements?.split(',').slice(0, 6).map((skill, i) => (
          <span key={i} style={{
            background: '#e2e7f9ff', color: '#1f2937', padding: '4px 12px',
            borderRadius: '16px', fontSize: '12px', fontWeight: '500'
          }}>{skill.trim()}</span>
        ))}
      </div>
    </div>

    {/* AI Insights */}
    <div style={{
      background: '#f8fafc', border: '1px solid #e1e5e9',
      borderRadius: '8px', padding: '12px', marginBottom: '16px'
    }}>
      <h5 style={{ fontSize: '12px', fontWeight: '600', color: '#374151', margin: '0 0 6px 0' }}>
        🤖 AI Insights:
      </h5>
      <div style={{ fontSize: '12px', color: '#6b7280' }}>
        {aiScore.reasons.slice(0, 2).map((reason, i) => (
          <div key={i}>• {reason}</div>
        ))}
      </div>
    </div>

    {/* Action Buttons */}
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <button
        onClick={() => onApply(job)}
        disabled={isApplied}
        style={{
          background: isApplied 
            ? '#f3f4f6' 
            : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: isApplied ? '#6b7280' : 'white',
          border: 'none', borderRadius: '8px', padding: '12px 24px',
          fontSize: '14px', fontWeight: '600', cursor: isApplied ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease', flex: 1
        }}
      >
        {isApplied ? '✅ Applied' : '🚀 Quick Apply'}
      </button>
      
      <button style={{
        background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db',
        borderRadius: '8px', padding: '12px 16px', fontSize: '14px', fontWeight: '600',
        cursor: 'pointer'
      }}>
        📄 Details
      </button>
    </div>
  </div>
);

function JobBrowser({ user }) {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    aiMatch: 'all',
    location: 'all',
    salary: 'all'
  });

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/jobs');
      if (response.data.success) {
        // Add AI scoring to each job
        const jobsWithAI = response.data.jobs.map(job => ({
          ...job,
          aiScore: calculateAIScore(job)
        }));
        setJobs(jobsWithAI);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Mock data with AI scores
      const mockJobs = [
        {
          id: 1, title: 'Frontend Developer', company: 'TechCorp', location: 'Bangalore',
          salary: '6-8 LPA', type: 'Full-time', description: 'Build modern web applications using React',
          requirements: 'React, JavaScript, HTML, CSS, Redux',
          aiScore: { score: 87, reasons: ['React skills match perfectly', 'JavaScript proficiency', 'Portfolio shows relevant projects'] }
        },
        {
          id: 2, title: 'Full Stack Developer', company: 'WebSolutions', location: 'Remote',
          salary: '7-10 LPA', type: 'Full-time', description: 'End-to-end web development',
          requirements: 'Node.js, React, MongoDB, Express.js',
          aiScore: { score: 82, reasons: ['Full stack skills alignment', 'MongoDB experience', 'Node.js projects in resume'] }
        },
        {
          id: 3, title: 'Software Engineer', company: 'InnovateLabs', location: 'Hyderabad',
          salary: '8-12 LPA', type: 'Full-time', description: 'Develop scalable software solutions',
          requirements: 'Python, Django, PostgreSQL, REST APIs',
          aiScore: { score: 65, reasons: ['Python knowledge present', 'Basic backend understanding', 'API development experience'] }
        }
      ];
      setJobs(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const response = await api.get(`/api/applications/students/${user.id}`);
      if (response.data.success) {
        const appliedJobIds = new Set(response.data.applications.map(app => app.jobId));
        setAppliedJobs(appliedJobIds);
      }
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
    }
  };

  const calculateAIScore = (job) => {
    // AI scoring based on user's resume and skills (mock implementation)
    const userSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'HTML', 'CSS']; // From resume analysis
    const jobSkills = job.requirements?.toLowerCase().split(',').map(s => s.trim()) || [];
    
    let score = 50; // Base score
    let reasons = [];
    
    // Skill matching (40 points)
    const matchingSkills = userSkills.filter(skill => 
      jobSkills.some(jobSkill => jobSkill.includes(skill.toLowerCase()))
    );
    score += (matchingSkills.length / userSkills.length) * 40;
    
    if (matchingSkills.length > 0) {
      reasons.push(`${matchingSkills.length} matching skills: ${matchingSkills.slice(0, 3).join(', ')}`);
    }
    
    // Location preference (10 points)
    if (job.location === 'Remote' || job.location === 'Bangalore') {
      score += 10;
      reasons.push('Preferred location match');
    }
    
    return {
      score: Math.min(Math.round(score), 99),
      reasons: reasons.length > 0 ? reasons : ['Basic qualification requirements met', 'Good learning opportunity']
    };
  };

  const applyFilters = () => {
    let filtered = [...jobs];
    
    // AI Match filter
    if (filters.aiMatch === 'high') {
      filtered = filtered.filter(job => job.aiScore.score >= 80);
    } else if (filters.aiMatch === 'medium') {
      filtered = filtered.filter(job => job.aiScore.score >= 60);
    }
    
    // Location filter
    if (filters.location !== 'all') {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Salary filter
    if (filters.salary !== 'all') {
      filtered = filtered.filter(job => {
        const jobSalary = parseInt(job.salary.split('-')[0]);
        const [min, max] = filters.salary.split('-').map(s => parseInt(s) || 999);
        return jobSalary >= min && (max ? jobSalary <= max : true);
      });
    }
    
    // Sort by AI score
    filtered.sort((a, b) => b.aiScore.score - a.aiScore.score);
    
    setFilteredJobs(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ aiMatch: 'all', location: 'all', salary: 'all' });
  };

  const handleApply = async (job) => {
    try {
      await api.post('/api/applications', {
        studentId: user.id,
        studentName: `${user.firstName} ${user.lastName}`,
        studentEmail: user.email,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        recruiterId: 'recruiter1', // Mock recruiter ID
        cgpa: 8.5, // From user profile
        skills: ['JavaScript', 'React', 'Node.js'], // From resume
        department: 'CSE',
        year: 4
      });
      
      setAppliedJobs(prev => new Set([...prev, job.id]));
      alert(`✅ Successfully applied to ${job.title} at ${job.company}!`);
    } catch (error) {
      console.error('Error applying to job:', error);
      alert('Error applying to job. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#bedbfcff', padding: '24px 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#021734ff', margin: '0 0 8px 0' }}>
            🎯 AI-Powered Job Browser
          </h1>
          <p style={{ fontSize: '16px', color: '#4d5668ff', margin: 0 }}>
            Discover personalized job matches with AI recommendations • {filteredJobs.length} opportunities found
          </p>
        </div>

        {/* Filters */}
        <FilterPanel 
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Job Listings */}
        <div style={{ 
          background: '#e2e7f9ff', 
          border: '1px solid #dceaf8ff', 
          borderRadius: '12px', 
          padding: '24px' 
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#6b7280' }}>
              <div style={{
                width: '40px', height: '40px', border: '4px solid #e1e5e9',
                borderTop: '4px solid #3b82f6', borderRadius: '50%',
                margin: '0 auto 20px', animation: 'spin 1s linear infinite'
              }}></div>
              AI is analyzing job matches for you...
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                aiScore={job.aiScore}
                isApplied={appliedJobs.has(job.id)}
                onApply={handleApply}
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '80px', color: '#6b7280' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No jobs match your filters</h3>
              <p style={{ marginBottom: '20px' }}>Try adjusting your search criteria</p>
              <button onClick={handleResetFilters} style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white', border: 'none', borderRadius: '8px',
                padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
              }}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default JobBrowser;
