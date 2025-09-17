import { useState, useEffect } from 'react';
import api from '../services/api';

// Score Card Component
const ScoreCard = ({ title, score, maxScore, color, details }) => (
  <div style={{
    background: '#ffffff', border: '1px solid #e1e5e9', borderRadius: '12px',
    padding: '20px', marginBottom: '16px', transition: 'all 0.2s ease'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = color;
    e.currentTarget.style.boxShadow = `0 4px 12px ${color}20`;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = '#e1e5e9';
    e.currentTarget.style.boxShadow = 'none';
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>{title}</h4>
      <span style={{
        background: color, color: 'white', padding: '4px 12px',
        borderRadius: '20px', fontSize: '14px', fontWeight: '700'
      }}>{score}/{maxScore}</span>
    </div>
    <div style={{
      background: '#f3f4f6', borderRadius: '8px', height: '8px',
      overflow: 'hidden', marginBottom: '12px'
    }}>
      <div style={{
        background: color, width: `${(score/maxScore)*100}%`,
        height: '100%', borderRadius: '8px', transition: 'width 0.5s ease'
      }}></div>
    </div>
    <div style={{ fontSize: '12px', color: '#6b7280' }}>
      {details.map((detail, i) => (
        <div key={i} style={{ marginBottom: '4px' }}>• {detail}</div>
      ))}
    </div>
  </div>
);

// Suggestion Card
const SuggestionCard = ({ type, suggestions, icon, color }) => (
  <div style={{
    background: `${color}10`, border: `1px solid ${color}30`,
    borderRadius: '12px', padding: '20px', marginBottom: '16px'
  }}>
    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
      {icon} {type}
    </h4>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {suggestions.map((suggestion, i) => (
        <div key={i} style={{
          background: '#ffffff', border: '1px solid #e1e5e9',
          borderRadius: '8px', padding: '12px', fontSize: '14px', color: '#374151'
        }}>
          <strong>{suggestion.title}:</strong> {suggestion.description}
        </div>
      ))}
    </div>
  </div>
);

// Job Match Card
const JobMatchCard = ({ job, matchScore, reasons }) => (
  <div style={{
    background: '#ffffff', border: '1px solid #e1e5e9',
    borderRadius: '12px', padding: '16px', marginBottom: '12px',
    transition: 'all 0.2s ease'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = '#3b82f6';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.1)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = '#e1e5e9';
    e.currentTarget.style.boxShadow = 'none';
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
      <div>
        <h5 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0', color: '#1f2937' }}>
          {job.title}
        </h5>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          🏢 {job.company} • 💰 {job.salary}
        </p>
      </div>
      <span style={{
        background: matchScore >= 80 ? '#10b981' : matchScore >= 60 ? '#f59e0b' : '#ef4444',
        color: 'white', padding: '4px 8px', borderRadius: '12px',
        fontSize: '12px', fontWeight: '600'
      }}>{matchScore}%</span>
    </div>
    <div style={{ fontSize: '12px', color: '#6b7280' }}>
      {reasons.slice(0, 2).map((reason, i) => (
        <div key={i}>• {reason}</div>
      ))}
    </div>
  </div>
);

function ResumeAnalyzer({ user }) {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [jobMatches, setJobMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      analyzeResume(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      analyzeResume(e.target.files[0]);
    }
  };

  const analyzeResume = async (resumeFile) => {
    setLoading(true);
    try {
      // Mock AI analysis based on your synopsis requirements
      setTimeout(() => {
        const mockAnalysis = {
          overallScore: Math.floor(Math.random() * 25 + 70), // 70-95
          sections: {
            personalInfo: { score: 8, max: 10, details: ['Name and contact present', 'Professional email', 'Missing LinkedIn profile'] },
            experience: { score: 6, max: 10, details: ['2 projects mentioned', 'Good technical depth', 'Add more quantified results'] },
            skills: { score: 7, max: 10, details: ['8 technical skills listed', 'Good programming languages', 'Add frameworks and tools'] },
            education: { score: 9, max: 10, details: ['Academic details complete', 'CGPA mentioned', 'Relevant coursework present'] }
          },
          improvements: [
            { title: 'Add LinkedIn Profile', description: 'Include LinkedIn URL to show professional networking' },
            { title: 'Quantify Achievements', description: 'Add numbers and metrics to project descriptions' },
            { title: 'Include Certifications', description: 'Add relevant technical certifications to boost credibility' }
          ],
          errors: [
            { title: 'Spelling Error', description: 'Check spelling in project description line 15' },
            { title: 'Formatting Issue', description: 'Inconsistent bullet point formatting in skills section' }
          ],
          skillsFound: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'HTML', 'CSS', 'Git']
        };

        setAnalysis(mockAnalysis);
        
        // Store score for dashboard
        localStorage.setItem('resumeScore', mockAnalysis.overallScore);
        
        // Fetch job matches based on skills
        fetchJobMatches(mockAnalysis.skillsFound);
        
        setLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setLoading(false);
    }
  };

  const fetchJobMatches = async (skills) => {
    try {
      // Mock job matching based on your synopsis
      const mockJobs = [
        {
          title: 'Frontend Developer', company: 'TechCorp', salary: '6-8 LPA',
          matchScore: 85, reasons: ['React skills match', 'JavaScript proficiency', 'Good project experience']
        },
        {
          title: 'Full Stack Developer', company: 'WebSolutions', salary: '7-9 LPA',
          matchScore: 78, reasons: ['Both frontend and backend skills', 'Node.js experience', 'Database knowledge']
        },
        {
          title: 'Software Engineer', company: 'InnovateLabs', salary: '8-12 LPA',
          matchScore: 72, reasons: ['Strong programming foundation', 'Multiple languages', 'Problem-solving skills']
        }
      ];
      
      setJobMatches(mockJobs);
    } catch (error) {
      console.error('Error fetching job matches:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e5effbff', padding: '24px 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#021734ff', margin: '0 0 8px 0' }}>
            🤖 AI Resume Assistant
          </h1>
          <p style={{ fontSize: '16px', color: '#4d5668ff', margin: 0 }}>
            ML-powered resume analysis with job matching and optimization suggestions
          </p>
        </div>

        {!analysis ? (
          /* Upload Section */
          <div style={{
            background: '#e2e7f9ff', border: '2px dashed #3b82f6',
            borderRadius: '16px', padding: '60px 40px', textAlign: 'center',
            marginBottom: '32px', transition: 'all 0.3s ease',
            backgroundColor: dragActive ? '#dbeafe' : '#e2e7f9ff'
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}>
            
            {loading ? (
              <div>
                <div style={{
                  width: '48px', height: '48px', border: '4px solid #e1e5e9',
                  borderTop: '4px solid #3b82f6', borderRadius: '50%',
                  margin: '0 auto 24px', animation: 'spin 1s linear infinite'
                }}></div>
                <h3 style={{ color: '#021734ff', marginBottom: '12px' }}>🤖 AI Analyzing Resume...</h3>
                <p style={{ color: '#4d5668ff' }}>
                  ML algorithm parsing content • Detecting skills • Generating insights
                </p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>📄</div>
                <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#021734ff', marginBottom: '12px' }}>
                  Upload Your Resume
                </h3>
                <p style={{ fontSize: '16px', color: '#4d5668ff', marginBottom: '24px' }}>
                  Drag and drop your resume or click to browse files
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white', padding: '12px 32px', borderRadius: '8px',
                  fontSize: '16px', fontWeight: '600', cursor: 'pointer',
                  display: 'inline-block', transition: 'all 0.2s ease'
                }}>
                  Choose File
                </label>
                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '16px' }}>
                  Supports PDF, DOC, DOCX files up to 10MB
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Analysis Results */
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            
            {/* Left Column - Analysis */}
            <div>
              {/* Overall Score */}
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white', borderRadius: '16px', padding: '32px',
                marginBottom: '24px', textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', fontWeight: '800', marginBottom: '8px' }}>
                  {analysis.overallScore}%
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0' }}>
                  AI Resume Score
                </h3>
                <p style={{ opacity: 0.9, margin: 0 }}>
                  {analysis.overallScore >= 85 ? 'Excellent - Interview Ready!' :
                   analysis.overallScore >= 70 ? 'Good - Minor improvements needed' :
                   'Needs improvement - Follow suggestions below'}
                </p>
              </div>

              {/* Section Scores */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#021734ff', marginBottom: '16px' }}>
                  📊 Section Analysis
                </h3>
                <ScoreCard 
                  title="Personal Information" 
                  score={analysis.sections.personalInfo.score}
                  maxScore={analysis.sections.personalInfo.max}
                  color="#3b82f6"
                  details={analysis.sections.personalInfo.details}
                />
                <ScoreCard 
                  title="Experience & Projects" 
                  score={analysis.sections.experience.score}
                  maxScore={analysis.sections.experience.max}
                  color="#10b981"
                  details={analysis.sections.experience.details}
                />
                <ScoreCard 
                  title="Skills & Technologies" 
                  score={analysis.sections.skills.score}
                  maxScore={analysis.sections.skills.max}
                  color="#f59e0b"
                  details={analysis.sections.skills.details}
                />
                <ScoreCard 
                  title="Education & Academics" 
                  score={analysis.sections.education.score}
                  maxScore={analysis.sections.education.max}
                  color="#8b5cf6"
                  details={analysis.sections.education.details}
                />
              </div>
            </div>

            {/* Right Column - Suggestions & Matches */}
            <div>
              {/* Improvements */}
              <SuggestionCard 
                type="💡 Improvement Suggestions"
                suggestions={analysis.improvements}
                icon="✨"
                color="#10b981"
              />

              {/* Errors */}
              <SuggestionCard 
                type="⚠️ Issues Found"
                suggestions={analysis.errors}
                icon="🔍"
                color="#ef4444"
              />

              {/* Job Matches */}
              <div style={{
                background: '#ffffff', border: '1px solid #e1e5e9',
                borderRadius: '12px', padding: '20px'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                  🎯 Job Match Recommendations
                </h4>
                {jobMatches.map((job, i) => (
                  <JobMatchCard key={i} job={job} matchScore={job.matchScore} reasons={job.reasons} />
                ))}
              </div>

              {/* Actions */}
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => {setAnalysis(null); setJobMatches([]);}} style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white', border: 'none', borderRadius: '8px',
                  padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                }}>
                  📄 Analyze Another Resume
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default ResumeAnalyzer;
