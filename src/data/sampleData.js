export const sampleUsers = [
  { id: 'admin-1', name: 'Prof. Gorbal Mam', role:'admin' },
  { id: 'stu-1', name: 'Deven Student', role: 'student' },
  { id: 'stu-2', name: 'Viraj Student', role: 'student' },
  { id: 'stu-3', name: 'Vaibhav Student', role: 'student' },
];

export const sampleAssignments = [
  {
    id: 'a-1',
    title: 'Python Basics Assignment',
    dueDate: '2025-11-15',
    driveLink: 'https://drive.google.com/drive/u/0/folders/17jldKDlMV46F26eZTwvTjvkqPt57-zNI',
    creatorId: 'admin-1',
    assignedTo: ['stu-1', 'stu-2', 'stu-3'],
    submissions: { 'stu-1': false, 'stu-2': false, 'stu-3': false },
  },
];
