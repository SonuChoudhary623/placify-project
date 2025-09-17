import { useState, useEffect } from 'react';
import api from '../services/api';

function AptitudeTest({ user }) {
  const [testConfig, setTestConfig] = useState({
    category: 'all',
    difficulty: 'all',
    count: 60
  });
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes = 3600 seconds
  const [testId, setTestId] = useState('');

  // Timer effect
  useEffect(() => {
    if (testStarted && !testCompleted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            submitTest(); // Auto-submit when time ends
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testStarted, testCompleted, timeRemaining]);

  const startTest = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/aptitude/questions', {
        params: testConfig
      });
      setQuestions(response.data.questions);
      setTestId(response.data.testId);
      setTestStarted(true);
      setTimeRemaining(response.data.timeLimit || 3600); // Use server time limit
      console.log(`✅ Loaded ${response.data.questions.length} questions from ${response.data.dataset}`);
    } catch (error) {
      alert('Error loading test: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: optionIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitTest = async () => {
    setLoading(true);
    try {
      const answersArray = questions.map(q => ({
        questionId: q.id,
        selectedOption: answers[q.id] !== undefined ? answers[q.id] : -1
      }));

      const response = await api.post('/api/aptitude/submit', {
        testId,
        answers: answersArray,
        studentId: user.id,
        studentName: `${user.firstName} ${user.lastName}`,
        duration: (testConfig.count * 60) - timeRemaining
      });

      setResult(response.data.result);
      setTestCompleted(true);
    } catch (error) {
      alert('Error submitting test: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetTest = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setQuestions([]);
    setTimeRemaining(3600);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  // Test completed - show enhanced results
  if (testCompleted && result) {
    return (
      <div>
        <h2>🎯 Aptitude Test Results</h2>
        
        {/* Overall Score */}
        <div className="card" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3>📊 Your Performance</h3>
          <div style={{ 
            fontSize: '4rem', 
            fontWeight: 'bold', 
            color: result.percentage >= 80 ? '#10b981' : result.percentage >= 60 ? '#f59e0b' : '#ef4444'
          }}>
            {result.percentage}%
          </div>
          <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
            {result.correctAnswers} out of {result.totalQuestions} correct
          </p>
          <div style={{ 
            padding: '0.75rem', 
            borderRadius: '6px', 
            backgroundColor: result.percentage >= 80 ? '#dcfce7' : result.percentage >= 60 ? '#fef3c7' : '#fee2e2',
            color: result.percentage >= 80 ? '#166534' : result.percentage >= 60 ? '#92400e' : '#dc2626',
            marginTop: '1rem'
          }}>
            <strong>Performance: {result.performance}</strong>
          </div>
        </div>

        {/* Category Analysis */}
        {result.categoryAnalysis && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3>📈 Category-wise Performance</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {result.categoryAnalysis.map((category, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: '#f9fafb'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{category.category}</h4>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                      {category.correct}/{category.total} questions
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold',
                      color: category.percentage >= 70 ? '#10b981' : category.percentage >= 50 ? '#f59e0b' : '#ef4444'
                    }}>
                      {category.percentage}%
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {category.performance}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weak Topics */}
        {result.topicAnalysis && result.topicAnalysis.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3>🎯 Areas for Improvement</h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Focus on these topics to improve your performance:
            </p>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {result.topicAnalysis.slice(0, 5).map((topic, index) => (
                <div key={index} style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem 1rem',
                  border: '1px solid #fecaca',
                  backgroundColor: '#fef2f2',
                  borderRadius: '4px'
                }}>
                  <span>{topic.topic}</span>
                  <span style={{ color: '#dc2626', fontWeight: 'bold' }}>
                    {topic.percentage}% ({topic.correct}/{topic.total})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>💡 AI Recommendations</h3>
          {result.recommendations && result.recommendations.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {result.recommendations.map((rec, index) => (
                <div key={index} style={{ 
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: rec.priority === 'High' ? '#fef2f2' : '#f0f9ff'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <strong style={{ color: '#374151' }}>{rec.message}</strong>
                    <span style={{ 
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      backgroundColor: rec.priority === 'High' ? '#fecaca' : '#bfdbfe',
                      color: rec.priority === 'High' ? '#991b1b' : '#1e40af'
                    }}>
                      {rec.priority}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                    {rec.action}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#10b981' }}>✅ Great performance! Keep up the excellent work.</p>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="btn" onClick={resetTest} style={{ padding: '1rem 2rem' }}>
            🔄 Take Another Test
          </button>
        </div>
      </div>
    );
  }

  // Test in progress
  if (testStarted && questions.length > 0) {
    const question = questions[currentQuestion];
    const isAnswered = answers[question.id] !== undefined;
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div>
        {/* Header with Timer */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          borderRadius: '8px'
        }}>
          <div>
            <h2 style={{ margin: 0 }}>📝 Aptitude Test</h2>
            <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>
              Question {currentQuestion + 1} of {questions.length} • Answered: {getAnsweredCount()}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '6px', 
              backgroundColor: timeRemaining < 300 ? '#fecaca' : timeRemaining < 600 ? '#fef3c7' : '#dcfce7',
              color: timeRemaining < 300 ? '#dc2626' : timeRemaining < 600 ? '#92400e' : '#166534',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}>
              ⏱️ {formatTime(timeRemaining)}
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
              {timeRemaining < 300 ? 'Hurry up!' : timeRemaining < 600 ? 'Time running low' : 'Time remaining'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            background: '#f3f4f6', 
            height: '8px', 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              background: '#3b82f6', 
              height: '100%', 
              width: `${progress}%`,
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        <div className="card">
          {/* Question Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                borderRadius: '12px',
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                fontSize: '0.8rem'
              }}>
                {question.category} • {question.difficulty}
              </span>
              {question.topic && (
                <span style={{ 
                  marginLeft: '0.5rem',
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '12px',
                  backgroundColor: '#f3e8ff',
                  color: '#7c3aed',
                  fontSize: '0.8rem'
                }}>
                  {question.topic}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              {isAnswered ? '✅ Answered' : '⏺️ Not answered'}
            </div>
          </div>

          {/* Question */}
          <h3 style={{ marginBottom: '2rem', lineHeight: 1.5 }}>{question.question}</h3>
          
          {/* Options */}
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            {question.options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleAnswer(index)}
                style={{
                  padding: '1rem',
                  border: '2px solid',
                  borderColor: answers[question.id] === index ? '#3b82f6' : '#d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: answers[question.id] === index ? '#dbeafe' : 'white',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  if (answers[question.id] !== index) {
                    e.target.style.borderColor = '#9ca3af';
                    e.target.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (answers[question.id] !== index) {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.backgroundColor = 'white';
                  }
                }}
              >
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%',
                  backgroundColor: answers[question.id] === index ? '#3b82f6' : '#e5e7eb',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span style={{ flex: 1 }}>{option}</span>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              className="btn" 
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              style={{ 
                opacity: currentQuestion === 0 ? 0.5 : 1,
                backgroundColor: '#6b7280'
              }}
            >
              ← Previous
            </button>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              {currentQuestion === questions.length - 1 ? (
                <button 
                  className="btn" 
                  onClick={submitTest}
                  disabled={loading}
                  style={{ 
                    backgroundColor: '#10b981',
                    padding: '0.75rem 2rem'
                  }}
                >
                  {loading ? 'Submitting...' : '✅ Finish Test'}
                </button>
              ) : (
                <button 
                  className="btn" 
                  onClick={nextQuestion}
                  style={{ padding: '0.75rem 2rem' }}
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Test configuration screen
  return (
    <div>
      <h2>🧠 Aptitude Practice Test</h2>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>📋 Test Configuration</h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category:</label>
            <select
              value={testConfig.category}
              onChange={(e) => setTestConfig({...testConfig, category: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #d1d5db' 
              }}
            >
              <option value="all">All Categories</option>
              <option value="programming">Programming & DS</option>
              <option value="logical">Logical Reasoning</option>
              <option value="technical">Technical Knowledge</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Difficulty:</label>
            <select
              value={testConfig.difficulty}
              onChange={(e) => setTestConfig({...testConfig, difficulty: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #d1d5db' 
              }}
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Questions:</label>
            <select
              value={testConfig.count}
              onChange={(e) => setTestConfig({...testConfig, count: parseInt(e.target.value)})}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #d1d5db' 
              }}
            >
              <option value="10">10 Questions (10 min)</option>
              <option value="30">30 Questions (30 min)</option>
              <option value="60">60 Questions (60 min)</option>
            </select>
          </div>
        </div>

        {/* Test Info */}
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f0f9ff', 
          borderRadius: '6px',
          marginBottom: '2rem'
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#1e40af' }}>📊 Test Information:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>📝 Questions:</strong> {testConfig.count} questions<br/>
              <strong>⏱️ Duration:</strong> {testConfig.count} minutes<br/>
              <strong>📱 Format:</strong> Multiple choice
            </div>
            <div>
              <strong>🎯 Categories:</strong> Programming, Logical, Technical<br/>
              <strong>📈 Difficulty:</strong> Easy, Medium, Hard mix<br/>
              <strong>🏆 Scoring:</strong> Weighted by difficulty
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#fef3c7', 
          borderRadius: '6px',
          marginBottom: '2rem'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#92400e' }}>⚠️ Important Instructions:</h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#92400e' }}>
            <li>Each question has only one correct answer</li>
            <li>You can navigate between questions and change answers</li>
            <li>Test will auto-submit when time expires</li>
            <li>Your performance will be analyzed by AI</li>
            <li>You'll get detailed feedback and improvement areas</li>
          </ul>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button 
            className="btn" 
            onClick={startTest}
            disabled={loading}
            style={{ 
              padding: '1rem 3rem', 
              fontSize: '1.2rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
            }}
          >
            {loading ? '🔄 Loading Questions...' : '🚀 Start Aptitude Test'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AptitudeTest;
