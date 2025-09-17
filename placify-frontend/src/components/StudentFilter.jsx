import { useState, useEffect } from 'react';
import api from '../services/api';

function StudentFilter({ user }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    minCGPA: 7.0,
    minAttendance: 75,
    maxBacklogs: 1,
    department: 'all'
  });
  const [stats, setStats] = useState({ total: 0, filtered: 0 });

  // Fetch students when filters change
  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.minCGPA) params.append('minCGPA', filters.minCGPA);
      if (filters.minAttendance) params.append('minAttendance', filters.minAttendance);
      if (filters.maxBacklogs !== '') params.append('maxBacklogs', filters.maxBacklogs);
      if (filters.department !== 'all') params.append('department', filters.department);

      const response = await api.get(`/api/tpo/students?${params}`);
      setStudents(response.data.students);
      setStats({
        total: response.data.totalStudents,
        filtered: response.data.filteredCount
      });
    } catch (error) {
      alert('Error fetching students: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div >
      <h2>🎯 Smart Student Filtering</h2>
      
      {/* Filter Controls */}
      <div className="card">
        <h3>📊 Filter Criteria</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Min CGPA:</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={filters.minCGPA}
              onChange={(e) => handleFilterChange('minCGPA', parseFloat(e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Min Attendance (%):</label>
            <input
              type="number"
              min="0"
              max="100"
              value={filters.minAttendance}
              onChange={(e) => handleFilterChange('minAttendance', parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Max Backlogs:</label>
            <input
              type="number"
              min="0"
              max="10"
              value={filters.maxBacklogs}
              onChange={(e) => handleFilterChange('maxBacklogs', parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Department:</label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="all">All Departments</option>
              <option value="CSE">Computer Science</option>
              <option value="IT">Information Technology</option>
              <option value="ECE">Electronics</option>
              <option value="ME">Mechanical</option>
            </select>
          </div>
        </div>
        
        {/* Stats */}
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '6px' }}>
          <strong>Results: {stats.filtered} of {stats.total} students match criteria</strong>
        </div>
      </div>

      {/* Student List */}
      <div className="card">
        <h3>👥 Eligible Students ({students.length})</h3>
        
        {loading ? (
          <p>Loading students...</p>
        ) : students.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            No students match the current filter criteria
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {students.map(student => (
              <div
                key={student.id}
                style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                  alignItems: 'center',
                  gap: '1rem',
                  backgroundColor: '#f9fafb'
                }}
              >
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0' }}>{student.name}</h4>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>{student.email}</p>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', color: student.cgpa >= 8 ? '#10b981' : student.cgpa >= 7 ? '#f59e0b' : '#ef4444' }}>
                    CGPA: {student.cgpa}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', color: student.attendance >= 85 ? '#10b981' : student.attendance >= 75 ? '#f59e0b' : '#ef4444' }}>
                    {student.attendance}%
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', color: student.backlogs === 0 ? '#10b981' : student.backlogs <= 2 ? '#f59e0b' : '#ef4444' }}>
                    {student.backlogs} backlogs
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af'
                  }}>
                    {student.department}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentFilter;
