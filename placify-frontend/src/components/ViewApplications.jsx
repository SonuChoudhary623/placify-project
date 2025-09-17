import { useState, useEffect } from 'react';
import api from '../services/api';

// Professional Components (Same UI as dashboards)
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: '#f59e0b', bg: '#fef3c7', text: 'Under Review' },
    shortlisted: { color: '#10b981', bg: '#dcfce7', text: 'Shortlisted' },
    hired: { color: '#8b5cf6', bg: '#e9d5ff', text: 'Hired' },
    rejected: { color: '#ef4444', bg: '#fee2e2', text: 'Rejected' }
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <span style={{
      background: config.bg, color: config.color, padding: '6px 12px',
      borderRadius: '20px', fontSize: '12px', fontWeight: '600'
    }}>
      {config.text}
    </span>
  );
};

const ApplicationCard = ({ application, onStatusUpdate }) => (
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
      <div>
        <h4 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0', color: '#1f2937' }}>
          {application.jobTitle}
        </h4>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>
          🏢 {application.company} • 📅 Applied: {new Date(application.appliedDate).toLocaleDateString()}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <StatusBadge status={application.status} />
          {application.interviewDate && (
            <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>
              📅 Interview: {new Date(application.interviewDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>Application #{application.id}</div>
      </div>
    </div>
    
    {application.notes && (
      <div style={{
        background: '#f8fafc', border: '1px solid #e1e5e9', borderRadius: '8px',
        padding: '12px', marginTop: '12px'
      }}>
        <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
          <strong>📝 Notes:</strong> {application.notes}
        </p>
      </div>
    )}
    
    {application.skills && (
      <div style={{ marginTop: '12px' }}>
        <strong style={{ fontSize: '12px', color: '#6b7280' }}>Skills:</strong>
        <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
          {application.skills.map((skill, i) => (
            <span key={i} style={{
              background: '#e2e7f9ff', color: '#1f2937', padding: '2px 8px',
              borderRadius: '12px', fontSize: '11px', fontWeight: '500'
            }}>{skill}</span>
          ))}
        </div>
      </div>
    )}
  </div>
);

const StatCard = ({ title, value, color, icon }) => (
  <div style={{
    background: '#e2e7f9ff', border: '1px solid #dceaf8ff', borderRadius: '8px',
    padding: '20px', textAlign: 'center', transition: 'all 0.2s ease'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(65,77,213,0.15)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  }}>
    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
    <h3 style={{ fontSize: '24px', fontWeight: '700', color: color, margin: '0 0 4px 0' }}>{value}</h3>
    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, fontWeight: '500' }}>{title}</p>
  </div>
);

function ViewApplications({ user }) {
  const [applications, setApplications] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, [filterStatus]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/applications/students/${user.id}?status=${filterStatus}&limit=20`);
      
      if (response.data.success) {
        setApplications(response.data.applications);
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Set mock data if API fails
      setApplications([
        {
          id: 1, jobTitle: 'Software Developer', company: 'TechCorp',
          appliedDate: '2025-09-10', status: 'pending', 
          skills: ['JavaScript', 'React', 'Node.js'], notes: 'Application under review'
        },
        {
          id: 2, jobTitle: 'Frontend Developer', company: 'WebSolutions',
          appliedDate: '2025-09-08', status: 'shortlisted', interviewDate: '2025-09-16',
          skills: ['React', 'CSS', 'JavaScript'], notes: 'Selected for technical interview'
        }
      ]);
      setStatistics({ total: 2, pending: 1, shortlisted: 1, hired: 0, rejected: 0 });
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = filterStatus === 'all' ? applications : applications.filter(app => app.status === filterStatus);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#bedbfcff', padding: '24px 0' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#021734ff', margin: '0 0 8px 0' }}>
            My Applications
          </h1>
          <p style={{ fontSize: '16px', color: '#4d5668ff', margin: 0 }}>
            Track your job applications and interview schedules
          </p>
        </div>

        {/* Statistics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '16px', 
          marginBottom: '32px' 
        }}>
          <StatCard title="Total Applied" value={statistics.total || 0} color="#3b82f6" icon="📊" />
          <StatCard title="Under Review" value={statistics.pending || 0} color="#f59e0b" icon="⏳" />
          <StatCard title="Shortlisted" value={statistics.shortlisted || 0} color="#10b981" icon="🎯" />
          <StatCard title="Hired" value={statistics.hired || 0} color="#8b5cf6" icon="🎉" />
        </div>

        {/* Filter Tabs */}
        <div style={{ 
          background: '#e2e7f9ff', 
          border: '1px solid #dceaf8ff', 
          borderRadius: '12px', 
          padding: '20px', 
          marginBottom: '24px' 
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
            Filter Applications
          </h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'All Applications', count: statistics.total },
              { key: 'pending', label: 'Under Review', count: statistics.pending },
              { key: 'shortlisted', label: 'Shortlisted', count: statistics.shortlisted },
              { key: 'hired', label: 'Hired', count: statistics.hired },
              { key: 'rejected', label: 'Rejected', count: statistics.rejected }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key)}
                style={{
                  background: filterStatus === filter.key ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : '#ffffff',
                  color: filterStatus === filter.key ? '#ffffff' : '#374151',
                  border: '1px solid #e1e5e9',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (filterStatus !== filter.key) {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.backgroundColor = '#f8fafc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filterStatus !== filter.key) {
                    e.target.style.borderColor = '#e1e5e9';
                    e.target.style.backgroundColor = '#ffffff';
                  }
                }}
              >
                {filter.label} ({filter.count || 0})
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
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
            Applications ({filteredApps.length})
          </h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
              <div style={{
                width: '32px', height: '32px', border: '3px solid #e1e5e9',
                borderTop: '3px solid #3b82f6', borderRadius: '50%',
                margin: '0 auto 16px', animation: 'spin 1s linear infinite'
              }}></div>
              Loading your applications...
            </div>
          ) : filteredApps.length > 0 ? (
            filteredApps.map(app => (
              <ApplicationCard key={app.id} application={app} />
            ))
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px', 
              color: '#6b7280',
              background: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e1e5e9'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                No applications found
              </h4>
              <p style={{ margin: '0 0 20px 0' }}>
                {filterStatus === 'all' ? 'Start applying to jobs to see your applications here' : `No ${filterStatus} applications`}
              </p>
              <button 
                onClick={() => window.history.back()}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white', border: 'none', borderRadius: '8px',
                  padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                }}
              >
                Browse Jobs
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

export default ViewApplications;
