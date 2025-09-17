import { useState, useEffect } from 'react';
import api from '../services/api';

// Drive Card Component
const DriveCard = ({ drive, onEdit, onCancel, onViewDetails }) => {
  const getStatusStyle = (status) => ({
    scheduled: { bg: '#dbeafe', color: '#1d4ed8', label: '📅 Scheduled' },
    ongoing: { bg: '#dcfce7', color: '#166534', label: '🔄 Ongoing' },
    completed: { bg: '#f3e8ff', color: '#7c3aed', label: '✅ Completed' },
    cancelled: { bg: '#fee2e2', color: '#dc2626', label: '❌ Cancelled' }
  })[status] || { bg: '#f3f4f6', color: '#374151', label: status };

  const statusStyle = getStatusStyle(drive.status);

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
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              🏢 {drive.company}
            </h3>
            <span style={{
              background: statusStyle.bg, color: statusStyle.color,
              padding: '4px 12px', borderRadius: '20px',
              fontSize: '12px', fontWeight: '600'
            }}>
              {statusStyle.label}
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>📅 Date & Time</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                {drive.date} at {drive.time}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>📍 Venue</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                {drive.venue}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6', margin: 0 }}>
                {drive.positions.length}
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Job Positions</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', margin: 0 }}>
                {drive.registeredStudents}
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Registered</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', margin: 0 }}>
                {drive.eligibleStudents}
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Eligible</p>
            </div>
          </div>
          
          {/* Job Positions */}
          <div>
            <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', margin: '0 0 4px 0' }}>Positions:</p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {drive.positions.map((position, i) => (
                <span key={i} style={{
                  background: '#e2e7f9ff', color: '#1f2937', padding: '4px 12px',
                  borderRadius: '16px', fontSize: '12px', fontWeight: '500'
                }}>{position}</span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
          <button onClick={() => onViewDetails(drive)} style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white', border: 'none', borderRadius: '6px',
            padding: '8px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
          }}>
            📊 Details
          </button>
          
          {drive.status === 'scheduled' && (
            <>
              <button onClick={() => onEdit(drive)} style={{
                background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db',
                borderRadius: '6px', padding: '8px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
              }}>
                ✏️ Edit
              </button>
              <button onClick={() => onCancel(drive)} style={{
                background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca',
                borderRadius: '6px', padding: '8px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
              }}>
                ❌ Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Add Drive Modal
const AddDriveModal = ({ isOpen, onClose, onAdd, companies }) => {
  const [formData, setFormData] = useState({
    company: '', date: '', time: '', venue: '', positions: '', eligibility: '', notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDrive = {
      id: Date.now(),
      ...formData,
      positions: formData.positions.split(',').map(p => p.trim()),
      status: 'scheduled',
      registeredStudents: 0,
      eligibleStudents: Math.floor(Math.random() * 150 + 50),
      createdAt: new Date().toISOString()
    };
    
    onAdd(newDrive);
    setFormData({ company: '', date: '', time: '', venue: '', positions: '', eligibility: '', notes: '' });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#ffffff', borderRadius: '12px', padding: '24px',
        maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 20px 0' }}>
          📅 Schedule New Campus Drive
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
                Company *
              </label>
              <select
                value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})}
                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                required
              >
                <option value="">Select Company</option>
                {companies.map(company => (
                  <option key={company.id} value={company.name}>{company.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
                Venue *
              </label>
              <select
                value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})}
                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                required
              >
                <option value="">Select Venue</option>
                <option value="Main Auditorium">Main Auditorium</option>
                <option value="Seminar Hall A">Seminar Hall A</option>
                <option value="Seminar Hall B">Seminar Hall B</option>
                <option value="Virtual/Online">Virtual/Online</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
                Date *
              </label>
              <input
                type="date" required min={new Date().toISOString().split('T')[0]}
                value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
              />
            </div>
            
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
                Time *
              </label>
              <input
                type="time" required
                value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}
                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
              Job Positions * (comma separated)
            </label>
            <input
              type="text" placeholder="e.g., Software Engineer, Frontend Developer, Data Analyst" required
              value={formData.positions} onChange={(e) => setFormData({...formData, positions: e.target.value})}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
              Eligibility Criteria
            </label>
            <input
              type="text" placeholder="e.g., CGPA >= 7.0, No backlogs, CSE/IT only"
              value={formData.eligibility} onChange={(e) => setFormData({...formData, eligibility: e.target.value})}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
              Additional Notes
            </label>
            <textarea
              rows="3" placeholder="Any special instructions or requirements..."
              value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', resize: 'vertical' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white', border: 'none', borderRadius: '8px',
              padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', flex: 1
            }}>
              📅 Schedule Drive
            </button>
            <button type="button" onClick={onClose} style={{
              background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db',
              borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}>
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function ScheduleDrives({ user }) {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchDrives();
    fetchCompanies();
  }, []);

  const fetchDrives = async () => {
    setLoading(true);
    try {
      // Mock campus drive data based on your synopsis
      const mockDrives = [
        {
          id: 1, company: 'TechCorp Solutions', date: '2025-09-20', time: '10:00',
          venue: 'Main Auditorium', status: 'scheduled',
          positions: ['Software Engineer', 'Frontend Developer'],
          registeredStudents: 45, eligibleStudents: 120,
          eligibility: 'CGPA >= 7.0, CSE/IT only', notes: 'Technical + HR rounds same day'
        },
        {
          id: 2, company: 'WebSolutions Inc', date: '2025-09-18', time: '14:00',
          venue: 'Seminar Hall A', status: 'ongoing',
          positions: ['UI/UX Designer', 'React Developer'],
          registeredStudents: 32, eligibleStudents: 85,
          eligibility: 'Portfolio required', notes: 'Design challenge included'
        },
        {
          id: 3, company: 'CloudTech Innovations', date: '2025-09-12', time: '09:30',
          venue: 'Virtual/Online', status: 'completed',
          positions: ['DevOps Engineer', 'Cloud Architect'],
          registeredStudents: 28, eligibleStudents: 95,
          eligibility: 'AWS knowledge preferred', notes: 'Online technical assessment'
        },
        {
          id: 4, company: 'DataSystems Ltd', date: '2025-09-25', time: '11:00',
          venue: 'Seminar Hall B', status: 'scheduled',
          positions: ['Data Scientist', 'ML Engineer'],
          registeredStudents: 15, eligibleStudents: 60,
          eligibility: 'Python, ML knowledge required', notes: 'Case study presentation'
        }
      ];
      
      setDrives(mockDrives);
    } catch (error) {
      console.error('Error fetching drives:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      // Mock companies (in real app, fetch active companies)
      setCompanies([
        { id: 1, name: 'TechCorp Solutions' },
        { id: 2, name: 'WebSolutions Inc' },
        { id: 3, name: 'CloudTech Innovations' },
        { id: 4, name: 'DataSystems Ltd' },
        { id: 5, name: 'AI Ventures' }
      ]);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleAddDrive = (newDrive) => {
    setDrives([newDrive, ...drives]);
    alert(`✅ Campus drive scheduled for ${newDrive.company} on ${newDrive.date}!\n\nStudents will be notified automatically.`);
  };

  const handleViewDetails = (drive) => {
    alert(`📊 ${drive.company} Drive Details\n\n📅 Date: ${drive.date} at ${drive.time}\n📍 Venue: ${drive.venue}\n👥 Registered: ${drive.registeredStudents}/${drive.eligibleStudents}\n📋 Positions: ${drive.positions.join(', ')}\n\nDetailed drive management coming soon!`);
  };

  const handleEdit = (drive) => {
    alert(`✏️ Edit ${drive.company} Drive\n\nScheduled for: ${drive.date} at ${drive.time}\nVenue: ${drive.venue}\n\nDrive editing interface coming soon!`);
  };

  const handleCancel = (drive) => {
    if (confirm(`❌ Cancel ${drive.company} drive?\n\nThis will notify all ${drive.registeredStudents} registered students.`)) {
      setDrives(drives.map(d => 
        d.id === drive.id ? { ...d, status: 'cancelled' } : d
      ));
      alert(`Drive cancelled. Students have been notified.`);
    }
  };

  const filteredDrives = filter === 'all' ? drives : drives.filter(drive => drive.status === filter);

  const stats = {
    totalDrives: drives.length,
    scheduledDrives: drives.filter(d => d.status === 'scheduled').length,
    ongoingDrives: drives.filter(d => d.status === 'ongoing').length,
    completedDrives: drives.filter(d => d.status === 'completed').length
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#edf0fb', padding: '24px 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#021734ff', margin: '0 0 8px 0' }}>
            📅 Schedule Campus Drives
          </h1>
          <p style={{ fontSize: '16px', color: '#4d5668ff', margin: 0 }}>
            Organize and manage campus recruitment events with company partners
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '16px', marginBottom: '32px' 
        }}>
          <div style={{ background: '#d8def4ff', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6', margin: '0 0 4px 0' }}>
              {stats.totalDrives}
            </h3>
            <p style={{ fontSize: '14px', color: '#808da7ff', margin: 0 }}>Total Drives</p>
          </div>
          <div style={{ background: '#d8def4ff', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', margin: '0 0 4px 0' }}>
              {stats.scheduledDrives}
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Scheduled</p>
          </div>
          <div style={{ background: '#d8def4ff', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', margin: '0 0 4px 0' }}>
              {stats.ongoingDrives}
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Ongoing</p>
          </div>
          <div style={{ background: '#d8def4ff', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#8b5cf6', margin: '0 0 4px 0' }}>
              {stats.completedDrives}
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Completed</p>
          </div>
        </div>

        {/* Controls */}
        <div style={{
          background: '#e2e7f9ff', border: '1px solid #dceaf8ff',
          borderRadius: '12px', padding: '20px', marginBottom: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { key: 'all', label: 'All Drives' },
              { key: 'scheduled', label: 'Scheduled' },
              { key: 'ongoing', label: 'Ongoing' },
              { key: 'completed', label: 'Completed' }
            ].map(filterOption => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                style={{
                  background: filter === filterOption.key ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : '#ffffff',
                  color: filter === filterOption.key ? '#ffffff' : '#374151',
                  border: '1px solid #e1e5e9', borderRadius: '6px', padding: '8px 16px',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                }}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white', border: 'none', borderRadius: '8px',
              padding: '12px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}
          >
            📅 Schedule New Drive
          </button>
        </div>

        {/* Drives List */}
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
              Loading campus drives...
            </div>
          ) : filteredDrives.length > 0 ? (
            filteredDrives.map(drive => (
              <DriveCard
                key={drive.id}
                drive={drive}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onCancel={handleCancel}
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No drives found</h4>
              <p>Schedule your first campus recruitment drive</p>
            </div>
          )}
        </div>

        {/* Add Drive Modal */}
        <AddDriveModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddDrive}
          companies={companies}
        />
      </div>

      <style jsx>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default ScheduleDrives;
