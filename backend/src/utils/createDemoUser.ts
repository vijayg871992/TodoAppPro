import User from '../models/User';
import Task from '../models/Task';

export const createDemoUser = async () => {
  try {
    const demoEmail = 'VijjuProMax@demo.com';
    const existingUser = await User.findOne({ email: demoEmail });
    
    let demoUser;
    
    if (!existingUser) {
      demoUser = new User({
        email: demoEmail,
        password: 'VijjuProMax871992',
        name: 'VijjuProMax'
      });
      
      await demoUser.save();
      console.log('✅ Demo user created: VijjuProMax@demo.com / VijjuProMax871992');
    } else {
      demoUser = existingUser;
      console.log('✅ Demo user already exists: VijjuProMax@demo.com');
    }

    // Create demo tasks if they don't exist
    const existingTasks = await Task.find({ userId: demoUser._id });
    
    if (existingTasks.length === 0) {
      const demoTasks = [
        {
          userId: demoUser._id,
          title: '🚀 Launch TodoAppPro MVP',
          description: 'Complete the initial version of TodoAppPro with all 19 DSAs implemented',
          priority: 'Critical',
          status: 'Completed',
          category: 'Development',
          tags: ['mvp', 'launch', 'dsa'],
          estimatedTime: 120,
          actualTime: 95,
          dueDate: new Date('2025-08-05'),
          flags: 0b10 // Starred
        },
        {
          userId: demoUser._id,
          title: '📊 Implement Analytics Dashboard',
          description: 'Create beautiful analytics with productivity insights and trend visualization',
          priority: 'High',
          status: 'Completed',
          category: 'Frontend',
          tags: ['analytics', 'dashboard', 'visualization'],
          estimatedTime: 80,
          actualTime: 85,
          dueDate: new Date('2025-08-08'),
          flags: 0b10 // Starred
        },
        {
          userId: demoUser._id,
          title: '🔐 Add User Authentication',
          description: 'Implement secure JWT-based authentication with bcrypt password hashing',
          priority: 'High',
          status: 'Completed',
          category: 'Security',
          tags: ['auth', 'jwt', 'security'],
          estimatedTime: 90,
          actualTime: 75,
          dueDate: new Date('2025-08-09'),
          flags: 0b00
        },
        {
          userId: demoUser._id,
          title: '🎨 Design Premium UI Components',
          description: 'Create royal and professional looking login screen with premium colors',
          priority: 'Medium',
          status: 'In Progress',
          category: 'Design',
          tags: ['ui', 'design', 'premium'],
          estimatedTime: 60,
          actualTime: 0,
          dueDate: new Date('2025-08-11'),
          flags: 0b00
        },
        {
          userId: demoUser._id,
          title: '📚 Write Educational Documentation',
          description: 'Create comprehensive learning guides explaining all 19 DSAs with child-friendly analogies',
          priority: 'Medium',
          status: 'Completed',
          category: 'Documentation',
          tags: ['docs', 'education', 'guides'],
          estimatedTime: 150,
          actualTime: 180,
          dueDate: new Date('2025-08-09'),
          flags: 0b00
        },
        {
          userId: demoUser._id,
          title: '🧪 Write Unit Tests',
          description: 'Add comprehensive test coverage for all DSA implementations and API endpoints',
          priority: 'Medium',
          status: 'Pending',
          category: 'Testing',
          tags: ['testing', 'unit-tests', 'coverage'],
          estimatedTime: 120,
          actualTime: 0,
          dueDate: new Date('2025-08-15'),
          flags: 0b00
        },
        {
          userId: demoUser._id,
          title: '📱 Add Mobile Responsiveness',
          description: 'Ensure TodoAppPro works perfectly on all mobile devices and tablets',
          priority: 'Low',
          status: 'Pending',
          category: 'Frontend',
          tags: ['mobile', 'responsive', 'ui'],
          estimatedTime: 40,
          actualTime: 0,
          dueDate: new Date('2025-08-20'),
          flags: 0b00
        },
        {
          userId: demoUser._id,
          title: '⚡ Performance Optimization',
          description: 'Optimize database queries and implement caching for better performance',
          priority: 'Low',
          status: 'Pending',
          category: 'Performance',
          tags: ['optimization', 'caching', 'database'],
          estimatedTime: 80,
          actualTime: 0,
          dueDate: new Date('2025-08-25'),
          flags: 0b00
        },
        {
          userId: demoUser._id,
          title: '🔍 Bug Fixes & Polish',
          description: 'Fix any remaining bugs and polish the user experience',
          priority: 'High',
          status: 'In Progress',
          category: 'Maintenance',
          tags: ['bugs', 'polish', 'ux'],
          estimatedTime: 60,
          actualTime: 0,
          dueDate: new Date('2025-08-12'),
          flags: 0b00
        }
      ];

      await Task.insertMany(demoTasks);
      console.log(`✅ ${demoTasks.length} demo tasks created for demo user`);
    } else {
      console.log(`✅ Demo user already has ${existingTasks.length} tasks`);
    }
  } catch (error) {
    console.error('Failed to create demo user and tasks:', error);
  }
};