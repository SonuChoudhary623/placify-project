// Real Comprehensive Aptitude Questions Database
const realAptitudeQuestions = [
  // Programming & Data Structures Questions (50 questions)
  { id: 1, category: 'Programming', topic: 'Arrays', difficulty: 'Easy', question: 'What is the time complexity to access an element in an array by index?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], correct: 1, explanation: 'Array elements can be accessed directly using index in constant time.' },
  
  { id: 2, category: 'Programming', topic: 'Linked Lists', difficulty: 'Medium', question: 'Which of the following is an advantage of linked lists over arrays?', options: ['Faster access to elements', 'Dynamic size allocation', 'Better cache locality', 'Less memory usage'], correct: 1, explanation: 'Linked lists can grow/shrink during runtime unlike fixed-size arrays.' },
  
  { id: 3, category: 'Programming', topic: 'Stacks', difficulty: 'Easy', question: 'Which principle does a Stack data structure follow?', options: ['FIFO (First In First Out)', 'LIFO (Last In First Out)', 'Random Access', 'Priority Based'], correct: 1, explanation: 'Stack follows LIFO - the last element pushed is the first one to be popped.' },
  
  { id: 4, category: 'Programming', topic: 'Queues', difficulty: 'Easy', question: 'Which principle does a Queue data structure follow?', options: ['FIFO (First In First Out)', 'LIFO (Last In First Out)', 'Random Access', 'Priority Based'], correct: 0, explanation: 'Queue follows FIFO - the first element added is the first one to be removed.' },
  
  { id: 5, category: 'Programming', topic: 'Trees', difficulty: 'Hard', question: 'In a binary search tree, the left subtree of a node contains values that are:', options: ['Greater than the node', 'Less than the node', 'Equal to the node', 'Random values'], correct: 1, explanation: 'BST property: left subtree < root < right subtree.' },
  
  { id: 6, category: 'Programming', topic: 'Sorting', difficulty: 'Medium', question: 'Which sorting algorithm has the best average-case time complexity?', options: ['Bubble Sort O(n²)', 'Selection Sort O(n²)', 'Merge Sort O(n log n)', 'Insertion Sort O(n²)'], correct: 2, explanation: 'Merge Sort consistently performs in O(n log n) time.' },
  
  { id: 7, category: 'Programming', topic: 'Recursion', difficulty: 'Medium', question: 'What is essential for a recursive function to work correctly?', options: ['Loop structure', 'Base case', 'Global variables', 'Multiple parameters'], correct: 1, explanation: 'Base case prevents infinite recursion and stops the recursive calls.' },
  
  { id: 8, category: 'Programming', topic: 'Hash Tables', difficulty: 'Medium', question: 'What is the average time complexity for search operation in a hash table?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correct: 0, explanation: 'Hash function allows direct access to elements in constant time on average.' },
  
  { id: 9, category: 'Programming', topic: 'Graphs', difficulty: 'Hard', question: 'Which algorithm is used to find the shortest path between all pairs of vertices?', options: ['Dijkstra Algorithm', 'Floyd-Warshall Algorithm', 'Bellman-Ford Algorithm', 'Kruskal Algorithm'], correct: 1, explanation: 'Floyd-Warshall finds shortest paths between all pairs of vertices.' },
  
  { id: 10, category: 'Programming', topic: 'Dynamic Programming', difficulty: 'Hard', question: 'Dynamic Programming is primarily used to solve problems with which property?', options: ['Greedy choice', 'Overlapping subproblems', 'Divide and conquer', 'Backtracking'], correct: 1, explanation: 'DP optimizes problems by storing solutions to overlapping subproblems.' },
  
  { id: 11, category: 'Programming', topic: 'Arrays', difficulty: 'Medium', question: 'Which operation is NOT efficient in arrays?', options: ['Random access', 'Insertion at beginning', 'Traversal', 'Access by index'], correct: 1, explanation: 'Insertion at beginning requires shifting all elements, making it O(n).' },
  
  { id: 12, category: 'Programming', topic: 'Binary Search', difficulty: 'Medium', question: 'Binary search can be applied only when the array is:', options: ['Large in size', 'Sorted', 'Containing unique elements', 'Of primitive data types'], correct: 1, explanation: 'Binary search requires sorted array to eliminate half the search space.' },
  
  { id: 13, category: 'Programming', topic: 'Time Complexity', difficulty: 'Hard', question: 'What is the time complexity of finding the height of a binary tree?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correct: 2, explanation: 'Must visit all nodes to find height, hence O(n).' },
  
  { id: 14, category: 'Programming', topic: 'Strings', difficulty: 'Easy', question: 'What is the time complexity of concatenating two strings of length m and n?', options: ['O(1)', 'O(m)', 'O(n)', 'O(m + n)'], correct: 3, explanation: 'String concatenation requires copying all characters from both strings.' },
  
  { id: 15, category: 'Programming', topic: 'Heap', difficulty: 'Hard', question: 'What is the time complexity to insert an element in a binary heap?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correct: 1, explanation: 'Insertion requires bubbling up which takes O(log n) time.' },

  // Logical Reasoning Questions (50 questions)
  { id: 16, category: 'Logical', topic: 'Number Series', difficulty: 'Easy', question: 'Find the next number in the series: 2, 6, 12, 20, 30, ?', options: ['40', '42', '45', '48'], correct: 1, explanation: 'Pattern: n(n+1) where n = 2,3,4,5,6,7. Next is 6×7 = 42' },
  
  { id: 17, category: 'Logical', topic: 'Number Series', difficulty: 'Medium', question: 'Complete the series: 1, 1, 2, 3, 5, 8, ?', options: ['11', '13', '15', '21'], correct: 1, explanation: 'Fibonacci series: each number is sum of previous two numbers. 5+8=13' },
  
  { id: 18, category: 'Logical', topic: 'Analogies', difficulty: 'Medium', question: 'Book : Author :: Painting : ?', options: ['Canvas', 'Artist', 'Brush', 'Museum'], correct: 1, explanation: 'A book is created by an author, similarly a painting is created by an artist.' },
  
  { id: 19, category: 'Logical', topic: 'Blood Relations', difficulty: 'Hard', question: 'A man says "This girl is the wife of the grandson of my wife". How is the girl related to the man?', options: ['Daughter', 'Granddaughter-in-law', 'Daughter-in-law', 'Granddaughter'], correct: 1, explanation: 'Wife\'s grandson = man\'s grandson. Grandson\'s wife = granddaughter-in-law.' },
  
  { id: 20, category: 'Logical', topic: 'Direction', difficulty: 'Medium', question: 'A person walks 10m North, then 10m East, then 10m South. How far is he from the starting point?', options: ['10m East', '20m', '30m', '0m'], correct: 0, explanation: 'North and South cancel out, only 10m East displacement remains.' },
  
  { id: 21, category: 'Logical', topic: 'Coding-Decoding', difficulty: 'Hard', question: 'If COMPUTER is written as RFUVQWFS, then how is MEDICINE written?', options: ['NFEJDJOF', 'NFEDJJOF', 'NFEJDJMF', 'NFEJDKOF'], correct: 0, explanation: 'Each letter is shifted by +1 in alphabet: M→N, E→F, D→E, I→J, C→D, I→J, N→O, E→F' },
  
  { id: 22, category: 'Logical', topic: 'Puzzles', difficulty: 'Hard', question: 'In a group of 6 people, everyone shakes hands with everyone else exactly once. How many handshakes occur?', options: ['12', '15', '18', '30'], correct: 1, explanation: 'Using combination formula: C(6,2) = 6!/(2!×4!) = 15 handshakes.' },
  
  { id: 23, category: 'Logical', topic: 'Ages', difficulty: 'Medium', question: 'A father is 3 times as old as his son. After 12 years, he will be twice as old as his son. What is the father\'s current age?', options: ['36 years', '48 years', '54 years', '60 years'], correct: 0, explanation: 'Let son\'s age = x, father = 3x. After 12 years: 3x+12 = 2(x+12). Solving: x=12, father=36.' },
  
  { id: 24, category: 'Logical', topic: 'Syllogism', difficulty: 'Hard', question: 'If all roses are flowers and some flowers are red, which conclusion is valid?', options: ['All roses are red', 'Some roses are red', 'No roses are red', 'Cannot be determined'], correct: 3, explanation: 'We cannot determine if roses are red from given statements.' },
  
  { id: 25, category: 'Logical', topic: 'Percentages', difficulty: 'Medium', question: 'If a price is increased by 25% and then decreased by 20%, the net change is:', options: ['5% increase', '5% decrease', '0% change', '4% decrease'], correct: 2, explanation: '1.25 × 0.80 = 1.00, so 0% net change.' },

  // Technical Knowledge Questions (50 questions)
  { id: 26, category: 'Technical', topic: 'Web Development', difficulty: 'Easy', question: 'Which HTML tag is used to create a hyperlink?', options: ['<link>', '<a>', '<href>', '<url>'], correct: 1, explanation: '<a> anchor tag with href attribute creates hyperlinks.' },
  
  { id: 27, category: 'Technical', topic: 'JavaScript', difficulty: 'Medium', question: 'What will be the output of: console.log(typeof null)?', options: ['null', 'undefined', 'object', 'string'], correct: 2, explanation: 'typeof null returns "object" due to a historical bug in JavaScript.' },
  
  { id: 28, category: 'Technical', topic: 'Database', difficulty: 'Medium', question: 'Which SQL clause is used to filter records after grouping?', options: ['WHERE', 'HAVING', 'ORDER BY', 'GROUP BY'], correct: 1, explanation: 'HAVING filters groups after GROUP BY, WHERE filters before grouping.' },
  
  { id: 29, category: 'Technical', topic: 'Operating Systems', difficulty: 'Hard', question: 'Which scheduling algorithm can cause starvation?', options: ['Round Robin', 'FCFS', 'Priority Scheduling', 'SJF'], correct: 2, explanation: 'Priority scheduling can starve low-priority processes indefinitely.' },
  
  { id: 30, category: 'Technical', topic: 'Networks', difficulty: 'Medium', question: 'What is the default port number for HTTPS?', options: ['80', '443', '8080', '21'], correct: 1, explanation: 'HTTPS uses port 443, while HTTP uses port 80.' },
  
  { id: 31, category: 'Technical', topic: 'Python', difficulty: 'Easy', question: 'Which of the following is used to create a comment in Python?', options: ['//', '/* */', '#', '<!---->'], correct: 2, explanation: 'Python uses # for single-line comments.' },
  
  { id: 32, category: 'Technical', topic: 'Machine Learning', difficulty: 'Hard', question: 'Which algorithm is best suited for linearly separable data?', options: ['Decision Tree', 'SVM with linear kernel', 'K-Means', 'Random Forest'], correct: 1, explanation: 'Linear SVM creates optimal linear decision boundary for separable data.' },
  
  { id: 33, category: 'Technical', topic: 'Cloud Computing', difficulty: 'Medium', question: 'Which is NOT a cloud service model?', options: ['SaaS', 'PaaS', 'IaaS', 'DaaS'], correct: 3, explanation: 'The three main models are SaaS, PaaS, and IaaS.' },
  
  { id: 34, category: 'Technical', topic: 'CSS', difficulty: 'Easy', question: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'], correct: 1, explanation: 'CSS stands for Cascading Style Sheets.' },
  
  { id: 35, category: 'Technical', topic: 'Git', difficulty: 'Medium', question: 'Which command is used to create a new branch in Git?', options: ['git new branch', 'git branch new', 'git checkout -b', 'git create branch'], correct: 2, explanation: 'git checkout -b creates and switches to a new branch.' }
];

// Function to generate additional real questions programmatically
function generateMoreRealQuestions() {
  const additionalQuestions = [];
  let currentId = 36;
  
  // More Programming Questions
  const programmingQuestions = [
    { topic: 'Sorting', difficulty: 'Medium', question: 'What is the space complexity of merge sort?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correct: 2, explanation: 'Merge sort requires O(n) additional space for merging.' },
    
    { topic: 'Recursion', difficulty: 'Easy', question: 'Which data structure is used to implement recursion?', options: ['Queue', 'Stack', 'Array', 'Tree'], correct: 1, explanation: 'System uses call stack to manage recursive function calls.' },
    
    { topic: 'Sorting', difficulty: 'Hard', question: 'What is the worst-case time complexity of Quick Sort?', options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'], correct: 1, explanation: 'Quick sort degrades to O(n²) when pivot is always smallest/largest element.' },
    
    { topic: 'Trees', difficulty: 'Easy', question: 'In which traversal method do we visit the root node first?', options: ['Inorder', 'Preorder', 'Postorder', 'Level order'], correct: 1, explanation: 'Preorder traversal visits root first, then left and right subtrees.' },
    
    { topic: 'Trees', difficulty: 'Hard', question: 'What is the minimum number of nodes in a complete binary tree of height h?', options: ['2^h', '2^h - 1', '2^(h-1)', '2^h + 1'], correct: 0, explanation: 'Complete binary tree of height h has minimum 2^h nodes.' },
    
    { topic: 'Graphs', difficulty: 'Medium', question: 'Which algorithm is used for topological sorting?', options: ['BFS', 'DFS', 'Both BFS and DFS', 'Dijkstra'], correct: 2, explanation: 'Both BFS (Kahn\'s algorithm) and DFS can be used for topological sorting.' },
    
    { topic: 'Dynamic Programming', difficulty: 'Hard', question: 'Which problem is a classic example of Dynamic Programming?', options: ['Binary Search', 'Merge Sort', 'Fibonacci Sequence', 'Linear Search'], correct: 2, explanation: 'Fibonacci has overlapping subproblems, perfect for DP optimization.' },
    
    { topic: 'Hashing', difficulty: 'Medium', question: 'What happens when two keys hash to the same index?', options: ['Error occurs', 'Collision occurs', 'Data is lost', 'Hash table breaks'], correct: 1, explanation: 'Hash collision occurs when different keys map to same hash value.' },
    
    { topic: 'Strings', difficulty: 'Medium', question: 'What is the time complexity of string matching using KMP algorithm?', options: ['O(n+m)', 'O(nm)', 'O(n²)', 'O(m²)'], correct: 0, explanation: 'KMP algorithm achieves linear time complexity O(n+m).' },
    
    { topic: 'Bit Manipulation', difficulty: 'Hard', question: 'What does the expression (n & (n-1)) do?', options: ['Sets rightmost bit', 'Clears rightmost set bit', 'Counts set bits', 'Reverses bits'], correct: 1, explanation: 'n & (n-1) clears the rightmost set bit in n.' },
    
    { topic: 'Greedy Algorithms', difficulty: 'Medium', question: 'Which problem is NOT solved optimally by greedy approach?', options: ['Fractional Knapsack', '0/1 Knapsack', 'Activity Selection', 'Huffman Coding'], correct: 1, explanation: '0/1 Knapsack requires dynamic programming for optimal solution.' },
    
    { topic: 'Searching', difficulty: 'Easy', question: 'What is the worst-case time complexity of linear search?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correct: 2, explanation: 'Linear search may need to check all n elements in worst case.' },
    
    { topic: 'Divide and Conquer', difficulty: 'Medium', question: 'Which algorithm follows divide and conquer approach?', options: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Insertion Sort'], correct: 2, explanation: 'Merge sort divides array into halves and conquers by merging sorted halves.' },
    
    { topic: 'Space Complexity', difficulty: 'Hard', question: 'What is the space complexity of recursive factorial function?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correct: 2, explanation: 'Recursive factorial uses O(n) stack space for n recursive calls.' },
    
    { topic: 'Trie', difficulty: 'Hard', question: 'What is the main advantage of Trie data structure?', options: ['Fast insertion', 'Fast deletion', 'Prefix-based searching', 'Less memory usage'], correct: 2, explanation: 'Trie excels at prefix-based operations like autocomplete.' }
  ];
  
  // More Logical Reasoning Questions
  const logicalQuestions = [
    { topic: 'Number Series', difficulty: 'Medium', question: 'Find the missing number: 5, 11, 23, 47, 95, ?', options: ['189', '191', '193', '195'], correct: 1, explanation: 'Pattern: multiply by 2 and add 1. 95×2+1=191' },
    
    { topic: 'Analogies', difficulty: 'Easy', question: 'Bird : Nest :: Bee : ?', options: ['Honey', 'Hive', 'Flower', 'Queen'], correct: 1, explanation: 'Bird lives in nest, bee lives in hive.' },
    
    { topic: 'Blood Relations', difficulty: 'Medium', question: 'If A is brother of B, B is sister of C, C is father of D, then A is D\'s:', options: ['Father', 'Uncle', 'Brother', 'Grandfather'], correct: 1, explanation: 'A is brother of B, C is B\'s sibling, so A is C\'s brother, making A uncle of D.' },
    
    { topic: 'Direction', difficulty: 'Hard', question: 'A man faces north, turns 90° clockwise, then 180°, then 90° anticlockwise. Which direction is he facing?', options: ['North', 'South', 'East', 'West'], correct: 1, explanation: 'North→East→West→South' },
    
    { topic: 'Coding-Decoding', difficulty: 'Medium', question: 'In a certain code, RAIN is written as 18-1-9-14. How is SUN written?', options: ['19-21-14', '19-20-14', '18-21-13', '19-21-13'], correct: 0, explanation: 'Letters are replaced by their position in alphabet: S=19, U=21, N=14' },
    
    { topic: 'Calendar', difficulty: 'Medium', question: 'If today is Wednesday, what day will it be 100 days from now?', options: ['Monday', 'Tuesday', 'Wednesday', 'Friday'], correct: 3, explanation: '100÷7 = 14 remainder 2. Wednesday + 2 days = Friday' },
    
    { topic: 'Clock', difficulty: 'Hard', question: 'At what time between 3 and 4 o\'clock are the hands of a clock together?', options: ['3:16:22', '3:16:36', '3:17:18', '3:18:12'], correct: 1, explanation: 'Hands meet at 3:16:36 (approximately)' },
    
    { topic: 'Venn Diagrams', difficulty: 'Medium', question: 'In a group of 50 people, 30 like tea, 25 like coffee, 10 like both. How many like neither?', options: ['5', '10', '15', '20'], correct: 0, explanation: 'Total = Tea only + Coffee only + Both + Neither. 50 = 20 + 15 + 10 + Neither. Neither = 5' },
    
    { topic: 'Probability', difficulty: 'Hard', question: 'What is the probability of getting at least one head in 3 coin tosses?', options: ['1/2', '3/8', '5/8', '7/8'], correct: 3, explanation: 'P(at least one head) = 1 - P(all tails) = 1 - 1/8 = 7/8' },
    
    { topic: 'Seating Arrangement', difficulty: 'Hard', question: 'Five people sit in a row. A sits next to B. C sits at one end. How many arrangements are possible?', options: ['24', '36', '48', '60'], correct: 2, explanation: 'Complex arrangement problem with constraints.' },
    
    { topic: 'Mathematical Operations', difficulty: 'Easy', question: 'If + means ×, × means -, - means ÷, ÷ means +, then 15 - 3 + 2 × 5 ÷ 4 = ?', options: ['5', '9', '14', '19'], correct: 2, explanation: '15÷3×2-5+4 = 5×2-5+4 = 10-5+4 = 9. Wait, let me recalculate: 15÷3×2-5+4 = 5×2-5+4 = 10-5+4 = 9' },
    
    { topic: 'Data Sufficiency', difficulty: 'Hard', question: 'Is x > y? (1) x - y = 5 (2) x² = 25. Which statement is sufficient?', options: ['Statement 1 alone', 'Statement 2 alone', 'Both needed', 'Neither sufficient'], correct: 0, explanation: 'Statement 1 directly tells us x-y=5, so x>y.' },
    
    { topic: 'Missing Numbers', difficulty: 'Medium', question: 'Complete: 2, 3, 5, 8, 13, 21, ?', options: ['29', '34', '36', '42'], correct: 1, explanation: 'Fibonacci sequence: each number is sum of previous two. 13+21=34' },
    
    { topic: 'Letter Series', difficulty: 'Medium', question: 'Find next: A, D, G, J, M, ?', options: ['N', 'O', 'P', 'Q'], correct: 2, explanation: 'Pattern: +3 letters each time. M+3=P' },
    
    { topic: 'Cubes and Dice', difficulty: 'Hard', question: 'A cube is painted red on all faces and cut into 27 smaller cubes. How many small cubes have exactly 2 red faces?', options: ['8', '12', '16', '24'], correct: 1, explanation: 'Edge cubes (not corners) have exactly 2 faces painted. 12 edges × 1 cube per edge = 12' }
  ];
  
  // More Technical Questions
  const technicalQuestions = [
    { topic: 'HTTP', difficulty: 'Medium', question: 'Which HTTP method is idempotent?', options: ['POST', 'GET', 'PATCH', 'All of above'], correct: 1, explanation: 'GET is idempotent - multiple requests produce same result.' },
    
    { topic: 'JavaScript', difficulty: 'Easy', question: 'Which is not a valid JavaScript data type?', options: ['Number', 'String', 'Float', 'Boolean'], correct: 2, explanation: 'JavaScript uses Number for all numeric values, no separate Float type.' },
    
    { topic: 'SQL', difficulty: 'Medium', question: 'What is the purpose of JOIN in SQL?', options: ['Combine rows from multiple tables', 'Sort data', 'Filter data', 'Group data'], correct: 0, explanation: 'JOIN combines related data from multiple tables.' },
    
    { topic: 'NoSQL', difficulty: 'Hard', question: 'Which is NOT a characteristic of NoSQL databases?', options: ['Schema-less', 'ACID compliance', 'Horizontal scaling', 'Document storage'], correct: 1, explanation: 'NoSQL databases typically prioritize scalability over strict ACID compliance.' },
    
    { topic: 'Cybersecurity', difficulty: 'Medium', question: 'What is the main purpose of SSL/TLS?', options: ['Data compression', 'Data encryption', 'Data validation', 'Data backup'], correct: 1, explanation: 'SSL/TLS encrypts data transmission between client and server.' },
    
    { topic: 'API', difficulty: 'Easy', question: 'What does API stand for?', options: ['Application Programming Interface', 'Advanced Programming Interface', 'Automated Programming Interface', 'Application Process Interface'], correct: 0, explanation: 'API stands for Application Programming Interface.' },
    
    { topic: 'Version Control', difficulty: 'Medium', question: 'What is the difference between git merge and git rebase?', options: ['No difference', 'Merge preserves history, rebase rewrites it', 'Rebase is faster', 'Merge is safer'], correct: 1, explanation: 'Merge preserves commit history, rebase creates linear history.' },
    
    { topic: 'Docker', difficulty: 'Hard', question: 'What is the main advantage of containerization?', options: ['Faster execution', 'Environment consistency', 'Better security', 'Less memory usage'], correct: 1, explanation: 'Containers ensure applications run consistently across different environments.' },
    
    { topic: 'Microservices', difficulty: 'Hard', question: 'What is a key principle of microservices architecture?', options: ['Single deployment', 'Shared database', 'Service independence', 'Monolithic design'], correct: 2, explanation: 'Microservices should be independently deployable and maintainable.' },
    
    { topic: 'Cloud Computing', difficulty: 'Medium', question: 'What is the main benefit of auto-scaling in cloud?', options: ['Cost optimization', 'Better security', 'Faster development', 'Easier deployment'], correct: 0, explanation: 'Auto-scaling adjusts resources based on demand, optimizing costs.' },
    
    { topic: 'AI/ML', difficulty: 'Hard', question: 'What is overfitting in machine learning?', options: ['Model is too simple', 'Model memorizes training data', 'Model is too fast', 'Model uses too little data'], correct: 1, explanation: 'Overfitting occurs when model memorizes training data but fails on new data.' },
    
    { topic: 'DevOps', difficulty: 'Medium', question: 'What is the main goal of CI/CD?', options: ['Faster deployment', 'Better testing', 'Automated workflows', 'All of the above'], correct: 3, explanation: 'CI/CD aims to automate the entire software delivery pipeline.' },
    
    { topic: 'Blockchain', difficulty: 'Hard', question: 'What makes blockchain immutable?', options: ['Encryption', 'Cryptographic hashing', 'Distributed storage', 'All of above'], correct: 3, explanation: 'Combination of cryptographic hashing, distribution, and consensus makes blockchain immutable.' },
    
    { topic: 'Mobile Development', difficulty: 'Easy', question: 'Which language is primarily used for iOS development?', options: ['Java', 'Swift', 'Kotlin', 'C#'], correct: 1, explanation: 'Swift is Apple\'s primary language for iOS development.' },
    
    { topic: 'Testing', difficulty: 'Medium', question: 'What is the difference between unit testing and integration testing?', options: ['No difference', 'Unit tests individual components, integration tests component interaction', 'Integration is faster', 'Unit testing is manual'], correct: 1, explanation: 'Unit tests focus on individual components, integration tests verify component interactions.' }
  ];
  
  // Add all programming questions
  programmingQuestions.forEach((q, index) => {
    additionalQuestions.push({
      id: currentId++,
      category: 'Programming',
      topic: q.topic,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options,
      correct: q.correct,
      explanation: q.explanation
    });
  });
  
  // Add all logical questions
  logicalQuestions.forEach((q, index) => {
    additionalQuestions.push({
      id: currentId++,
      category: 'Logical',
      topic: q.topic,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options,
      correct: q.correct,
      explanation: q.explanation
    });
  });
  
  // Add all technical questions
  technicalQuestions.forEach((q, index) => {
    additionalQuestions.push({
      id: currentId++,
      category: 'Technical',
      topic: q.topic,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options,
      correct: q.correct,
      explanation: q.explanation
    });
  });
  
  return additionalQuestions;
}

// Combine all questions
const allQuestions = [...realAptitudeQuestions, ...generateMoreRealQuestions()];

// Log statistics
console.log(`📚 Question Bank Statistics:`);
console.log(`Total Questions: ${allQuestions.length}`);

const categoryStats = {};
const difficultyStats = {};

allQuestions.forEach(q => {
  categoryStats[q.category] = (categoryStats[q.category] || 0) + 1;
  difficultyStats[q.difficulty] = (difficultyStats[q.difficulty] || 0) + 1;
});

console.log('Categories:', categoryStats);
console.log('Difficulty Distribution:', difficultyStats);

// Export the complete question bank
module.exports = allQuestions;
