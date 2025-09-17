const express = require('express');
const router = express.Router();

// Mock companies database
let companies = [
  {
    id: 1, name: 'TechCorp Solutions', industry: 'Information Technology',
    location: 'Bangalore', size: 'Large', status: 'active',
    contactEmail: 'hr@techcorp.com', website: 'https://techcorp.com',
    recruiterId: 'recruiter1', registeredDate: '2025-01-15',
    activeJobs: 5, totalHires: 23, avgPackage: '8.5',
    preferredSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
    description: 'Leading technology solutions provider specializing in software development.'
  },
  {
    id: 2, name: 'WebSolutions Inc', industry: 'Software Development',
    location: 'Hyderabad', size: 'Medium', status: 'active',
    contactEmail: 'careers@websolutions.com', website: 'https://websolutions.com',
    recruiterId: 'recruiter2', registeredDate: '2025-02-10',
    activeJobs: 3, totalHires: 15, avgPackage: '7.2',
    preferredSkills: ['React', 'Angular', 'CSS', 'JavaScript', 'UI/UX'],
    description: 'Innovative web development company creating modern digital experiences.'
  }
];

// GET /api/companies - Get all companies
router.get('/', (req, res) => {
  try {
    const { status = 'all', industry, location } = req.query;
    
    let filteredCompanies = [...companies];
    
    if (status !== 'all') {
      filteredCompanies = filteredCompanies.filter(company => company.status === status);
    }
    
    if (industry && industry !== 'all') {
      filteredCompanies = filteredCompanies.filter(company => 
        company.industry.toLowerCase().includes(industry.toLowerCase())
      );
    }
    
    if (location && location !== 'all') {
      filteredCompanies = filteredCompanies.filter(company => 
        company.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      companies: filteredCompanies,
      totalCount: filteredCompanies.length,
      message: 'Companies fetched successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching companies' });
  }
});

// POST /api/companies - Add new company
router.post('/', (req, res) => {
  try {
    const { 
      name, industry, location, size, contactEmail, website, 
      recruiterId, description, preferredSkills 
    } = req.body;
    
    const newCompany = {
      id: companies.length + 1,
      name, industry, location, size, contactEmail, website,
      recruiterId, description,
      preferredSkills: preferredSkills || [],
      status: 'active',
      registeredDate: new Date().toISOString().split('T')[0],
      activeJobs: 0, totalHires: 0, avgPackage: '0'
    };
    
    companies.push(newCompany);
    
    res.status(201).json({
      success: true,
      company: newCompany,
      message: 'Company added successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding company' });
  }
});

// GET /api/companies/:id - Get company by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const company = companies.find(c => c.id === parseInt(id));
    
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    
    res.json({
      success: true,
      company,
      message: 'Company details fetched successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching company details' });
  }
});

// PUT /api/companies/:id - Update company
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const companyIndex = companies.findIndex(c => c.id === parseInt(id));
    
    if (companyIndex === -1) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    
    companies[companyIndex] = { 
      ...companies[companyIndex], 
      ...req.body, 
      updatedAt: new Date().toISOString() 
    };
    
    res.json({
      success: true,
      company: companies[companyIndex],
      message: 'Company updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating company' });
  }
});

// PUT /api/companies/:id/status - Toggle company status
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const companyIndex = companies.findIndex(c => c.id === parseInt(id));
    
    if (companyIndex === -1) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    
    companies[companyIndex].status = status;
    companies[companyIndex].statusUpdatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      company: companies[companyIndex],
      message: `Company status updated to ${status}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating company status' });
  }
});

module.exports = router;
