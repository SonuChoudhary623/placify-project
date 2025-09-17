import api from './api';

const jobService = {
  // Get all jobs
  getAllJobs: async () => {
    const response = await api.get('/api/jobs');
    return response.data;
  },

  // Post new job
  createJob: async (jobData) => {
    const response = await api.post('/api/jobs', jobData);
    return response.data;
  },

  // Apply for job
  applyForJob: async (jobId, applicationData) => {
    const response = await api.post(`/api/jobs/${jobId}/apply`, applicationData);
    return response.data;
  },

  // Get job applications
  getJobApplications: async (jobId) => {
    const response = await api.get(`/api/jobs/${jobId}/applications`);
    return response.data;
  }
};

export default jobService;
