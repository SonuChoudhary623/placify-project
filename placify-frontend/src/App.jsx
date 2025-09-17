import { useState, useEffect } from 'react';
import authService from './services/authService';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import TPODashboard from './components/TPODashboard';
import RecruiterDashboard from './components/RecruiterDashboard';
import JobPosting from './components/JobPosting';
import JobBrowser from './components/JobBrowser';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import StudentFilter from './components/StudentFilter'; 
import AptitudeTest from './components/AptitudeTest';
import ViewApplications from './components/ViewApplications';
import RecruiterViewApplications from './components/RecruiterViewApplications';
import TPOAnalyticsReport from './components/TPOAnalyticsReport';
import ScheduleInterviews from './components/ScheduleInterviews';
import CompanyRelations from './components/CompanyRelations';
import ScheduleDrives from './components/ScheduleDrives';
import CandidateAnalytics from './components/CandidateAnalytics';
import TPOAdminDashboard from './components/TPOAdminDashboard';
import CompanyProfile from './components/CompanyProfile';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('home');
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // Navigation Component
  // Navigation Component - REPLACE the existing Navigation function with this:
const Navigation = () => (
  <div style={{ 
    background: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '1rem 0',
    marginBottom: '0'
  }}>
    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background:'#edf0fb' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <h2 
          style={{ color: '#3b82f6', margin: 0, cursor: 'pointer' }} 
          onClick={() => setCurrentView('dashboard')}
        >
          🎓 Placify
        </h2>
        
        {user && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setCurrentView('dashboard')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000307f5' }}>
              Dashboard
            </button>
            
            {/* Student Navigation */}
            {user.role === 'student' && (
              <>
                <button onClick={() => setCurrentView('browse-jobs')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000307f5' }}>
                  Browse Jobs</button>
                <button onClick={() => setCurrentView('view-applications')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000307f5' }}>
                  My Applications</button>
                 <button onClick={() => setCurrentView('ai-job-matching')}                  
                   style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000307f5' }}>
                   Smart Matching</button>
                <button onClick={() => setCurrentView('aptitude-test')}                  
                   style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000307f5' }}>
                  Skil Assessment</button>
              </>
            )}
            
            {/* TPO Navigation */}
            {user.role === 'tpo' && (
              <>
                <button onClick={() => setCurrentView('student-filter')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000307f5' }}>
                  Manage Students</button>
                <button onClick={() => setCurrentView('company-relations')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000307f5' }}>
                  company Relations</button>
                <button onClick={() => setCurrentView('schedule-drives')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000307f5' }}>
                  Schedule Drives</button>
                <button onClick={() => setCurrentView('tpo-analytics-report')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000307f5' }}>
                  Analytics reports</button>
                <button onClick={() => setCurrentView('tpo-admin-dashboard')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000307f5' }}>
                  Admin settings</button>
              </>
            )}
            
            {/* Recruiter Navigation */}
            {user.role === 'recruiter' && (
            <>
              <button onClick={() => setCurrentView('post-job')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                Post Job</button>
              <button onClick={() => setCurrentView('recruiter-view-applications')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                View Application</button>
              <button onClick={() => setCurrentView('schedule-interviews')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                Schedule  Interviews</button>
              <button onClick={() => setCurrentView('candidate-analytics')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                Candidate Analytics</button>
              <button onClick={() => setCurrentView('company-profile')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                Company Profile</button>
            </>
            )}
          </div>
        )}
      </div>
      
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>👋 {user.firstName} ({user.role})</span>
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'white',
              border: '1px solid #020d1eff', 
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  </div>
);

  // Route based on current view
  if (currentView === 'login') {
    return (
      <div>
        <Navigation />
        <div className="container">
          <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <Login onLoginSuccess={handleLoginSuccess} />
            <div className="text-center" style={{ marginTop: '1rem' }}>
              <button 
                onClick={() => setCurrentView('register')}
                style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}
              >
                Don't have an account? Register
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'register') {
    return (
      <div>
        <Navigation />
        <div className="container">
          <Register onRegisterSuccess={handleLoginSuccess} />
          <div className="text-center" style={{ marginTop: '1rem' }}>
            <button 
              onClick={() => setCurrentView('login')}
              style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'dashboard' && user) {
    return (
      <div>
        <Navigation />
        {user.role === 'student' && <StudentDashboard user={user} onViewChange={handleViewChange} />}
        {user.role === 'tpo' && <TPODashboard user={user} onViewChange={handleViewChange} />}
        {user.role === 'recruiter' && <RecruiterDashboard user={user} onViewChange={handleViewChange} />}
      </div>
    );
  }

  if (currentView === 'browse-jobs' && user) {
    return (
      <div>
        <Navigation />
        <div className="container">
          <JobBrowser user={user} />
        </div>
      </div>
    );
  }

  if (currentView === 'post-job' && user && user.role === 'recruiter') {
    return (
      <div>
        <Navigation />
        <div className="container">
          <JobPosting user={user} onJobPosted={() => alert('Job posted successfully!')} />
        </div>
      </div>
    );
  }

  if (currentView === 'resume-analyzer' && user && user.role === 'student') {
    return (
      <div>
        <Navigation />
        <div className="container">
          <ResumeAnalyzer user={user} />
        </div>
      </div>
    );
  }

  // Make sure this route is in your App.jsx routing section
if (currentView === 'student-filter' && user && user.role === 'tpo') {
  return (
    <div>
      <Navigation />
      <div className="container">
        <StudentFilter user={user} />
      </div>
    </div>
  );
}

if (currentView === 'aptitude-test' && user && user.role === 'student') {
  return (
    <div>
      <Navigation />
      <div className="container">
        <AptitudeTest user={user} />
      </div>
    </div>
  );
}

if (currentView === 'view-applications' && user && user.role === 'student') {
  return (
    <div>
      <Navigation />
      <ViewApplications user={user} />
    </div>
  );
}

if (currentView === 'ai-job-matching' && user && user.role === 'student') {
  return (
    <div>
      <Navigation />
      <AIJobMatching user={user} />
    </div>
  );
}

// Add this route in your App.jsx
if (currentView === 'recruiter-view-applications' && user && user.role === 'recruiter') {
  return (
    <div>
      <Navigation 
        user={user} 
        onLogout={handleLogout} 
        onViewChange={setCurrentView}
      />
      <RecruiterViewApplications user={user} />
    </div>
  );
}

if (currentView === 'tpo-analytics-report' && user && user.role === 'tpo') {
  return (
    <div>
      <Navigation user={user} onLogout={handleLogout} onViewChange={setCurrentView} />
      <TPOAnalyticsReport user={user} />
    </div>
  );
}

if (currentView === 'schedule-interviews' && user && user.role === 'recruiter') {
  return (
    <div>
      <Navigation user={user} onLogout={handleLogout} onViewChange={setCurrentView} />
      <ScheduleInterviews user={user} />
    </div>
  );
}

if (currentView === 'company-relations' && user && user.role === 'tpo') {
  return (
    <div>
      <Navigation user={user} onLogout={handleLogout} onViewChange={setCurrentView} />
      <CompanyRelations user={user} />
    </div>
  );
}

if (currentView === 'schedule-drives' && user && user.role === 'tpo') {
  return (
    <div>
      <Navigation user={user} onLogout={handleLogout} onViewChange={setCurrentView} />
      <ScheduleDrives user={user} />
    </div>
  );
}

if (currentView === 'candidate-analytics' && user && user.role === 'recruiter') {
  return (
    <div>
      <Navigation user={user} onLogout={handleLogout} onViewChange={setCurrentView} />
      <CandidateAnalytics user={user} />
    </div>
  );
}

if (currentView === 'tpo-admin-dashboard' && user && user.role === 'tpo') {
  return (
    <div>
      <Navigation user={user} onLogout={handleLogout} onViewChange={setCurrentView} />
      <TPOAdminDashboard user={user} onViewChange={setCurrentView} />
    </div>
  );
}

if (currentView === 'company-profile' && user && user.role === 'recruiter') {
  return (
    <div>
      <Navigation user={user} onLogout={handleLogout} onViewChange={setCurrentView} />
      <CompanyProfile user={user} />
    </div>
  );
}


  // Home/Landing Page
  return (
    <div>
      <Navigation />
      <div style={{ minHeight: '100vh', background:'#edf0fb' }}>
        <div className="container">
          <div className="text-center" style={{ padding: '4rem 0' }}>
            <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '1rem' }}>
              🎓 Placify
            </h1>
            <h2 style={{ fontSize: '2rem', color: '#283649ff', marginBottom: '3rem' }}>
              AI-Powered Campus Placement Platform
            </h2>
            
            <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
              <h3 style={{ marginBottom: '2rem', color:'black' }}>Get Started Today!</h3>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn" onClick={() => setCurrentView('login')}>
                  Login
                </button>
                <button className="btn" onClick={() => setCurrentView('register')}>
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
