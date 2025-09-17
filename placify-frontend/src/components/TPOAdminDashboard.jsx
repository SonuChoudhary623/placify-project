import { useState, useEffect } from 'react';
import api from '../services/api';

// User Management Modal
const UserManagementModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('students'); // students, recruiters, permissions

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#ffffff', borderRadius: '12px', padding: '24px',
        maxWidth: '800px', width: '90%', maxHeight: '80vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
            👥 User Management
          </h3>
          <button onClick={onClose} style={{
            background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px',
            padding: '8px 12px', cursor: 'pointer'
          }}>✕</button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
          {[
            { key: 'students', label: 'Student Accounts', count: 247 },
            { key: 'recruiters', label: 'Recruiter Approvals', count: 12 },
            { key: 'permissions', label: 'User Permissions', count: 5 },
            { key: 'verification', label: 'Account Verification', count: 8 }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: activeTab === tab.key ? '#3b82f6' : 'transparent',
                color: activeTab === tab.key ? 'white' : '#6b7280',
                border: 'none', borderRadius: '6px', padding: '8px 16px',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent'
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: '300px' }}>
          {activeTab === 'students' && (
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                📚 Manage Student Accounts
              </h4>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  • View all registered students (247 active accounts)
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  • Activate/Deactivate student accounts
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  • Reset student passwords and login credentials
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  • Bulk import student data from Excel/CSV files
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '16px' }}>
                Full student account management interface coming soon!
              </p>
            </div>
          )}

          {activeTab === 'recruiters' && (
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                🏢 Approve Recruiter Registrations
              </h4>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '8px' }}>
                  • Review pending recruiter applications (12 waiting)
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  • Verify company credentials and contact information
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  • Approve or reject recruiter account requests
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  • Send approval/rejection notifications automatically
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '16px' }}>
                Recruiter approval workflow interface coming soon!
              </p>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                🔐 Set User Permissions
              </h4>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  • Define role-based access controls (Student, TPO, Recruiter)
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  • Set feature permissions for each user type
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  • Manage admin privileges and special access
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  • Create custom permission groups and assignments
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '16px' }}>
                Permission management system coming soon!
              </p>
            </div>
          )}

          {activeTab === 'verification' && (
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                ✅ Account Verification
              </h4>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '8px' }}>
                  • Verify student academic credentials (8 pending)
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  • Confirm email addresses and contact information
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  • Validate company information for recruiters
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  • Send verification reminders and follow-ups
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '16px' }}>
                Account verification tools coming soon!
              </p>
            </div>
          )}
        </div>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button onClick={onClose} style={{
            background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px',
            padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
          }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function TPOAdminDashboard({ user, onViewChange }) {
  const [systemData, setSystemData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showUserManagement, setShowUserManagement] = useState(false);

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    setLoading(true);
    try {
      // Mock system data - only basic stats needed
      setSystemData({
        stats: {
          totalUsers: 1247,
          activeStudents: 1205,
          pendingApprovals: 12,
          systemHealth: 98
        }
      });
    } catch (error) {
      console.error('Error fetching system data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#bedbfcff', padding: '24px 0' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#021734ff', margin: '0 0 8px 0' }}>
            ⚙️ TPO Admin Dashboard
          </h1>
          <p style={{ fontSize: '16px', color: '#4d5668ff', margin: 0 }}>
            User management and administrative controls
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px', color: '#6b7280' }}>
            <div style={{
              width: '40px', height: '40px', border: '4px solid #e1e5e9',
              borderTop: '4px solid #3b82f6', borderRadius: '50%',
              margin: '0 auto 20px', animation: 'spin 1s linear infinite'
            }}></div>
            Loading admin controls...
          </div>
        ) : (
          <>
            {/* System Overview */}
            <div style={{ 
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px', marginBottom: '32px' 
            }}>
              <div style={{ background: '#e2e7f9ff', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6', margin: '0 0 4px 0' }}>
                  {systemData.stats?.totalUsers || 0}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Total Users</p>
              </div>
              <div style={{ background: '#e2e7f9ff', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#10b981', margin: '0 0 4px 0' }}>
                  {systemData.stats?.activeStudents || 0}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Active Students</p>
              </div>
              <div style={{ background: '#e2e7f9ff', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b', margin: '0 0 4px 0' }}>
                  {systemData.stats?.pendingApprovals || 0}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Pending Approvals</p>
              </div>
              <div style={{ background: '#e2e7f9ff', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#8b5cf6', margin: '0 0 4px 0' }}>
                  {systemData.stats?.systemHealth || 0}%
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>System Health</p>
              </div>
            </div>

            {/* User Management - Single Feature */}
            <div style={{
              background: '#e2e7f9ff', border: '1px solid #dceaf8ff',
              borderRadius: '12px', padding: '24px', marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
                🛠️ Administrative Control
              </h3>
              
              {/* Only User Management Card */}
              <div 
                onClick={() => setShowUserManagement(true)}
                style={{
                  background: '#ffffff', border: '1px solid #e1e5e9', borderRadius: '12px',
                  padding: '24px', cursor: 'pointer', transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e1e5e9';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '12px',
                    background: '#3b82f615', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '24px'
                  }}>👥</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0', color: '#1f2937' }}>
                      User Management
                    </h4>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                      Manage student accounts, approve recruiter registrations, set user permissions, and handle account verification
                    </p>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                      <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '12px' }}>
                        247 Students
                      </span>
                      <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '12px' }}>
                        12 Pending Approvals
                      </span>
                      <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '12px' }}>
                        8 Verification Needed
                      </span>
                    </div>
                  </div>
                  <div style={{ color: '#3b82f6', fontSize: '20px' }}>→</div>
                </div>
              </div>
            </div>

            {/* Quick Navigation */}
            <div style={{
              background: '#ffffff', border: '1px solid #e1e5e9', borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                🚀 Quick Navigation
              </h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => onViewChange && onViewChange('student-filter')}
                  style={{
                    background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db',
                    borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                  }}
                >
                  👥 Manage Students
                </button>
                <button 
                  onClick={() => onViewChange && onViewChange('company-relations')}
                  style={{
                    background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db',
                    borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                  }}
                >
                  🏢 Company Relations
                </button>
                <button 
                  onClick={() => onViewChange && onViewChange('tpo-analytics-report')}
                  style={{
                    background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db',
                    borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                  }}
                >
                  📊 View Analytics
                </button>
              </div>
            </div>
          </>
        )}

        {/* User Management Modal */}
        <UserManagementModal
          isOpen={showUserManagement}
          onClose={() => setShowUserManagement(false)}
        />
      </div>

      <style jsx>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default TPOAdminDashboard;
