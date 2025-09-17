const express = require('express');
const router = express.Router();

// Mock data for TPO analytics
let analyticsData = {
  totalApplications: 342,
  byStatus: { pending: 45, shortlisted: 89, hired: 156, rejected: 52 },
  byDepartment: { CSE: 156, IT: 89, ECE: 67, EEE: 30 },
  topCompanies: [
    { name: 'TechCorp', applications: 45, hired: 23 },
    { name: 'WebSolutions', applications: 38, hired: 18 },
    { name: 'CloudTech', applications: 32, hired: 15 }
  ],
  placementTrends: [
    { month: 'Jan', placements: 12 },
    { month: 'Feb', placements: 18 },
    { month: 'Mar', placements: 25 },
    { month: 'Apr', placements: 31 },
    { month: 'May', placements: 28 },
    { month: 'Jun', placements: 35 }
  ],
  skillGaps: [
    { skill: 'React.js', demand: 85, supply: 45, gap: 40 },
    { skill: 'Node.js', demand: 75, supply: 52, gap: 23 },
    { skill: 'Python', demand: 90, supply: 68, gap: 22 },
    { skill: 'Data Science', demand: 70, supply: 25, gap: 45 }
  ]
};

// GET /api/tpo/analytics - Get comprehensive analytics
router.get('/analytics', (req, res) => {
  try {
    const { timeRange = 'current', department = 'all' } = req.query;
    
    let filteredData = { ...analyticsData };
    
    // Filter by department if specified
    if (department !== 'all') {
      const deptApplications = analyticsData.byDepartment[department] || 0;
      filteredData.totalApplications = deptApplications;
    }
    
    // Calculate placement rate
    const placementRate = Math.round((filteredData.byStatus.hired / filteredData.totalApplications) * 100);
    
    res.json({
      success: true,
      analytics: {
        ...filteredData,
        placementRate,
        averagePackage: '₹7.2L',
        topPerformingDepartment: 'CSE',
        improvementSuggestions: [
          'Increase React.js training programs',
          'Focus on Data Science skill development',
          'Enhance communication skills workshops'
        ]
      },
      message: 'Analytics data fetched successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching analytics' });
  }
});

// GET /api/tpo/reports/:type - Generate specific reports
router.get('/reports/:type', (req, res) => {
  try {
    const { type } = req.params;
    const { format = 'json' } = req.query;
    
    let reportData = {};
    
    switch (type) {
      case 'placement':
        reportData = {
          title: 'Placement Report',
          data: analyticsData.byStatus,
          generated: new Date().toISOString()
        };
        break;
      case 'company':
        reportData = {
          title: 'Company Performance Report',
          data: analyticsData.topCompanies,
          generated: new Date().toISOString()
        };
        break;
      case 'skills':
        reportData = {
          title: 'Skill Gap Analysis',
          data: analyticsData.skillGaps,
          generated: new Date().toISOString()
        };
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid report type' });
    }
    
    res.json({
      success: true,
      report: reportData,
      downloadUrl: `/api/tpo/reports/${type}/download`,
      message: 'Report generated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating report' });
  }
});

module.exports = router;
