import { useState, useEffect } from 'react';
import api from '../services/api';

function AIJobMatching({ user }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState({});

  useEffect(() => {
    fetchAIMatches();
  }, []);

  const fetchAIMatches = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/ai/job-matching', {
        studentId: user.id,
        preferences: {}
      });
      
      setMatches(response.data.matches);
      setStudentProfile(response.data.studentProfile);
    } catch (error) {
      console.error('Error fetching AI matches:', error);
      alert('Error loading AI job matches: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyJob = async (jobId) => {
    try {
      await api.post(`/api/jobs/${jobId}/apply`, {
        studentId: user.id,
        studentName: `${user.firstName} ${user.lastName}`
      });
      alert('Application submitted successfully!');
    } catch (error) {
      alert('Error applying: ' + (error.response?.data?.message || error.message));
    }
  };

  const getMatchColor = (score) => {
    if (score >= 70) return '#10b981';
    if (score >= 50) return '#f59e0b'; 
    if (score >= 30) return '#ef4444';
    return '#6b7280';
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>🤖 AI is analyzing job matches for you...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>🎯 AI Job Matching</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Our AI analyzed {matches.length} jobs and found your best matches based on skills, location, and preferences.
      </p>

      {/* Student Profile Summary */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>👤 Your Profile Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <strong>🛠️ Skills:</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {studentProfile.skills?.map((skill, index) => (
                <span key={index} style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  borderRadius: '12px',
                  fontSize: '0.8rem'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <strong>📍 Preferred Locations:</strong>
            <p style={{ margin: '0.5rem 0 0 0' }}>{studentProfile.preferredLocations?.join(', ')}</p>
          </div>
          <div>
            <strong>💰 Expected Salary:</strong>
            <p style={{ margin: '0.5rem 0 0 0' }}>{studentProfile.expectedSalary}</p>
          </div>
        </div>
      </div>

      {/* AI Matches */}
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>🤖 AI Recommended Jobs ({matches.length})</h3>
        
        {matches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <p>No job matches found. Try updating your profile or check back later.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {matches.map((match, index) => (
              <div
                key={match.job.id}
                style={{
                  padding: '1.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb'
                }}
              >
                {/* Match Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        #{index + 1} MATCH
                      </span>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        backgroundColor: getMatchColor(match.matchScore),
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}>
                        <span>🎯</span>
                        <span>{match.matchScore}% Match</span>
                      </div>
                    </div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>
                      {match.job.title}
                    </h4>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#3b82f6', fontWeight: 'bold' }}>
                      {match.job.company}
                    </p>
                    <p style={{ margin: 0, color: '#6b7280' }}>
                      📍 {match.job.location} • 💰 {match.job.salary}
                    </p>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      backgroundColor: match.matchScore >= 70 ? '#dcfce7' : '#fef3c7',
                      color: match.matchScore >= 70 ? '#166534' : '#92400e',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      marginBottom: '0.5rem'
                    }}>
                      {match.recommendation}
                    </div>
                  </div>
                </div>

                {/* Match Reasons */}
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ color: '#374151', fontSize: '0.9rem' }}>🤖 AI Analysis:</strong>
                  <ul style={{ margin: '0.5rem 0 0 1.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
                    {match.matchReasons.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                </div>

                {/* Job Description Preview */}
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ color: '#374151', fontSize: '0.9rem' }}>📝 Description:</strong>
                  <p style={{ margin: '0.5rem 0', color: '#6b7280', fontSize: '0.9rem' }}>
                    {match.job.description?.substring(0, 200)}...
                  </p>
                </div>

                {/* Action Button */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    className="btn"
                    onClick={() => handleApplyJob(match.job.id)}
                    style={{ 
                      backgroundColor: getMatchColor(match.matchScore),
                      padding: '0.75rem 1.5rem'
                    }}
                  >
                    🚀 Apply Now
                  </button>
                  <button 
                    className="btn"
                    style={{ 
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      padding: '0.75rem 1.5rem'
                    }}
                    onClick={() => alert('Job details will be shown here')}
                  >
                    📄 View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AIJobMatching;
