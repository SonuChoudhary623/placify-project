import { useState } from 'react';
import jobService from '../services/jobService';

function JobPosting({ user, onJobPosted }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    jobType: 'full-time',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    try {
      const response = await jobService.createJob(formData);
      setSuccess('Job posted successfully!');
      setFormData({
        title: '',
        company: '',
        description: '',
        requirements: '',
        salary: '',
        location: '',
        jobType: 'full-time',
        deadline: ''
      });
      if (onJobPosted) onJobPosted();
    } catch (error) {
      alert('Error posting job: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{background:'#edf0fb'}}>
      <h3 style={{ marginBottom: '2rem' }}>📝 Post New Job</h3>
      
      {success && (
        <div style={{ 
          background: '#dcfce7', 
          color: '#166534', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '1rem' 
        }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Job Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '4px'
              }}
              placeholder="e.g., Software Developer"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Company:</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '4px'
              }}
              placeholder="e.g., TechCorp"
            />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Job Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '4px'
            }}
            placeholder="Describe the role, responsibilities, and what you're looking for..."
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Requirements:</label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            required
            rows="3"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '4px'
            }}
            placeholder="Skills, experience, education requirements..."
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Salary:</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '4px'
              }}
              placeholder="e.g., ₹8-12 LPA"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '4px'
              }}
              placeholder="e.g., Mumbai, Bangalore"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Job Type:</label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '4px'
              }}
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Application Deadline:</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '4px'
            }}
          />
        </div>

        <button 
          type="submit" 
          className="btn" 
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? 'Posting Job...' : '🚀 Post Job'}
        </button>
      </form>
    </div>
  );
}

export default JobPosting;
