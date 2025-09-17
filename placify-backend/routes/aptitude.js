const express = require('express');
const router = express.Router();
const allQuestions = require('../data/questions');

let testResults = [];

// Get aptitude test questions
router.get('/questions', (req, res) => {
  try {
    const { category, difficulty, count = 60 } = req.query;
    
    let filteredQuestions = [...allQuestions];
    
    if (category && category !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => 
        q.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (difficulty && difficulty !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => 
        q.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }
    
    if (filteredQuestions.length < count) {
      console.log(`⚠️ Only ${filteredQuestions.length} questions available, using all available`);
      filteredQuestions = [...allQuestions];
    }
    
    const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, parseInt(count));
    
    const questionsForTest = selectedQuestions.map(q => ({
      id: q.id,
      category: q.category,
      topic: q.topic,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty
    }));
    
    res.json({
      questions: questionsForTest,
      totalQuestions: selectedQuestions.length,
      availableQuestions: filteredQuestions.length,
      testId: Date.now().toString(),
      timeLimit: parseInt(count) * 60,
      dataset: 'kaggle-enhanced',
      categories: ['Programming', 'Logical', 'Technical']
    });
    
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions from dataset' });
  }
});

// Submit aptitude test
router.post('/submit', (req, res) => {
  try {
    const { testId, answers, studentId, studentName, duration } = req.body;
    
    let score = 0;
    let correctAnswers = 0;
    const results = [];
    const categoryStats = {};
    const topicStats = {};
    
    answers.forEach(answer => {
      const question = allQuestions.find(q => q.id === answer.questionId);
      if (question) {
        const isCorrect = question.correct === answer.selectedOption;
        
        if (isCorrect) {
          correctAnswers++;
          score += question.difficulty === 'Easy' ? 1 : question.difficulty === 'Medium' ? 2 : 3;
        }
        
        // Category statistics
        if (!categoryStats[question.category]) {
          categoryStats[question.category] = { total: 0, correct: 0 };
        }
        categoryStats[question.category].total++;
        if (isCorrect) categoryStats[question.category].correct++;
        
        // Topic statistics  
        if (!topicStats[question.topic]) {
          topicStats[question.topic] = { total: 0, correct: 0 };
        }
        topicStats[question.topic].total++;
        if (isCorrect) topicStats[question.topic].correct++;
        
        results.push({
          questionId: question.id,
          question: question.question,
          topic: question.topic,
          category: question.category,
          difficulty: question.difficulty,
          selectedOption: answer.selectedOption,
          correctOption: question.correct,
          isCorrect,
          explanation: question.explanation
        });
      }
    });
    
    const totalQuestions = answers.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    const testResult = {
      testId,
      studentId,
      studentName,
      score,
      correctAnswers,
      totalQuestions,
      percentage,
      duration,
      results,
      categoryAnalysis: generateCategoryAnalysis(categoryStats),
      topicAnalysis: generateTopicAnalysis(topicStats),
      recommendations: generateDetailedRecommendations(categoryStats, topicStats, percentage),
      completedAt: new Date(),
      performance: getPerformanceLevel(percentage)
    };
    
    testResults.push(testResult);
    
    res.json({
      message: 'Test submitted successfully',
      result: testResult
    });
    
  } catch (error) {
    console.error('Test submission error:', error);
    res.status(500).json({ message: 'Error submitting test' });
  }
});

// Helper functions (move these to utils if needed)
function generateCategoryAnalysis(categoryStats) {
  return Object.keys(categoryStats).map(category => {
    const stat = categoryStats[category];
    const percentage = Math.round((stat.correct / stat.total) * 100);
    return {
      category,
      correct: stat.correct,
      total: stat.total,
      percentage,
      performance: getPerformanceLevel(percentage)
    };
  }).sort((a, b) => b.percentage - a.percentage);
}

function generateTopicAnalysis(topicStats) {
  return Object.keys(topicStats).map(topic => {
    const stat = topicStats[topic];
    const percentage = Math.round((stat.correct / stat.total) * 100);
    return {
      topic,
      correct: stat.correct,
      total: stat.total,
      percentage
    };
  }).sort((a, b) => a.percentage - b.percentage);
}

function generateDetailedRecommendations(categoryStats, topicStats, overallPercentage) {
  const recommendations = [];
  
  if (overallPercentage >= 80) {
    recommendations.push({
      type: 'Overall',
      priority: 'High',
      message: '🎉 Excellent performance! You are interview-ready.',
      action: 'Continue practicing advanced problems and mock interviews.'
    });
  } else if (overallPercentage >= 60) {
    recommendations.push({
      type: 'Overall', 
      priority: 'Medium',
      message: '👍 Good performance! Focus on improvement areas.',
      action: 'Practice more in categories where you scored below 70%.'
    });
  } else {
    recommendations.push({
      type: 'Overall',
      priority: 'High', 
      message: '📚 Significant improvement needed.',
      action: 'Focus on fundamental concepts and daily practice.'
    });
  }
  
  Object.keys(categoryStats).forEach(category => {
    const stat = categoryStats[category];
    const percentage = Math.round((stat.correct / stat.total) * 100);
    
    if (percentage < 50) {
      let suggestion = getCategorySuggestion(category);
      recommendations.push({
        type: 'Category',
        priority: 'High',
        message: `❌ Weak in ${category} (${percentage}%)`,
        action: suggestion
      });
    }
  });
  
  return recommendations;
}

function getCategorySuggestion(category) {
  const suggestions = {
    'Programming': 'Practice data structures, algorithms, and coding problems daily.',
    'Logical': 'Solve puzzles, number series, and reasoning problems regularly.',
    'Technical': 'Study current technologies, frameworks, and industry trends.'
  };
  return suggestions[category] || 'Practice more problems in this area.';
}

function getPerformanceLevel(percentage) {
  if (percentage >= 90) return 'Outstanding';
  if (percentage >= 80) return 'Excellent';  
  if (percentage >= 70) return 'Good';
  if (percentage >= 60) return 'Average';
  if (percentage >= 40) return 'Below Average';
  return 'Needs Improvement';
}

module.exports = router;
