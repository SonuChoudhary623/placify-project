import { useState, useEffect } from 'react';
import api from '../services/api';

// Professional Components
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

const JobItem = ({ job, onApply }) => (
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
      }}>{job.company[0]}</div>
      <div>
        <h5 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0', color: '#1f2937' }}>{job.title}</h5>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
          {job.company} • {job.location} • {job.salary}
        </p>
      </div>
    </div>
    <button onClick={onApply} style={{
      background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px',
      padding: '8px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
      transition: 'background-color 0.2s ease'
    }}
    onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
    onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}>
      Apply
    </button>
  </div>
);

function StudentDashboard({ user, onViewChange }) {
  const [metrics, setMetrics] = useState({ applications: 0, pending: 0, interviews: 0, offers: 0 });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.get('/api/jobs'), api.get(`/api/applications/students/${user.id}`)
        ]);
        const jobData = jobsRes.data.jobs || [];
        const appData = appsRes.data.applications || [];
        
        setJobs(jobData.slice(0, 4));
        setMetrics({
          applications: appData.length,
          pending: appData.filter(a => a.status === 'pending').length,
          interviews: appData.filter(a => a.status === 'shortlisted').length,
          offers: appData.filter(a => a.status === 'hired').length
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const handleAction = (action) => onViewChange && onViewChange(action);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#edf0fb', padding: '24px 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Professional Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', fontWeight: '700', color: '#021734ff', margin: '0 0 8px 0'
          }}>
            Welcome back, {user.firstName}
          </h1>
          <p style={{ fontSize: '16px', color: '#4d5668ff', margin: 0 }}>
            Track your applications and discover new opportunities
          </p>
        </div>

        {/* Metrics Dashboard */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <MetricCard title="Applications Sent" value={metrics.applications} change={12} icon="📊" color="#09234cff" />
          <MetricCard title="Under Review" value={metrics.pending} change={-5} icon="⏳" color="#f59e0b" />
          <MetricCard title="Interviews Scheduled" value={metrics.interviews} change={8} icon="📅" color="#10b981" />
          <MetricCard title="Offers Received" value={metrics.offers} change={25} icon="🎯" color="#8b5cf6" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px', gap: '32px' }}>
          
          {/* Left Column - Actions */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
              Quick Actions
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '32px' }}>
              <ActionCard icon="🤖" title="Resume Analysis" description="Get AI-powered insights on your resume" onClick={() => handleAction('resume-analyzer')} primary />
              <ActionCard icon="🔍" title="Browse Jobs" description="Discover new opportunities" onClick={() => handleAction('browse-jobs')} primary/>
              <ActionCard icon="📋" title="My Applications" description="Track application status" onClick={() => handleAction('view-applications')} primary/>
              <ActionCard icon="🎯" title="Smart Matching" description="AI-curated job recommendations" onClick={() => handleAction('ai-job-matching')} primary/>
              <ActionCard icon="🧠" title="Skill Assessment" description="Practice aptitude tests" onClick={() => handleAction('aptitude-test')} primary/>
            </div>
          </div>
         </div>

          {/* Right Column - Recent Jobs */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
              Recommended Jobs
            </h2>
            <div style={{ 
              background: '#e2e7f9ff', 
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
                  Loading opportunities...
                </div>
              ) : jobs.length > 0 ? (
                jobs.map((job, i) => (
                  <JobItem key={i} job={job} onApply={() => handleAction('browse-jobs')} />
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  <p>No jobs available at the moment</p>
                  <button onClick={() => handleAction('browse-jobs')} style={{
                    background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px',
                    padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                  }}>
                    Explore All Jobs
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

export default StudentDashboard;
