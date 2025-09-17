import { useState, useEffect } from 'react';
import api from '../services/api';

// Company Card Component
const CompanyCard = ({ company, onViewDetails, onEdit, onToggleStatus }) => (
  <div style={{
    background: '#ffffff', border: '1px solid #e1e5e9', borderRadius: '12px',
    padding: '24px', marginBottom: '16px', transition: 'all 0.2s ease',
    opacity: company.status === 'inactive' ? 0.7 : 1
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = '#3b82f6';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.1)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = '#e1e5e9';
    e.currentTarget.style.boxShadow = 'none';
  }}>
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
        {/* Company Logo */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '12px',
          background: `linear-gradient(135deg, ${company.color} 0%, ${company.color}dd 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', fontWeight: '700', color: 'white'
        }}>{company.name[0]}</div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: '#1f2937' }}>
              {company.name}
            </h4>
            <span style={{
              background: company.status === 'active' ? '#dcfce7' : '#fee2e2',
              color: company.status === 'active' ? '#166534' : '#dc2626',
              padding: '4px 12px', borderRadius: '20px',
              fontSize: '12px', fontWeight: '600'
            }}>
              {company.status === 'active' ? '✅ Active' : '⏸️ Inactive'}
            </span>
          </div>
          
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 12px 0' }}>
            🏢 {company.industry} • 📍 {company.location} • 👥 {company.size}
          </p>
          
          <div style={{ display: 'flex', gap: '20px', fontSize: '14px', marginBottom: '12px' }}>
            <span style={{ color: '#10b981', fontWeight: '600' }}>
              📋 {company.activeJobs} Active Jobs
            </span>
            <span style={{ color: '#3b82f6', fontWeight: '600' }}>
              👥 {company.totalHires} Students Hired
            </span>
            <span style={{ color: '#f59e0b', fontWeight: '600' }}>
              💰 Avg: ₹{company.avgPackage}L
            </span>
          </div>
          
          {/* Skills They Look For */}
          <div>
            <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Top Skills:</span>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
              {company.preferredSkills.slice(0, 4).map((skill, i) => (
                <span key={i} style={{
                  background: '#e2e7f9ff', color: '#1f2937', padding: '2px 8px',
                  borderRadius: '12px', fontSize: '11px', fontWeight: '500'
                }}>{skill}</span>
              ))}
              {company.preferredSkills.length > 4 && (
                <span style={{ fontSize: '11px', color: '#6b7280' }}>
                  +{company.preferredSkills.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
        <button onClick={() => onViewDetails(company)} style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white', border: 'none', borderRadius: '6px',
          padding: '8px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
        }}>
          📊 View Details
        </button>
        <button onClick={() => onEdit(company)} style={{
          background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db',
          borderRadius: '6px', padding: '8px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
        }}>
          ✏️ Edit
        </button>
        <button onClick={() => onToggleStatus(company)} style={{
          background: company.status === 'active' ? '#fee2e2' : '#dcfce7',
          color: company.status === 'active' ? '#dc2626' : '#166534',
          border: 'none', borderRadius: '6px',
          padding: '8px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
        }}>
          {company.status === 'active' ? '⏸️ Pause' : '▶️ Activate'}
        </button>
      </div>
    </div>
  </div>
);

// Quick Stats Component
const StatCard = ({ title, value, icon, color, trend }) => (
  <div style={{
    background: '#e2e7f9ff', border: '1px solid #dceaf8ff', borderRadius: '12px',
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
    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
    <h3 style={{ fontSize: '28px', fontWeight: '700', color: color, margin: '0 0 4px 0' }}>
      {value}
    </h3>
    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '500' }}>{title}</p>
    {trend && (
      <span style={{
        fontSize: '12px', fontWeight: '600',
        color: trend > 0 ? '#10b981' : '#ef4444'
      }}>
        {trend > 0 ? '↗️' : '↘️'} {Math.abs(trend)}% from last month
      </span>
    )}
  </div>
);

// Add Company Modal (Simple)
const AddCompanyModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '', industry: '', location: '', size: '', website: '', contact: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: Date.now(),
      status: 'active',
      activeJobs: 0,
      totalHires: 0,
      avgPackage: '0',
      preferredSkills: ['JavaScript', 'Python', 'React'],
      color: '#3b82f6'
    });
    setFormData({ name: '', industry: '', location: '', size: '', website: '', contact: '' });
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
        maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 20px 0' }}>
          🏢 Add New Company
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '16px' }}>
            <input
              type="text" placeholder="Company Name" required
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            />
            <input
              type="text" placeholder="Industry (e.g., IT, Finance)" required
              value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})}
              style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            />
            <input
              type="text" placeholder="Location" required
              value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
              style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            />
            <select
              value={formData.size} onChange={(e) => setFormData({...formData, size: e.target.value})}
              style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
              required
            >
              <option value="">Select Company Size</option>
              <option value="Startup">Startup (1-50)</option>
              <option value="Medium">Medium (51-500)</option>
              <option value="Large">Large (500+)</option>
            </select>
            <input
              type="url" placeholder="Website URL"
              value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})}
              style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            />
            <input
              type="email" placeholder="HR Contact Email" required
              value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})}
              style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button type="submit" style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white', border: 'none', borderRadius: '8px',
              padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', flex: 1
            }}>
              ✅ Add Company
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

function CompanyRelations({ user }) {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, inactive
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [companies, filter, searchTerm]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      // In real implementation, fetch from API
      // const response = await api.get('/api/tpo/companies');
      
      // Mock company data based on your synopsis
      const mockCompanies = [
        {
          id: 1, name: 'TechCorp Solutions', industry: 'Information Technology',
          location: 'Bangalore', size: 'Large', status: 'active',
          activeJobs: 5, totalHires: 23, avgPackage: '8.5',
          preferredSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
          color: '#3b82f6', contact: 'hr@techcorp.com', website: 'https://techcorp.com'
        },
        {
          id: 2, name: 'WebSolutions Inc', industry: 'Software Development',
          location: 'Hyderabad', size: 'Medium', status: 'active',
          activeJobs: 3, totalHires: 15, avgPackage: '7.2',
          preferredSkills: ['React', 'Angular', 'CSS', 'JavaScript', 'UI/UX'],
          color: '#10b981', contact: 'careers@websolutions.com', website: 'https://websolutions.com'
        },
        {
          id: 3, name: 'CloudTech Innovations', industry: 'Cloud Computing',
          location: 'Mumbai', size: 'Large', status: 'active',
          activeJobs: 4, totalHires: 18, avgPackage: '9.1',
          preferredSkills: ['AWS', 'Docker', 'Kubernetes', 'Python', 'DevOps'],
          color: '#f59e0b', contact: 'hiring@cloudtech.com', website: 'https://cloudtech.com'
        },
        {
          id: 4, name: 'DataSystems Ltd', industry: 'Data Science',
          location: 'Pune', size: 'Medium', status: 'inactive',
          activeJobs: 0, totalHires: 8, avgPackage: '8.8',
          preferredSkills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'TensorFlow'],
          color: '#8b5cf6', contact: 'jobs@datasystems.com', website: 'https://datasystems.com'
        }
      ];
      
      setCompanies(mockCompanies);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...companies];
    
    // Status filter
    if (filter !== 'all') {
      filtered = filtered.filter(company => company.status === filter);
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCompanies(filtered);
  };

  const handleViewDetails = (company) => {
    alert(`🏢 ${company.name} Details\n\n📧 Contact: ${company.contact}\n🌐 Website: ${company.website}\n📊 Total Hires: ${company.totalHires}\n💰 Avg Package: ₹${company.avgPackage}L\n\nDetailed company profile coming soon!`);
  };

  const handleEdit = (company) => {
    alert(`✏️ Edit ${company.name}\n\nCompany editing interface coming soon!\n\nCurrent Status: ${company.status}\nActive Jobs: ${company.activeJobs}`);
  };

  const handleToggleStatus = async (company) => {
    try {
      const newStatus = company.status === 'active' ? 'inactive' : 'active';
      
      // Update local state
      setCompanies(companies.map(c => 
        c.id === company.id ? { ...c, status: newStatus } : c
      ));
      
      alert(`${company.name} status changed to ${newStatus.toUpperCase()}`);
    } catch (error) {
      console.error('Error updating company status:', error);
    }
  };

  const handleAddCompany = (newCompany) => {
    setCompanies([...companies, newCompany]);
    alert(`✅ ${newCompany.name} added successfully!`);
  };

  const stats = {
    totalCompanies: companies.length,
    activeCompanies: companies.filter(c => c.status === 'active').length,
    totalJobs: companies.reduce((sum, c) => sum + c.activeJobs, 0),
    totalHires: companies.reduce((sum, c) => sum + c.totalHires, 0)
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#edf0fb', padding: '24px 0' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#021734ff', margin: '0 0 8px 0' }}>
            🏢 Company Relations Management
          </h1>
          <p style={{ fontSize: '16px', color: '#4d5668ff', margin: 0 }}>
            Manage recruiting partnerships and coordinate campus placement drives
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px', marginBottom: '32px' 
        }}>
          <StatCard title="Total Companies" value={stats.totalCompanies} icon="🏢" color="#3b82f6" trend={8} />
          <StatCard title="Active Partners" value={stats.activeCompanies} icon="✅" color="#10b981" trend={12} />
          <StatCard title="Active Job Posts" value={stats.totalJobs} icon="📋" color="#f59e0b" trend={-5} />
          <StatCard title="Students Hired" value={stats.totalHires} icon="🎯" color="#8b5cf6" trend={15} />
        </div>

        {/* Controls */}
        <div style={{
          background: '#e2e7f9ff', border: '1px solid #dceaf8ff',
          borderRadius: '12px', padding: '20px', marginBottom: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px'
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
            <input
              type="text"
              placeholder="🔍 Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px',
                fontSize: '14px', minWidth: '250px', backgroundColor: '#ffffff'
              }}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px',
                fontSize: '14px', backgroundColor: '#ffffff'
              }}
            >
              <option value="all">All Companies</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white', border: 'none', borderRadius: '8px',
              padding: '12px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}
          >
            ➕ Add Company
          </button>
        </div>

        {/* Companies List */}
        <div style={{ 
          background: '#e2e7f9ff', 
          border: '1px solid #dceaf8ff', 
          borderRadius: '12px', 
          padding: '24px' 
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
            📋 Company Partners ({filteredCompanies.length})
          </h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
              <div style={{
                width: '32px', height: '32px', border: '3px solid #e1e5e9',
                borderTop: '3px solid #3b82f6', borderRadius: '50%',
                margin: '0 auto 16px', animation: 'spin 1s linear infinite'
              }}></div>
              Loading company data...
            </div>
          ) : filteredCompanies.length > 0 ? (
            filteredCompanies.map(company => (
              <CompanyCard
                key={company.id}
                company={company}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No companies found</h4>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Add Company Modal */}
        <AddCompanyModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCompany}
        />
      </div>

      <style jsx>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default CompanyRelations;
