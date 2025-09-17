import { useState, useEffect } from 'react';
import api from '../services/api';

// Chart Component
const SimpleChart = ({ title, data, type = 'bar' }) => (
  <div style={{
    background: '#ffffff', border: '1px solid #e1e5e9', borderRadius: '12px',
    padding: '20px', marginBottom: '20px'
  }}>
    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
      {title}
    </h4>
    <div style={{ display: 'flex', alignItems: 'end', gap: '8px', height: '120px' }}>
      {data.map((item, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <div style={{
            background: `hsl(${210 + i * 30}, 70%, 50%)`,
            width: '100%', borderRadius: '4px 4px 0 0',
            height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}px`,
            minHeight: '4px', transition: 'all 0.3s ease'
          }}></div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#1f2937', marginTop: '8px' }}>
            {item.value}
          </div>
          <div style={{ fontSize: '10px', color: '#6b7280', textAlign: 'center' }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Metric Card
const MetricCard = ({ title, value, change, icon, color, description }) => (
  <div style={{
    background: '#e2e7f9ff', border: '1px solid #dceaf8ff', borderRadius: '12px',
    padding: '24px', transition: 'all 0.2s ease'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(65,77,213,0.15)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${color}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'
      }}>{icon}</div>
      <span style={{
        fontSize: '12px', fontWeight: '600', padding: '4px 8px', borderRadius: '12px',
        background: change > 0 ? '#dcfce7' : '#fee2e2',
        color: change > 0 ? '#166534' : '#dc2626'
      }}>
        {change > 0 ? '↗' : '↘'} {Math.abs(change)}%
      </span>
    </div>
    <h3 style={{ fontSize: '32px', fontWeight: '800', color: color, margin: '0 0 4px 0' }}>
      {value}
    </h3>
    <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>{title}</p>
    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{description}</p>
  </div>
);

// Skill Gap Analysis
const SkillGapCard = ({ skills }) => (
  <div style={{
    background: '#ffffff', border: '1px solid #e1e5e9', borderRadius: '12px',
    padding: '20px', marginBottom: '20px'
  }}>
    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
      🎯 Skill Gap Analysis
    </h4>
    {skills.map((skill, i) => (
      <div key={i} style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{skill.name}</span>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            {skill.demand}% demand vs {skill.supply}% supply
          </span>
        </div>
        <div style={{ background: '#f3f4f6', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
          <div style={{
            background: skill.gap > 30 ? '#ef4444' : skill.gap > 15 ? '#f59e0b' : '#10b981',
            width: `${skill.gap}%`, height: '100%', borderRadius: '8px',
            transition: 'width 0.5s ease'
          }}></div>
        </div>
        <span style={{ fontSize: '11px', color: '#6b7280' }}>{skill.gap}% skill gap</span>
      </div>
    ))}
  </div>
);

function TPOAnalyticsReport({ user }) {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('current'); // current, last6months, lastyear

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch real data from enhanced applications route
      const response = await api.get('/api/applications/tpo/all?limit=500');
      
      if (response.data.success) {
        setAnalytics(response.data.analytics);
      } else {
        // Fallback mock data based on your synopsis
        setAnalytics({
          totalApplications: 342,
          byStatus: { pending: 45, shortlisted: 89, hired: 156, rejected: 52 },
          byDepartment: { CSE: 156, IT: 89, ECE: 67, EEE: 30 },
          topCompanies: [
            { name: 'TechCorp', applications: 45 },
            { name: 'WebSolutions', applications: 38 },
            { name: 'CloudTech', applications: 32 }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Mock analytics data
      setAnalytics({
        totalApplications: 342,
        byStatus: { pending: 45, shortlisted: 89, hired: 156, rejected: 52 },
        byDepartment: { CSE: 156, IT: 89, ECE: 67, EEE: 30 },
        topCompanies: [
          { name: 'TechCorp', applications: 45 },
          { name: 'WebSolutions', applications: 38 },
          { name: 'CloudTech', applications: 32 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate placement rate
  const placementRate = analytics.byStatus ? 
    Math.round((analytics.byStatus.hired / analytics.totalApplications) * 100) : 0;

  // Mock skill gap data based on your synopsis requirements
  const skillGapData = [
    { name: 'React.js', demand: 85, supply: 45, gap: 40 },
    { name: 'Node.js', demand: 75, supply: 52, gap: 23 },
    { name: 'Python', demand: 90, supply: 68, gap: 22 },
    { name: 'Data Science', demand: 70, supply: 25, gap: 45 },
    { name: 'Cloud Computing', demand: 80, supply: 35, gap: 45 }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#edf0fb', padding: '24px 0' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#021734ff', margin: '0 0 8px 0' }}>
            📊 Placement Analytics & Reports
          </h1>
          <p style={{ fontSize: '16px', color: '#4d5668ff', margin: 0 }}>
            Comprehensive insights for curriculum improvement and placement strategy
          </p>
        </div>

        {/* Time Range Selector */}
        <div style={{ 
          background: '#e2e7f9ff', border: '1px solid #dceaf8ff', borderRadius: '12px',
          padding: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            📈 Analytics Dashboard
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { key: 'current', label: 'Current Batch' },
              { key: 'last6months', label: 'Last 6 Months' },
              { key: 'lastyear', label: 'Last Year' }
            ].map(range => (
              <button
                key={range.key}
                onClick={() => setTimeRange(range.key)}
                style={{
                  background: timeRange === range.key ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : '#ffffff',
                  color: timeRange === range.key ? '#ffffff' : '#374151',
                  border: '1px solid #e1e5e9', borderRadius: '6px', padding: '6px 12px',
                  fontSize: '12px', fontWeight: '600', cursor: 'pointer'
                }}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px', color: '#6b7280' }}>
            <div style={{
              width: '40px', height: '40px', border: '4px solid #e1e5e9',
              borderTop: '4px solid #3b82f6', borderRadius: '50%',
              margin: '0 auto 20px', animation: 'spin 1s linear infinite'
            }}></div>
            Generating analytics reports...
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div style={{ 
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '20px', marginBottom: '32px' 
            }}>
              <MetricCard 
                title="Total Applications" value={analytics.totalApplications || 0} change={12} 
                icon="📊" color="#3b82f6" description="Across all departments"
              />
              <MetricCard 
                title="Placement Rate" value={`${placementRate}%`} change={8} 
                icon="🎯" color="#10b981" description="Students successfully placed"
              />
              <MetricCard 
                title="Active Companies" value="45" change={15} 
                icon="🏢" color="#f59e0b" description="Recruiting partners"
              />
              <MetricCard 
                title="Avg Package" value="₹7.2L" change={18} 
                icon="💰" color="#8b5cf6" description="Annual CTC offered"
              />
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              
              <SimpleChart 
                title="📈 Applications by Status"
                data={[
                  { label: 'Pending', value: analytics.byStatus?.pending || 0 },
                  { label: 'Shortlisted', value: analytics.byStatus?.shortlisted || 0 },
                  { label: 'Hired', value: analytics.byStatus?.hired || 0 },
                  { label: 'Rejected', value: analytics.byStatus?.rejected || 0 }
                ]}
              />
              
              <SimpleChart 
                title="🎓 Department-wise Placement"
                data={[
                  { label: 'CSE', value: analytics.byDepartment?.CSE || 0 },
                  { label: 'IT', value: analytics.byDepartment?.IT || 0 },
                  { label: 'ECE', value: analytics.byDepartment?.ECE || 0 },
                  { label: 'EEE', value: analytics.byDepartment?.EEE || 0 }
                ]}
              />
              
              <SimpleChart 
                title="🏢 Top Recruiting Companies"
                data={analytics.topCompanies?.map(company => ({
                  label: company.name.substring(0, 8),
                  value: company.applications
                })) || []}
              />
            </div>

            {/* Skill Gap Analysis */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
              <SkillGapCard skills={skillGapData} />
              
              <div style={{
                background: '#ffffff', border: '1px solid #e1e5e9', borderRadius: '12px',
                padding: '20px'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                  📋 Quick Actions
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white', border: 'none', borderRadius: '8px',
                    padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                  }}>
                    📊 Export Full Report
                  </button>
                  <button style={{
                    background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db',
                    borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                  }}>
                    📧 Email to Management
                  </button>
                  <button style={{
                    background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db',
                    borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                  }}>
                    🎯 Update Curriculum
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default TPOAnalyticsReport;
