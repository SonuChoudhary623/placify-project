import { useState, useEffect } from 'react';
import api from '../services/api';

// Profile Section Component
const ProfileSection = ({ title, children, editMode, onEdit }) => (
  <div style={{
    background: '#ffffff', border: '1px solid #e1e5e9', borderRadius: '12px',
    padding: '24px', marginBottom: '20px'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>{title}</h3>
      <button onClick={onEdit} style={{
        background: editMode ? '#10b981' : '#f3f4f6',
        color: editMode ? 'white' : '#374151',
        border: editMode ? 'none' : '1px solid #d1d5db',
        borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
      }}>
        {editMode ? '✅ Save' : '✏️ Edit'}
      </button>
    </div>
    {children}
  </div>
);

// Stats Card Component
const StatsCard = ({ label, value, icon, color }) => (
  <div style={{
    background: '#f8fafc', border: '1px solid #e1e5e9', borderRadius: '8px',
    padding: '16px', textAlign: 'center', transition: 'all 0.2s ease'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = color;
    e.currentTarget.style.backgroundColor = `${color}08`;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = '#e1e5e9';
    e.currentTarget.style.backgroundColor = '#f8fafc';
  }}>
    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
    <h4 style={{ fontSize: '20px', fontWeight: '700', color: color, margin: '0 0 4px 0' }}>{value}</h4>
    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{label}</p>
  </div>
);

// Editable Field Component
const EditableField = ({ label, value, type = 'text', editMode, onChange, options = [] }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
      {label}
    </label>
    {editMode ? (
      type === 'select' ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} style={{
          width: '100%', padding: '8px 12px', border: '1px solid #d1d5db',
          borderRadius: '6px', fontSize: '14px'
        }}>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows="3" style={{
          width: '100%', padding: '8px 12px', border: '1px solid #d1d5db',
          borderRadius: '6px', fontSize: '14px', resize: 'vertical'
        }} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={{
          width: '100%', padding: '8px 12px', border: '1px solid #d1d5db',
          borderRadius: '6px', fontSize: '14px'
        }} />
      )
    ) : (
      <p style={{ fontSize: '14px', color: '#1f2937', margin: 0, padding: '8px 0' }}>
        {value || 'Not specified'}
      </p>
    )}
  </div>
);

