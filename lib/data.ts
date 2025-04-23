import { User, Task, Notification } from '@/types';

export const initialUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    phone: '+1 (555) 123-4567',
    country: 'US',
    role: 'Manager',
    avatar: 'https://i.imgur.com/8Km9tLL.jpg'
  },
  {
    id: 2,
    name: 'Alice Smith',
    email: 'alice@example.com',
    password: 'password123',
    phone: '+1 (555) 234-5678',
    country: 'CA',
    role: 'Admin',
    avatar: 'https://i.imgur.com/3tVgsra.jpg'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'password123',
    phone: '+1 (555) 345-6789',
    country: 'UK',
    role: 'Staff',
    avatar: 'https://i.imgur.com/iNKlGdX.jpg'
  },
  {
    id: 4,
    name: 'Carol Williams',
    email: 'carol@example.com',
    password: 'password123',
    phone: '+1 (555) 456-7890',
    country: 'AU',
    role: 'Staff',
    avatar: 'https://i.imgur.com/Q9HLmAo.jpg'
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david@example.com',
    password: 'password123',
    phone: '+1 (555) 567-8901',
    country: 'DE',
    role: 'Customer',
    avatar: 'https://i.imgur.com/LFQPmcB.jpg'
  },
  {
    id: 6,
    name: 'Eve Taylor',
    email: 'eve@example.com',
    password: 'password123',
    phone: '+1 (555) 678-9012',
    country: 'FR',
    role: 'Customer',
    avatar: 'https://i.imgur.com/BxQJPYU.jpg'
  }
];

export const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Website Redesign',
    description: 'Update the company website with new branding and improved UI/UX',
    category: 'Design',
    priority: 'High',
    dueDate: '2023-07-15',
    completed: false,
    assignedTo: 1,
    subtasks: ['Create wireframes', 'Design new logo', 'Implement responsive layout'],
    notes: 'Focus on mobile-first approach',
    created: '2023-06-30',
    timer: 0
  },
  {
    id: 2,
    title: 'Database Migration',
    description: 'Migrate the current database to the new cloud-based solution',
    category: 'Development',
    priority: 'High',
    dueDate: '2023-07-10',
    completed: false,
    assignedTo: 2,
    subtasks: ['Create backup', 'Test migration script', 'Verify data integrity'],
    notes: 'Schedule downtime with operations team',
    created: '2023-06-28',
    timer: 0
  },
  {
    id: 3,
    title: 'Content Creation',
    description: 'Create new content for the blog section of the website',
    category: 'Marketing',
    priority: 'Medium',
    dueDate: '2023-07-22',
    completed: false,
    assignedTo: 4,
    subtasks: ['Research topics', 'Draft 3 articles', 'Create images'],
    notes: 'Focus on SEO optimization',
    created: '2023-07-01',
    timer: 0
  },
  {
    id: 4,
    title: 'User Testing',
    description: 'Conduct user testing sessions for the new application features',
    category: 'Research',
    priority: 'Medium',
    dueDate: '2023-07-28',
    completed: false,
    assignedTo: 3,
    subtasks: ['Recruit participants', 'Prepare test scenarios', 'Compile results'],
    notes: 'Target 10-15 participants',
    created: '2023-07-02',
    timer: 0
  },
  {
    id: 5,
    title: 'Security Audit',
    description: 'Perform a comprehensive security audit of all systems',
    category: 'Development',
    priority: 'High',
    dueDate: '2023-07-08',
    completed: false,
    assignedTo: 1,
    subtasks: ['Review access controls', 'Test for vulnerabilities', 'Document findings'],
    notes: 'Focus on API endpoints',
    created: '2023-06-25',
    timer: 0
  },
  {
    id: 6,
    title: 'Marketing Campaign',
    description: 'Plan and execute Q3 marketing campaign',
    category: 'Marketing',
    priority: 'Medium',
    dueDate: '2023-07-30',
    completed: true,
    assignedTo: 4,
    subtasks: ['Define target audience', 'Create social media plan', 'Prepare email templates'],
    notes: 'Budget: $5,000',
    created: '2023-06-20',
    timer: 3600
  },
  {
    id: 7,
    title: 'Bug Fixes',
    description: 'Address critical bugs reported in the latest release',
    category: 'Development',
    priority: 'High',
    dueDate: '2023-07-05',
    completed: true,
    assignedTo: 3,
    subtasks: ['Reproduce issues', 'Implement fixes', 'Write tests'],
    notes: 'Focus on high-priority issues first',
    created: '2023-07-01',
    timer: 7200
  },
  {
    id: 8,
    title: 'Client Presentation',
    description: 'Prepare and deliver presentation for potential client',
    category: 'Marketing',
    priority: 'Medium',
    dueDate: '2023-07-18',
    completed: false,
    assignedTo: 2,
    subtasks: ['Create slides', 'Prepare demo', 'Practice presentation'],
    notes: 'Focus on new features and benefits',
    created: '2023-07-01',
    timer: 0
  },
  {
    id: 9,
    title: 'Optimize Performance',
    description: 'Identify and fix performance bottlenecks in the application',
    category: 'Development',
    priority: 'Low',
    dueDate: '2023-08-05',
    completed: false,
    assignedTo: 1,
    subtasks: ['Profile application', 'Optimize database queries', 'Reduce load times'],
    notes: 'Target 30% improvement',
    created: '2023-07-02',
    timer: 0
  },
  {
    id: 10,
    title: 'Annual Report',
    description: 'Compile data and create annual report for stakeholders',
    category: 'Research',
    priority: 'Medium',
    dueDate: '2023-08-15',
    completed: false,
    assignedTo: 4,
    subtasks: ['Gather financial data', 'Write executive summary', 'Design charts and graphics'],
    notes: 'Include growth projections',
    created: '2023-06-28',
    timer: 0
  },
  {
    id: 11,
    title: 'Code Review',
    description: 'Perform code review for the new feature branches',
    category: 'Development',
    priority: 'Low',
    dueDate: '2023-07-25',
    completed: true,
    assignedTo: 3,
    subtasks: ['Review PRs', 'Provide feedback', 'Approve changes'],
    notes: 'Focus on code quality and standards',
    created: '2023-07-01',
    timer: 1800
  },
  {
    id: 12,
    title: 'Vendor Selection',
    description: 'Evaluate and select new vendors for office supplies',
    category: 'Research',
    priority: 'Low',
    dueDate: '2023-08-10',
    completed: true,
    assignedTo: 2,
    subtasks: ['Research options', 'Request quotes', 'Compare offers'],
    notes: 'Budget: $2,000/month',
    created: '2023-06-15',
    timer: 5400
  }
];

export const initialNotifications: Notification[] = [
  {
    id: 1,
    title: 'Task Deadline Approaching',
    message: 'Task "Website Redesign" is due in 2 days',
    read: false
  },
  {
    id: 2,
    title: 'New Task Assigned',
    message: 'You have been assigned to "Database Migration"',
    read: false
  },
  {
    id: 3,
    title: 'Task Completed',
    message: '"Prototype Testing" was marked as complete',
    read: false
  }
];