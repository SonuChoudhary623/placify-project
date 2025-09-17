const mongoose = require('mongoose');
require('dotenv').config();

// Import your models
const User = require('../models/User');
const Job = require('../models/Job');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample Users Data
const sampleUsers = [
  // Students
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@student.com',
    password: 'password123',
    role: 'student',
    studentProfile: {
      rollNumber: 'CSE001',
      department: 'CSE',
      course: 'BTech',
      year: 4,
      graduationYear: 2025,
      cgpa: 8.5,
      backlogs: 0,
      attendance: 85,
      skills: ['JavaScript', 'React', 'Node.js'],
      phoneNumber: '9876543210'
    }
  },
  {
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah@student.com',
    password: 'password123',
    role: 'student',
    studentProfile: {
      rollNumber: 'IT002',
      department: 'IT',
      course: 'BTech',
      year: 4,
      graduationYear: 2025,
      cgpa: 9.1,
      backlogs: 0,
      attendance: 92,
      skills: ['Python', 'Django', 'PostgreSQL'],
      phoneNumber: '9876543211'
    }
  },
  // Recruiter
  {
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike@techcorp.com',
    password: 'password123',
    role: 'recruiter',
    recruiterProfile: {
      company: 'TechCorp',
      designation: 'HR Manager',
      experience: '5 years',
      companyWebsite: 'https://techcorp.com',
      phoneNumber: '9876543212'
    }
  },
  // TPO
  {
    firstName: 'Dr. Priya',
    lastName: 'Sharma',
    email: 'tpo@college.edu',
    password: 'password123',
    role: 'tpo',
    tpoProfile: {
      department: 'Placement Cell',
      designation: 'Training & Placement Officer',
      college: 'ABC Engineering College',
      phoneNumber: '9876543213'
    }
  }
];

// Sample Jobs Data
const createSampleJobs = (recruiterId) => [
  {
    title: 'Software Developer',
    company: 'TechCorp',
    description: 'Develop and maintain web applications using modern technologies',
    requirements: {
      minCGPA: 7.5,
      maxBacklogs: 0,
      minAttendance: 80,
      skills: ['JavaScript', 'React', 'Node.js'],
      experience: 'Fresher',
      courses: ['BTech']
    },
    salary: '8-12 LPA',
    location: 'Bangalore, India',
    jobType: 'full-time',
    applicationDeadline: new Date('2025-10-15'),
    postedBy: recruiterId,
    isActive: true
  },
  {
    title: 'Frontend Developer',
    company: 'WebSolutions',
    description: 'Create responsive and interactive user interfaces',
    requirements: {
      minCGPA: 7.0,
      maxBacklogs: 1,
      minAttendance: 75,
      skills: ['React', 'CSS', 'JavaScript'],
      experience: 'Fresher',
      courses: ['BTech', 'BCA']
    },
    salary: '6-10 LPA',
    location: 'Mumbai, India',
    jobType: 'full-time',
    applicationDeadline: new Date('2025-10-20'),
    postedBy: recruiterId,
    isActive: true
  }
];

// Seed Database Function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await Job.deleteMany({});
    
    console.log('👥 Creating sample users...');
    const users = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${users.length} users`);
    
    // Find recruiter ID
    const recruiter = users.find(u => u.role === 'recruiter');
    
    console.log('💼 Creating sample jobs...');
    const jobs = createSampleJobs(recruiter._id);
    const insertedJobs = await Job.insertMany(jobs);
    console.log(`✅ Created ${insertedJobs.length} jobs`);
    
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Sample Data Created:');
    console.log('Students:');
    users.filter(u => u.role === 'student').forEach(u => {
      console.log(`  - ${u.firstName} ${u.lastName} (${u.email}) - ID: ${u._id}`);
    });
    console.log('Recruiter:');
    users.filter(u => u.role === 'recruiter').forEach(u => {
      console.log(`  - ${u.firstName} ${u.lastName} (${u.email}) - ID: ${u._id}`);
    });
    console.log('TPO:');
    users.filter(u => u.role === 'tpo').forEach(u => {
      console.log(`  - ${u.firstName} ${u.lastName} (${u.email}) - ID: ${u._id}`);
    });
    console.log('Jobs:');
    insertedJobs.forEach(j => {
      console.log(`  - ${j.title} at ${j.company} - ID: ${j._id}`);
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