function CompanyProfile({ user }) {
  const [profileData, setProfileData] = useState({});
  const [editSections, setEditSections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    setLoading(true);
    try {
      // In real implementation, fetch company profile data
      // const response = await api.get(`/api/companies/profile/${user.companyId}`);
      
      // Mock company profile data based on your synopsis
      const mockProfile = {
        basicInfo: {
          companyName: 'TechCorp Solutions',
          industry: 'Information Technology',
          founded: '2015',
          headquarters: 'Bangalore, Karnataka',
          website: 'https://techcorp.com',
          size: '500-1000 employees',
          description: 'Leading technology solutions provider specializing in software development, cloud services, and digital transformation for enterprises worldwide.'
        },
        contactInfo: {
          hrEmail: 'hr@techcorp.com',
          recruiterName: user.firstName + ' ' + user.lastName,
          phone: '+91 80 1234 5678',
          address: 'Tech Park, Electronic City, Bangalore - 560100'
        },
        recruitmentInfo: {
          preferredSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
          jobTypes: ['Full-time', 'Internship'],
          salaryRange: '6-12 LPA',
          hiringProcess: 'Online Test → Technical Interview → HR Interview → Final Selection',
          eligibilityCriteria: 'CGPA >= 7.0, No active backlogs, CSE/IT/ECE preferred'
        },
        stats: {
          activeJobs: 8,
          totalApplications: 234,
          studentsHired: 45,
          averageRating: 4.6
        }
      };
      
      setProfileData(mockProfile);
    } catch (error) {
      console.error('Error fetching company profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section) => {
    setEditSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));

    // If saving (toggling off edit mode)
    if (editSections[section]) {
      alert(`✅ ${section} information updated successfully!`);
    }
  };

  const updateField = (section, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#bedbfcff', padding: '24px 0' }}>
        <div style={{ textAlign: 'center', padding: '100px', color: '#6b7280' }}>
          <div style={{
            width: '40px', height: '40px', border: '4px solid #e1e5e9',
            borderTop: '4px solid #3b82f6', borderRadius: '50%',
            margin: '0 auto 20px', animation: 'spin 1s linear infinite'
          }}></div>
          Loading company profile...
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#edf0fb', padding: '24px 0' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', fontWeight: '700', color: 'white'
            }}>{profileData.basicInfo?.companyName?.[0] || 'C'}</div>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#021734ff', margin: '0 0 4px 0' }}>
                {profileData.basicInfo?.companyName || 'Company Profile'}
              </h1>
              <p style={{ fontSize: '16px', color: '#4d5668ff', margin: 0 }}>
                Manage your company information and recruitment preferences
              </p>
            </div>
          </div>
        </div>

        {/* Company Stats */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px', marginBottom: '32px' 
        }}>
          <StatsCard label="Active Job Posts" value={profileData.stats?.activeJobs || 0} icon="📋" color="#3b82f6" />
          <StatsCard label="Total Applications" value={profileData.stats?.totalApplications || 0} icon="📊" color="#10b981" />
          <StatsCard label="Students Hired" value={profileData.stats?.studentsHired || 0} icon="🎯" color="#f59e0b" />
          <StatsCard label="Company Rating" value={`${profileData.stats?.averageRating || 0}⭐`} icon="⭐" color="#8b5cf6" />
        </div>

        {/* Profile Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Basic Information */}
          <ProfileSection 
            title="🏢 Basic Information" 
            editMode={editSections.basicInfo}
            onEdit={() => handleEdit('basicInfo')}
          >
            <EditableField 
              label="Company Name" 
              value={profileData.basicInfo?.companyName || ''} 
              editMode={editSections.basicInfo}
              onChange={(value) => updateField('basicInfo', 'companyName', value)}
            />
            <EditableField 
              label="Industry" 
              value={profileData.basicInfo?.industry || ''} 
              type="select"
              options={['Information Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Consulting']}
              editMode={editSections.basicInfo}
              onChange={(value) => updateField('basicInfo', 'industry', value)}
            />
            <EditableField 
              label="Founded" 
              value={profileData.basicInfo?.founded || ''} 
              type="number"
              editMode={editSections.basicInfo}
              onChange={(value) => updateField('basicInfo', 'founded', value)}
            />
            <EditableField 
              label="Company Size" 
              value={profileData.basicInfo?.size || ''} 
              type="select"
              options={['1-50 employees', '51-200 employees', '201-500 employees', '500-1000 employees', '1000+ employees']}
              editMode={editSections.basicInfo}
              onChange={(value) => updateField('basicInfo', 'size', value)}
            />
            <EditableField 
              label="Website" 
              value={profileData.basicInfo?.website || ''} 
              type="url"
              editMode={editSections.basicInfo}
              onChange={(value) => updateField('basicInfo', 'website', value)}
            />
          </ProfileSection>

          {/* Contact Information */}
          <ProfileSection 
            title="📞 Contact Information" 
            editMode={editSections.contactInfo}
            onEdit={() => handleEdit('contactInfo')}
          >
            <EditableField 
              label="HR Email" 
              value={profileData.contactInfo?.hrEmail || ''} 
              type="email"
              editMode={editSections.contactInfo}
              onChange={(value) => updateField('contactInfo', 'hrEmail', value)}
            />
            <EditableField 
              label="Recruiter Name" 
              value={profileData.contactInfo?.recruiterName || ''} 
              editMode={editSections.contactInfo}
              onChange={(value) => updateField('contactInfo', 'recruiterName', value)}
            />
            <EditableField 
              label="Phone Number" 
              value={profileData.contactInfo?.phone || ''} 
              type="tel"
              editMode={editSections.contactInfo}
              onChange={(value) => updateField('contactInfo', 'phone', value)}
            />
            <EditableField 
              label="Office Address" 
              value={profileData.contactInfo?.address || ''} 
              type="textarea"
              editMode={editSections.contactInfo}
              onChange={(value) => updateField('contactInfo', 'address', value)}
            />
          </ProfileSection>
        </div>

        {/* Company Description */}
        <ProfileSection 
          title="📝 Company Description" 
          editMode={editSections.description}
          onEdit={() => handleEdit('description')}
        >
          <EditableField 
            label="About the Company" 
            value={profileData.basicInfo?.description || ''} 
            type="textarea"
            editMode={editSections.description}
            onChange={(value) => updateField('basicInfo', 'description', value)}
          />
        </ProfileSection>

        {/* Recruitment Preferences */}
        <ProfileSection 
          title="🎯 Recruitment Preferences" 
          editMode={editSections.recruitment}
          onEdit={() => handleEdit('recruitment')}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <EditableField 
                label="Preferred Skills" 
                value={profileData.recruitmentInfo?.preferredSkills?.join(', ') || ''} 
                editMode={editSections.recruitment}
                onChange={(value) => updateField('recruitmentInfo', 'preferredSkills', value.split(', '))}
              />
              <EditableField 
                label="Salary Range" 
                value={profileData.recruitmentInfo?.salaryRange || ''} 
                editMode={editSections.recruitment}
                onChange={(value) => updateField('recruitmentInfo', 'salaryRange', value)}
              />
            </div>
            <div>
              <EditableField 
                label="Job Types" 
                value={profileData.recruitmentInfo?.jobTypes?.join(', ') || ''} 
                editMode={editSections.recruitment}
                onChange={(value) => updateField('recruitmentInfo', 'jobTypes', value.split(', '))}
              />
              <EditableField 
                label="Eligibility Criteria" 
                value={profileData.recruitmentInfo?.eligibilityCriteria || ''} 
                type="textarea"
                editMode={editSections.recruitment}
                onChange={(value) => updateField('recruitmentInfo', 'eligibilityCriteria', value)}
              />
            </div>
          </div>
        </ProfileSection>

        {/* Action Buttons */}
        <div style={{
          background: '#ffffff', border: '1px solid #e1e5e9', borderRadius: '12px',
          padding: '20px', textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
            🚀 Profile Actions
          </h3>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white', border: 'none', borderRadius: '8px',
              padding: '12px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}>
              📤 Publish Profile
            </button>
            <button style={{
              background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db',
              borderRadius: '8px', padding: '12px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}>
              👁️ Preview Profile
            </button>
            <button 
              onClick={() => window.history.back()}
              style={{
                background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db',
                borderRadius: '8px', padding: '12px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
              }}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default CompanyProfile;
