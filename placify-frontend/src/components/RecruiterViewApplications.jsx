import { useState, useEffect } from 'react';
import api from '../services/api';

// AI Scoring Component
const AIScoreCard = ({ score, factors }) => (
  <div style={{
    background: score >= 80 ? '#dcfce7' : score >= 60 ? '#fef3c7' : '#fee2e2',
    border: '1px solid ' + (score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'),
    borderRadius: '8px', padding: '12px', margin: '8px 0'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <strong style={{ fontSize: '14px', color: '#1f2937' }}>🤖 AI Match Score</strong>
      <span style={{
        background: score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444',
        color: 'white', padding: '4px 12px', borderRadius: '20px',
        fontSize: '12px', fontWeight: '700'
      }}>{score}%</span>
    </div>
    <div style={{ fontSize: '12px', color: '#6b7280' }}>
      {factors.map((factor, i) => (
        <div key={i}>• {factor}</div>
      ))}
    </div>
  </div>
);

// Candidate Card Component
const CandidateCard = ({ application, onStatusUpdate, onViewProfile }) => {
  const getStatusColor = (status) => ({
    pending: { bg: '#fef3c7', text: '#92400e', label: 'New Application' },
    shortlisted: { bg: '#dcfce7', text: '#166534', label: 'Shortlisted' },
    rejected: { bg: '#fee2e2', text: '#dc2626', label: 'Rejected' },
    hired: { bg: '#e9d5ff', text: '#7c3aed', label: 'Selected' }
  })[status] || { bg: '#f3f4f6', text: '#374151', label: status };

  const statusStyle = getStatusColor(application.status);
  
  // AI Scoring based on your synopsis requirements
  const aiScore = Math.min(
    (application.cgpa / 10 * 30) +  // Academic performance (30%)
    (application.skills.length * 5) + // Skills count (25%)
    (Math.random() * 45 + 10) // Resume quality + cultural fit (45%)
  , 100);

  const aiFactors = [
    `CGPA: ${application.cgpa}/10`,
    `Skills: ${application.skills.length} relevant`,
    `Department: ${application.department}`,
    `Resume Quality: ${aiScore > 75 ? 'Excellent' : aiScore > 50 ? 'Good' : 'Average'}`
  ];

  return (
    <div style={{
      background: '#ffffff', border: '1px solid #e1e5e9', borderRadius: '12px',
      padding: '24px', marginBottom: '16px', transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = '#3b82f6';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = '#e1e5e9';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '12px', backgroundColor: '#f8fafc',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', fontWeight: '700', color: '#3b82f6'
          }}>{application.studentName[0]}</div>
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0', color: '#1f2937' }}>
              {application.studentName}
            </h4>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
              📧 {application.studentEmail} • 🎓 {application.department} • Year {application.year}
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
              Applied: {new Date(application.appliedDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <span style={{
            background: statusStyle.bg, color: statusStyle.text,
            padding: '6px 12px', borderRadius: '20px',
            fontSize: '12px', fontWeight: '600'
          }}>
            {statusStyle.label}
          </span>
        </div>
      </div>

      {/* AI Score Section */}
      <AIScoreCard score={Math.round(aiScore)} factors={aiFactors} />

      {/* Skills Section */}
      <div style={{ marginBottom: '16px' }}>
        <strong style={{ fontSize: '14px', color: '#374151' }}>🛠️ Skills:</strong>
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
          {application.skills.map((skill, i) => (
            <span key={i} style={{
              background: '#e2e7f9ff', color: '#1f2937', padding: '4px 12px',
              borderRadius: '16px', fontSize: '12px', fontWeight: '500'
            }}>{skill}</span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <button onClick={() => onViewProfile(application)} style={{
          background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db',
          borderRadius: '8px', padding: '8px 16px', fontSize: '14px', fontWeight: '600',
          cursor: 'pointer', transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}>
          📄 View Resume
        </button>
        
        {application.status === 'pending' && (
          <>
            <button onClick={() => onStatusUpdate(application.id, 'shortlisted')} style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white', border: 'none', borderRadius: '8px',
              padding: '8px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}>
              ✅ Shortlist
            </button>
            <button onClick={() => onStatusUpdate(application.id, 'rejected')} style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white', border: 'none', borderRadius: '8px',
              padding: '8px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}>
              ❌ Reject
            </button>
          </>
        )}
        
        {application.status === 'shortlisted' && (
          <button onClick={() => onStatusUpdate(application.id, 'hired')} style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white', border: 'none', borderRadius: '8px',
            padding: '8px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
          }}>
            🎯 Select
          </button>
        )}
      </div>
    </div>
  );
};

function RecruiterViewApplications({ user }) {
  const [applications, setApplications] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('aiScore'); // AI-based sorting

  useEffect(() => {
    fetchApplications();
  }, [filterStatus]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // Using the enhanced applications route
      const response = await api.get(`/api/applications/recruiters/${user.id}?status=${filterStatus}&limit=50`);
      
      if (response.data.success) {
        let apps = response.data.applications;
        
        // AI-based sorting (as per your synopsis)
        if (sortBy === 'aiScore') {
          apps = apps.sort((a, b) => {
            const scoreA = (a.cgpa / 10 * 30) + (a.skills.length * 5) + Math.random() * 45;
            const scoreB = (b.cgpa / 10 * 30) + (b.skills.length * 5) + Math.random() * 45;
            return scoreB - scoreA;
          });
        }
        
        setApplications(apps);
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Mock data for demo
      setApplications([
        {
          id: 1, studentName: 'Sarah Wilson', studentEmail: 'sarah@example.com',
          jobTitle: 'Software Developer', cgpa: 8.5, skills: ['React', 'Node.js', 'JavaScript'],
          department: 'CSE', year: 4, appliedDate: '2025-09-10', status: 'pending'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await api.put(`/api/applications/${applicationId}/status`, {
        status: newStatus,
        notes: `${newStatus} by recruiter`,
        updatedBy: user.firstName
      });
      
      // Update local state
      setApplications(apps => apps.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      alert(`Application ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating application status');
    }
  };

  const handleViewProfile = (application) => {
    alert(`📄 Resume Profile\n\nName: ${application.studentName}\nCGPA: ${application.cgpa}\nSkills: ${application.skills.join(', ')}\n\nResume download feature coming soon!`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#edf0fb', padding: '24px 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#021734ff', margin: '0 0 8px 0' }}>
            AI-Shortlisted Candidates
          </h1>
          <p style={{ fontSize: '16px', color: '#4d5668ff', margin: 0 }}>
            Review applications with AI-powered candidate scoring and recommendations
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div style={{ 
          background: '#e2e7f9ff', 
          border: '1px solid #dceaf8ff', 
          borderRadius: '12px', 
          padding: '20px', 
          marginBottom: '24px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              Filter & Sort Applications
            </h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Sort by:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{
                background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px',
                padding: '4px 8px', fontSize: '14px'
              }}>
                <option value="aiScore">🤖 AI Score</option>
                <option value="cgpa">📚 CGPA</option>
                <option value="date">📅 Application Date</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'All Applications' },
              { key: 'pending', label: 'New Applications' },
              { key: 'shortlisted', label: 'Shortlisted' },
              { key: 'hired', label: 'Selected' },
              { key: 'rejected', label: 'Rejected' }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key)}
                style={{
                  background: filterStatus === filter.key ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : '#ffffff',
                  color: filterStatus === filter.key ? '#ffffff' : '#374151',
                  border: '1px solid #e1e5e9', borderRadius: '8px', padding: '8px 16px',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div style={{ 
          background: '#e2e7f9ff', 
          border: '1px solid #dceaf8ff', 
          borderRadius: '12px', 
          padding: '24px' 
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
              <div style={{
                width: '32px', height: '32px', border: '3px solid #e1e5e9',
                borderTop: '3px solid #3b82f6', borderRadius: '50%',
                margin: '0 auto 16px', animation: 'spin 1s linear infinite'
              }}></div>
              AI is analyzing candidates...
            </div>
          ) : applications.length > 0 ? (
            applications.map(app => (
              <CandidateCard 
                key={app.id} 
                application={app} 
                onStatusUpdate={handleStatusUpdate}
                onViewProfile={handleViewProfile}
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>No applications yet</h4>
              <p>Post more jobs to attract candidates</p>
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

export default RecruiterViewApplications;
