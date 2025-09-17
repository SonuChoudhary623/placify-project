import { useState, useEffect } from 'react';
import api from '../services/api';

// Professional Components (Same UI/UX as Student & TPO Dashboard)
const MetricCard = ({ title, value, change, icon, color }) => (
  <div style={{
    background: '#e2e7f9ff',
    border: '1px solid #dceaf8ff',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
    transition: 'all 0.2s ease'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(65, 77, 213, 0.85)';
    e.currentTarget.style.transform = 'translateY(-2px)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.06)';
    e.currentTarget.style.transform = 'translateY(0)';
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
      <div style={{ 
        width: '48px', height: '48px', borderRadius: '8px', 
        backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px'
      }}>{icon}</div>
      <span style={{ fontSize: '12px', color: change > 0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>
        {change > 0 ? '↗' : '↘'} {Math.abs(change)}%
      </span>
    </div>
    <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>{value}</h3>
    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, fontWeight: '500' }}>{title}</p>
  </div>
);

const ActionCard = ({ icon, title, description, onClick, primary = false }) => (
  <div onClick={onClick} style={{
    background: primary ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : '#ffffff',
    color: primary ? '#ffffff' : '#1f2937',
    border: primary ? 'none' : '1px solid #e1e5e9',
    borderRadius: '12px',
    padding: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: primary ? '0 4px 12px rgba(59,130,246,0.3)' : '0 2px 4px rgba(0,0,0,0.06)'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = primary ? '0 8px 24px rgba(59,130,246,0.4)' : '0 4px 12px rgba(0,0,0,0.1)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = primary ? '0 4px 12px rgba(59,130,246,0.3)' : '0 2px 4px rgba(0,0,0,0.06)';
  }}>
    <div style={{ fontSize: '24px', marginBottom: '16px' }}>{icon}</div>
    <h4 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>{title}</h4>
    <p style={{ fontSize: '14px', opacity: primary ? 0.9 : 0.7, margin: 0, lineHeight: '1.5' }}>{description}</p>
  </div>
);

const CandidateItem = ({ candidate, onAction }) => (
  <div style={{
    background: '#ffffff', border: '1px solid #e1e5e9', borderRadius: '8px',
    padding: '20px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', transition: 'all 0.2s ease'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = '#3b82f6';
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(59,130,246,0.1)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = '#e1e5e9';
    e.currentTarget.style.boxShadow = 'none';
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#f8fafc',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', fontWeight: '600', color: '#3b82f6'
      }}>{candidate.name[0]}</div>
      <div>
        <h5 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0', color: '#1f2937' }}>{candidate.name}</h5>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
          {candidate.position} • {candidate.experience} • CGPA: {candidate.cgpa}
        </p>
      </div>
    </div>
    <div style={{ display: 'flex', gap: '8px' }}>
      <span style={{
        background: candidate.status === 'shortlisted' ? '#dcfce7' : candidate.status === 'applied' ? '#fef3c7' : '#fee2e2',
        color: candidate.status === 'shortlisted' ? '#166534' : candidate.status === 'applied' ? '#92400e' : '#dc2626',
        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'
      }}>
        {candidate.status}
      </span>
      <button onClick={onAction} style={{
        background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px',
        padding: '8px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
        transition: 'background-color 0.2s ease'
      }}
      onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
      onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}>
        Review
      </button>
    </div>
  </div>
);

function RecruiterDashboard({ user, onViewChange }) {
  const [metrics, setMetrics] = useState({ activeJobs: 8, applicationsReceived: 156, interviewsScheduled: 23, selectedCandidates: 12 });
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock candidate data
        setCandidates([
          { name: 'Sarah Wilson', position: 'Frontend Developer', experience: 'Fresher', cgpa: '8.5', status: 'shortlisted' },
          { name: 'Mike Johnson', position: 'Software Engineer', experience: 'Fresher', cgpa: '9.1', status: 'applied' },
          { name: 'Emily Davis', position: 'Full Stack Developer', experience: 'Fresher', cgpa: '8.8', status: 'applied' },
          { name: 'Alex Brown', position: 'Backend Developer', experience: 'Fresher', cgpa: '7.9', status: 'shortlisted' }
        ]);

        // Fetch real jobs data
        const jobsRes = await api.get('/api/jobs');
        const jobsData = jobsRes.data.jobs || [];
        
        setMetrics({
          activeJobs: jobsData.length || 8,
          applicationsReceived: 156,
          interviewsScheduled: 23,
          selectedCandidates: 12
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAction = (action) => {
    if (action === 'post-job') {
       onViewChange && onViewChange('post-job');
    } else if (action === 'view-applications') {
       onViewChange && onViewChange('recruiter-view-applications');
    } else if (action === 'schedule-interviews') {
       onViewChange && onViewChange('schedule-interviews');
    } else if (action === 'candidate-analytics') {
       onViewChange && onViewChange('candidate-analytics');
    } else if (action === 'company-profile') {
       onViewChange && onViewChange('company-profile');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#edf0f9ff', padding: '24px 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Professional Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', fontWeight: '700', color: '#021734ff', margin: '0 0 8px 0'
          }}>
            Recruiter Portal - {user.firstName}
          </h1>
          <p style={{ fontSize: '16px', color: '#4d5668ff', margin: 0 }}>
            Find top talent and manage your recruitment pipeline
          </p>
        </div>

        {/* Metrics Dashboard */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <MetricCard title="Active Job Posts" value={metrics.activeJobs} change={15} icon="📝" color="#3b82f6" />
          <MetricCard title="Applications Received" value={metrics.applicationsReceived} change={28} icon="📋" color="#10b981" />
          <MetricCard title="Interviews Scheduled" value={metrics.interviewsScheduled} change={12} icon="📅" color="#f59e0b" />
          <MetricCard title="Selected Candidates" value={metrics.selectedCandidates} change={-3} icon="🎯" color="#8b5cf6" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px', gap: '32px' }}>
          
          {/* Left Column - Recruiter Actions */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
              Recruitment Tools
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '32px' }}>
              <ActionCard icon="📝" title="Post New Job" description="Create and publish job listings" onClick={() => handleAction('post-job')} primary />
              <ActionCard icon="👀" title="View Applications" description="Review candidate applications" onClick={() => handleAction('view-applications')} primary />
              <ActionCard icon="📅" title="Schedule Interviews" description="Book interview slots with candidates" onClick={() => handleAction('schedule-interviews')} primary />
              <ActionCard icon="📊" title="Candidate Analytics" description="Analyze recruitment metrics" onClick={() => handleAction('candidate-analytics')} primary />
              <ActionCard icon="🏢" title="Company Profile" description="Manage company information" onClick={() => handleAction('company-profile')} primary />
            </div>
          </div>
        </div>

        {/* Top Candidates */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
            Top Candidates
          </h2>
          <div style={{ 
            background: '#b7c1e2ff', 
            border: '1px solid #e1e5e9', 
            borderRadius: '12px', 
            padding: '24px' 
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <div style={{
                  width: '24px', height: '24px', border: '2px solid #e1e5e9',
                  borderTop: '2px solid #3b82f6', borderRadius: '50%',
                  margin: '0 auto 16px', animation: 'spin 1s linear infinite'
                }}></div>
                Loading candidates...
              </div>
            ) : candidates.length > 0 ? (
              candidates.map((candidate, i) => (
                <CandidateItem key={i} candidate={candidate} onAction={() => handleAction('view-applications')} />
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <p>No candidates available at the moment</p>
                <button onClick={() => handleAction('post-job')} style={{
                  background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px',
                  padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                }}>
                  Post a Job
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default RecruiterDashboard;
