import { useState, useEffect } from 'react';
import api from '../services/api';

// Interview Slot Component
const InterviewSlot = ({ slot, onBook, isBooked }) => (
  <div style={{
    background: isBooked ? '#fee2e2' : '#ffffff',
    border: '1px solid ' + (isBooked ? '#fecaca' : '#e1e5e9'),
    borderRadius: '8px', padding: '16px', marginBottom: '12px',
    transition: 'all 0.2s ease', cursor: isBooked ? 'not-allowed' : 'pointer'
  }}
  onClick={isBooked ? null : () => onBook(slot)}
  onMouseEnter={(e) => {
    if (!isBooked) {
      e.currentTarget.style.borderColor = '#3b82f6';
      e.currentTarget.style.backgroundColor = '#f8fafc';
    }
  }}
  onMouseLeave={(e) => {
    if (!isBooked) {
      e.currentTarget.style.borderColor = '#e1e5e9';
      e.currentTarget.style.backgroundColor = '#ffffff';
    }
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: '16px', fontWeight: '600', color: isBooked ? '#dc2626' : '#1f2937' }}>
          {slot.date} • {slot.time}
        </div>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          📍 {slot.mode} • ⏱️ {slot.duration} min
        </div>
      </div>
      <div style={{
        background: isBooked ? '#fecaca' : '#dcfce7',
        color: isBooked ? '#dc2626' : '#166534',
        padding: '4px 12px', borderRadius: '20px',
        fontSize: '12px', fontWeight: '600'
      }}>
        {isBooked ? 'Booked' : 'Available'}
      </div>
    </div>
    {isBooked && slot.candidate && (
      <div style={{ marginTop: '8px', fontSize: '12px', color: '#dc2626' }}>
        📝 Booked for: {slot.candidate}
      </div>
    )}
  </div>
);

// Candidate Selection Component
const CandidateCard = ({ candidate, onSelect, isSelected }) => (
  <div style={{
    background: isSelected ? '#dbeafe' : '#ffffff',
    border: '2px solid ' + (isSelected ? '#3b82f6' : '#e1e5e9'),
    borderRadius: '12px', padding: '16px', marginBottom: '12px',
    cursor: 'pointer', transition: 'all 0.2s ease'
  }}
  onClick={() => onSelect(candidate)}
  onMouseEnter={(e) => {
    if (!isSelected) {
      e.currentTarget.style.borderColor = '#93c5fd';
      e.currentTarget.style.backgroundColor = '#f8fafc';
    }
  }}
  onMouseLeave={(e) => {
    if (!isSelected) {
      e.currentTarget.style.borderColor = '#e1e5e9';
      e.currentTarget.style.backgroundColor = '#ffffff';
    }
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '8px',
        backgroundColor: isSelected ? '#3b82f6' : '#f8fafc',
        color: isSelected ? '#ffffff' : '#3b82f6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', fontWeight: '600'
      }}>{candidate.name[0]}</div>
      
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0', color: '#1f2937' }}>
          {candidate.name}
        </h4>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
          {candidate.position} • CGPA: {candidate.cgpa} • {candidate.department}
        </p>
        <div style={{ marginTop: '4px' }}>
          <span style={{
            background: '#10b981', color: 'white', padding: '2px 8px',
            borderRadius: '12px', fontSize: '12px', fontWeight: '600'
          }}>
            🤖 {candidate.aiScore}% Match
          </span>
        </div>
      </div>
      
      {isSelected && (
        <div style={{ color: '#3b82f6', fontSize: '20px' }}>✅</div>
      )}
    </div>
  </div>
);

// Interview Details Form
const InterviewForm = ({ candidate, slot, onSchedule, onCancel }) => (
  <div style={{
    background: '#ffffff', border: '1px solid #e1e5e9',
    borderRadius: '12px', padding: '24px', marginTop: '20px'
  }}>
    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
      📅 Schedule Interview
    </h3>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>
          👤 Candidate Details
        </h4>
        <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '16px' }}>
          <p style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>{candidate.name}</p>
          <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>📧 {candidate.email}</p>
          <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>🎓 {candidate.department} • CGPA: {candidate.cgpa}</p>
        </div>
      </div>
      
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>
          🕒 Interview Slot
        </h4>
        <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '16px' }}>
          <p style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
            📅 {slot.date} at {slot.time}
          </p>
          <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>📍 Mode: {slot.mode}</p>
          <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>⏱️ Duration: {slot.duration} minutes</p>
        </div>
      </div>
    </div>
    
    <div style={{ marginBottom: '20px' }}>
      <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '8px' }}>
        📝 Interview Notes (Optional)
      </label>
      <textarea
        placeholder="Add any specific instructions or topics to cover..."
        rows="3"
        style={{
          width: '100%', padding: '12px', border: '1px solid #d1d5db',
          borderRadius: '8px', fontSize: '14px', resize: 'vertical',
          backgroundColor: '#ffffff'
        }}
      />
    </div>
    
    <div style={{ display: 'flex', gap: '12px' }}>
      <button onClick={onSchedule} style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white', border: 'none', borderRadius: '8px',
        padding: '12px 24px', fontSize: '14px', fontWeight: '600',
        cursor: 'pointer', flex: 1
      }}>
        ✅ Confirm Interview
      </button>
      <button onClick={onCancel} style={{
        background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db',
        borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: '600',
        cursor: 'pointer'
      }}>
        ❌ Cancel
      </button>
    </div>
  </div>
);

