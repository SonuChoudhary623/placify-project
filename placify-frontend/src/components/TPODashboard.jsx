import { useState, useEffect } from 'react';
import api from '../services/api';

// Professional Components (Same as Student Dashboard)
const MetricCard = ({ title, value, change, icon, color }) => (
  <div style={{
    background: '#fefefeff',
    border: '1px solid #eef1f5ff',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(126, 184, 166, 0.91)',
    transition: 'all 0.2s ease'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 118, 94, 0.85)';
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

const ActivityItem = ({ activity, type }) => (
  <div style={{
    background: '#ffffffff', border: '1px solid #e1e5e9', borderRadius: '8px',
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
      }}>{type === 'student' ? '👤' : '🏢'}</div>
      <div>
        <h5 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0', color: '#1f2937' }}>{activity.title}</h5>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
          {activity.description} • {activity.time}
        </p>
      </div>
    </div>
    <span style={{
      background: '#e2e7f9ff', color: '#3b82f6', padding: '4px 12px',
      borderRadius: '20px', fontSize: '12px', fontWeight: '600'
    }}>
      {activity.status}
    </span>
  </div>
);

function TPODashboard({ user, onViewChange }) {
  const [metrics, setMetrics] = useState({ totalStudents: 250, placedStudents: 189, activeCompanies: 45, upcomingDrives: 8 });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock data for TPO activities
        setActivities([
          { title: 'New Student Registration', description: 'John Doe registered for placements', time: '2 hours ago', status: 'New' },
          { title: 'Company Drive Scheduled', description: 'TechCorp placement drive on Sept 20', time: '1 day ago', status: 'Scheduled' },
          { title: 'Interview Completed', description: 'Sarah Wilson - Frontend Developer', time: '2 days ago', status: 'Completed' },
          { title: 'Offer Letter Generated', description: 'Mike Johnson - Software Engineer', time: '3 days ago', status: 'Success' }
        ]);
        
        // Fetch real data
        const studentsRes = await api.get('/api/tpo/students');
        const studentsData = studentsRes.data.students || [];
        
        setMetrics({
          totalStudents: studentsData.length || 250,
          placedStudents: Math.floor(studentsData.length * 0.76) || 189,
          activeCompanies: 45,
          upcomingDrives: 8
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // UPDATED HANDLE ACTION FUNCTION WITH ALL 5 BUTTONS
  const handleAction = (action) => {
    if (action === 'manage-students') {
      onViewChange && onViewChange('student-filter');
    } else if (action === 'company-relations') {
      onViewChange && onViewChange('company-relations');
    } else if (action === 'schedule-drives') {
      onViewChange && onViewChange('schedule-drives');
    } else if (action === 'analytics-report') {
      onViewChange && onViewChange('tpo-analytics-report');
    } else if (action === 'admin-dashboard') {
      // UPDATED: Changed from 'admin-settings' to 'admin-dashboard'
      onViewChange && onViewChange('tpo-admin-dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#edf0fb', padding: '24px 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Professional Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', fontWeight: '700', color: '#021734ff', margin: '0 0 8px 0'
          }}>
            TPO Dashboard - {user.firstName}
          </h1>
          <p style={{ fontSize: '16px', color: '#4d5668ff', margin: 0 }}>
            Manage campus placements and monitor student progress
          </p>
        </div>

        {/* Metrics Dashboard */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <MetricCard title="Total Students" value={metrics.totalStudents} change={5} icon="👥" color="#3b82f6" />
          <MetricCard title="Students Placed" value={metrics.placedStudents} change={12} icon="🎯" color="#10b981" />
          <MetricCard title="Active Companies" value={metrics.activeCompanies} change={8} icon="🏢" color="#f59e0b" />
          <MetricCard title="Upcoming Drives" value={metrics.upcomingDrives} change={-2} icon="📅" color="#8b5cf6" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px', gap: '32px' }}>
          
          {/* Left Column - TPO Actions - UPDATED WITH ALL 5 BUTTONS */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
              TPO Controls
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '32px' }}>
              <ActionCard icon="👥" title="Manage Students" description="Filter and manage student database" onClick={() => handleAction('manage-students')} primary />
              <ActionCard icon="🏢" title="Company Relations" description="Manage recruiting partnerships" onClick={() => handleAction('company-relations')} primary />
              <ActionCard icon="📅" title="Schedule Drives" description="Plan campus recruitment events" onClick={() => handleAction('schedule-drives')} primary />
              <ActionCard icon="📊" title="Analytics Reports" description="View placement statistics" onClick={() => handleAction('analytics-report')} primary />
              {/* UPDATED: Changed action from 'admin-settings' to 'admin-dashboard' and updated title */}
              <ActionCard icon="⚙️" title="Admin Dashboard" description="System administration & advanced controls" onClick={() => handleAction('admin-dashboard')} primary />
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
            Recent Activities
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
                Loading activities...
              </div>
            ) : activities.length > 0 ? (
              activities.map((activity, i) => (
                <ActivityItem key={i} activity={activity} type={i % 2 === 0 ? 'student' : 'company'} />
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <p>No recent activities</p>
                <button onClick={() => handleAction('manage-students')} style={{
                  background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px',
                  padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                }}>
                  Start Managing
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

export default TPODashboard;