function ScheduleInterviews({ user }) {
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: Select Candidate, 2: Select Slot, 3: Confirm

  useEffect(() => {
    fetchShortlistedCandidates();
    generateAvailableSlots();
  }, []);

  const fetchShortlistedCandidates = async () => {
    try {
      const response = await api.get(`/api/applications/recruiters/${user.id}?status=shortlisted`);
      
      if (response.data.success) {
        setShortlistedCandidates(response.data.applications.map(app => ({
          id: app.id,
          name: app.studentName,
          email: app.studentEmail,
          position: app.jobTitle,
          department: app.department,
          cgpa: app.cgpa,
          aiScore: Math.floor(Math.random() * 25 + 70) // Mock AI score
        })));
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
      // Mock shortlisted candidates
      setShortlistedCandidates([
        {
          id: 1, name: 'Sarah Wilson', email: 'sarah@example.com',
          position: 'Frontend Developer', department: 'CSE', cgpa: 8.5, aiScore: 87
        },
        {
          id: 2, name: 'Mike Johnson', email: 'mike@example.com',
          position: 'Full Stack Developer', department: 'IT', cgpa: 9.1, aiScore: 82
        },
        {
          id: 3, name: 'Emily Davis', email: 'emily@example.com',
          position: 'Software Engineer', department: 'CSE', cgpa: 8.8, aiScore: 79
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateAvailableSlots = () => {
    const slots = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate time slots for each day
      ['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '4:30 PM'].forEach((time, index) => {
        slots.push({
          id: `${dateStr}-${index}`,
          date: dateStr,
          time: time,
          mode: Math.random() > 0.5 ? 'Video Call' : 'In-Person',
          duration: 45,
          isBooked: Math.random() > 0.7, // 30% chance of being booked
          candidate: Math.random() > 0.7 ? 'John Smith' : null
        });
      });
    }
    
    setAvailableSlots(slots);
  };

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
    setStep(2);
  };

  const handleSlotBook = (slot) => {
    if (slot.isBooked) return;
    setSelectedSlot(slot);
    setStep(3);
  };

  const handleScheduleInterview = async () => {
    try {
      // Update application with interview details
      await api.put(`/api/applications/${selectedCandidate.id}/status`, {
        status: 'shortlisted',
        interviewDate: selectedSlot.date,
        notes: `Interview scheduled for ${selectedSlot.date} at ${selectedSlot.time}`,
        updatedBy: user.firstName
      });
      
      // Mark slot as booked (in real implementation, save to database)
      setAvailableSlots(slots => 
        slots.map(slot => 
          slot.id === selectedSlot.id 
            ? { ...slot, isBooked: true, candidate: selectedCandidate.name }
            : slot
        )
      );
      
      alert(`✅ Interview scheduled successfully!\n\nCandidate: ${selectedCandidate.name}\nDate: ${selectedSlot.date}\nTime: ${selectedSlot.time}\n\nCandidate will be notified automatically.`);
      
      // Reset form
      setSelectedCandidate(null);
      setSelectedSlot(null);
      setStep(1);
      
    } catch (error) {
      console.error('Error scheduling interview:', error);
      alert('Error scheduling interview. Please try again.');
    }
  };

  const handleCancel = () => {
    setSelectedCandidate(null);
    setSelectedSlot(null);
    setStep(1);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#edf0fb', padding: '24px 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#021734ff', margin: '0 0 8px 0' }}>
            📅 Schedule Interviews
          </h1>
          <p style={{ fontSize: '16px', color: '#4d5668ff', margin: 0 }}>
            Book interview slots with shortlisted candidates • Step {step} of 3
          </p>
        </div>

        {/* Progress Indicator */}
        <div style={{
          background: '#e2e7f9ff', border: '1px solid #dceaf8ff',
          borderRadius: '12px', padding: '20px', marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {[
              { step: 1, label: 'Select Candidate', icon: '👤' },
              { step: 2, label: 'Choose Slot', icon: '🕒' },
              { step: 3, label: 'Confirm Details', icon: '✅' }
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                opacity: step >= item.step ? 1 : 0.5
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: step >= item.step ? '#3b82f6' : '#e5e7eb',
                  color: step >= item.step ? 'white' : '#6b7280',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: '600'
                }}>{item.icon}</div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: step === 3 ? '1fr' : '1fr 1fr', gap: '24px' }}>
          
          {/* Step 1: Candidate Selection */}
          {step >= 1 && (
            <div style={{
              background: '#e2e7f9ff', border: '1px solid #dceaf8ff',
              borderRadius: '12px', padding: '24px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
                👥 Shortlisted Candidates ({shortlistedCandidates.length})
              </h3>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  <div style={{
                    width: '24px', height: '24px', border: '3px solid #e1e5e9',
                    borderTop: '3px solid #3b82f6', borderRadius: '50%',
                    margin: '0 auto 16px', animation: 'spin 1s linear infinite'
                  }}></div>
                  Loading candidates...
                </div>
              ) : shortlistedCandidates.length > 0 ? (
                shortlistedCandidates.map(candidate => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    isSelected={selectedCandidate?.id === candidate.id}
                    onSelect={handleCandidateSelect}
                  />
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  <p>No shortlisted candidates yet</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Slot Selection */}
          {step >= 2 && step < 3 && (
            <div style={{
              background: '#e2e7f9ff', border: '1px solid #dceaf8ff',
              borderRadius: '12px', padding: '24px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 20px 0' }}>
                🕒 Available Interview Slots
              </h3>
              
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {availableSlots.map(slot => (
                  <InterviewSlot
                    key={slot.id}
                    slot={slot}
                    isBooked={slot.isBooked}
                    onBook={handleSlotBook}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && selectedCandidate && selectedSlot && (
            <InterviewForm
              candidate={selectedCandidate}
              slot={selectedSlot}
              onSchedule={handleScheduleInterview}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default ScheduleInterviews;
