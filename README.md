# TodoAppPro — TypeScript Task Manager with DSA-backed Search & Scheduling

Production app demonstrating 19 Data Structures & Algorithms applied to real features (Trie autocomplete, heap scheduling, graph deps). Deployed at [vijayg.dev/todoapppro](https://vijayg.dev/todoapppro).

**Tech**: React + TS, Node/Express + TS, MongoDB, JWT/Google OAuth, WebSockets.

**Live Demo**: [vijayg.dev/todoapppro](https://vijayg.dev/todoapppro)

**Demo Access**: Click "Demo Login" (ephemeral seeded account; data resets nightly).

**API Base**: https://vijayg.dev/todoapppro/api

**Benchmarks**: see `/docs/benchmarks.md` (methodology + raw runs).

## 🎯 Live Demo

- 🌐 **Production URL**: [https://vijayg.dev/todoapppro](https://vijayg.dev/todoapppro)
- 👤 **Demo Access**: Click "Demo Login" → seeded demo account (rate limited, resets nightly)
- 🚀 **Features**: DSA-powered task management, analytics, search algorithms
- 🔧 **API Endpoint**: `https://vijayg.dev/todoapppro/api`

### Quick API Test
```bash
# Test health endpoint
curl https://vijayg.dev/todoapppro/api/health

# Get tasks (authenticated)
curl https://vijayg.dev/todoapppro/api/tasks \
  -H "Authorization: Bearer <token>"

# Get analytics
curl https://vijayg.dev/todoapppro/api/analytics \
  -H "Authorization: Bearer <token>"
```

## 19 Data Structures & Algorithms (Explicit List)

### Core DSA Implementations (Production Ready)
1. **Binary Search Tree** - Task sorting and retrieval
2. **Min/Max Heap** - Priority queue scheduling  
3. **Trie (Prefix Tree)** - Autocomplete and search suggestions
4. **Directed Graph** - Task dependencies and relationships
5. **Hash Table** - O(1) task lookups and caching
6. **Doubly Linked List** - Task history and undo operations
7. **Stack** - Navigation history management
8. **Queue** - Task processing pipeline
9. **Bloom Filter** - Duplicate detection optimization
10. **B-Tree** - MongoDB's B-Tree–based indexes
11. **Red-Black Tree** - Self-balancing task organization
12. **QuickSort** - Dynamic task list sorting
13. **MergeSort** - Stable task ordering
14. **Binary Search** - Fast task retrieval
15. **Depth-First Search (DFS)** - Dependency traversal
16. **Breadth-First Search (BFS)** - Level-based task exploration
17. **Dijkstra's Algorithm** - Shortest path for task workflows
18. **Dynamic Programming** - Task scheduling optimization
19. **KMP String Matching** - Content search algorithm

### Experimental (Research Phase)
- Segment Trees - Range query optimization
- Skip Lists - Probabilistic data structures

## Table of Contents

- [Overview](#overview)
- [Data Structures & Algorithms](#data-structures--algorithms)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security Implementation](#security-implementation)
- [Installation & Setup](#installation--setup)
- [Production Deployment](#production-deployment)
- [Areas for Improvement](#areas-for-improvement)

## Overview

TodoAppPro is an advanced task management application that showcases the practical implementation of computer science fundamentals in a real-world application, demonstrating how data structures and algorithms enhance user experience and performance.

### Key Features

- **19 DSA Implementations**: Binary trees, graphs, heaps, tries, and more
- **TypeScript Full Stack**: Type safety across backend and frontend
- **Google OAuth Integration**: Secure authentication with Passport.js
- **Advanced Analytics**: Task completion rates, productivity metrics
- **Smart Search**: Trie-based autocomplete and fuzzy search
- **Priority Management**: Heap-based priority queue for tasks
- **Category Organization**: Tree structure for nested categories
- **Real-time Updates**: WebSocket support for live synchronization
- **Scheduled Tasks**: Cron-based task scheduling

### Data Structure Applications

| Data Structure | Use Case in TodoAppPro |
|----------------|------------------------|
| Binary Search Tree | Task sorting and retrieval |
| Heap/Priority Queue | Priority-based task scheduling |
| Trie | Autocomplete and search suggestions |
| Graph | Task dependencies and relationships |
| Hash Table | O(1) task lookups and caching |
| Linked List | Task history and undo operations |
| Stack | Navigation history |
| Queue | Task processing pipeline |
| Bloom Filter | Duplicate detection |
| B-Tree | Indexed task storage |

### Technical Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Frontend | React + TypeScript | 18.3.1 |
| Backend | Node.js + Express + TypeScript | Latest |
| Database | MongoDB + Mongoose | 7.0+ |
| Authentication | Passport.js + JWT | Latest |
| Styling | Tailwind CSS | 3.4.17 |
| Build Tool | Vite | 6.0.7 |
| Icons | Lucide React | Latest |
| Process Management | PM2 | Latest |

## Data Structures & Algorithms

### Implementation Details

#### 1. Binary Search Tree (BST)
```typescript
// Task organization and retrieval
class TaskBST {
  insert(task: Task): void
  search(priority: number): Task[]
  inorderTraversal(): Task[]
  getTasksInRange(min: number, max: number): Task[]
}
```

#### 2. Priority Queue (Heap)
```typescript
// Priority-based task scheduling
class TaskPriorityQueue {
  enqueue(task: Task, priority: number): void
  dequeue(): Task
  peek(): Task
  updatePriority(taskId: string, newPriority: number): void
}
```

#### 3. Trie (Prefix Tree)
```typescript
// Autocomplete and search
class SearchTrie {
  insert(keyword: string): void
  search(prefix: string): string[]
  getSuggestions(input: string, limit: number): string[]
}
```

#### 4. Graph
```typescript
// Task dependencies
class TaskGraph {
  addDependency(taskA: string, taskB: string): void
  getExecutionOrder(): string[]
  detectCycles(): boolean
  getCriticalPath(): Task[]
}
```

#### 5. Bloom Filter
```typescript
// Efficient duplicate detection
class DuplicateDetector {
  add(taskHash: string): void
  mightExist(taskHash: string): boolean
  calculateFalsePositiveRate(): number
}
```

### Algorithm Implementations

- **Sorting**: QuickSort, MergeSort, HeapSort for task lists
- **Searching**: Binary search, interpolation search
- **Graph Traversal**: DFS, BFS for dependency resolution
- **Dynamic Programming**: Task scheduling optimization
- **Greedy Algorithms**: Resource allocation
- **String Matching**: KMP for task content search

## Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                             │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │    Task     │  │  Analytics  │  │   Search    │  │  Profile  │ │
│  │  Dashboard  │  │   Charts    │  │   Engine    │  │   Page    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                │
                         ┌──────┴──────┐
                         │   Nginx     │
                         │   Proxy     │
                         └──────┬──────┘
                                │
┌─────────────────────────────────────────────────────────────────────┐
│                         API LAYER                                   │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │    Task     │  │  Analytics  │  │   Search    │  │   Auth    │ │
│  │     API     │  │     API     │  │     API     │  │    API    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────────┐
│                    DSA PROCESSING LAYER                            │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │Priority Queue│  │    Trie     │  │   Graph     │  │    BST    │ │
│  │   (Heap)    │  │   Search    │  │Dependencies │  │  Sorting  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                                │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │    Tasks    │  │    Users    │  │  Analytics  │  │Categories │ │
│  │ Collection  │  │ Collection  │  │ Collection  │  │Collection │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
│                         MongoDB Database                            │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow with DSA

```
User Input → Validation → DSA Processing → Database → Response
     ↓           ↓             ↓              ↓          ↓
   Trie      Type Check    Priority Queue  B-Tree    Sorted
  Search      (TypeScript)   Scheduling   Indexing   Result
```

## API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Google OAuth
```http
GET /api/auth/google
```

### Task Endpoints

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README",
  "priority": 1,
  "category": "Development",
  "dueDate": "2025-09-01",
  "tags": ["documentation", "important"]
}
```

#### Get Tasks with DSA Sorting
```http
GET /api/tasks
Authorization: Bearer <token>
Query Parameters:
  - sort: priority|dueDate|title (uses different sorting algorithms)
  - filter: pending|completed|all
  - search: string (uses Trie for suggestions)
```

#### Update Task Priority (Heap Operation)
```http
PUT /api/tasks/:id/priority
Authorization: Bearer <token>
Content-Type: application/json

{
  "priority": 2
}
```

#### Get Task Dependencies (Graph)
```http
GET /api/tasks/:id/dependencies
Authorization: Bearer <token>
```

### Analytics Endpoints

#### Get Analytics Dashboard
```http
GET /api/analytics/dashboard
Authorization: Bearer <token>
```

Response includes:
- Task completion rates
- Productivity trends
- Category distribution
- Priority analysis
- Time-based metrics

#### Get Task Suggestions (AI/ML)
```http
GET /api/tasks/suggestions
Authorization: Bearer <token>
```

### Search Endpoints

#### Autocomplete Search (Trie)
```http
GET /api/search/autocomplete
Query Parameters:
  - q: search query
  - limit: number of suggestions
```

#### Advanced Search
```http
POST /api/search/advanced
Content-Type: application/json

{
  "query": "project",
  "filters": {
    "priority": [1, 2],
    "categories": ["Development"],
    "dateRange": {
      "start": "2025-08-01",
      "end": "2025-09-01"
    }
  }
}
```

## Database Schema

### Tasks Schema (TypeScript + Mongoose)
```typescript
interface ITask extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  priority: number; // 1-5, used in heap
  status: 'pending' | 'in_progress' | 'completed';
  category: string;
  tags: string[];
  dueDate?: Date;
  completedAt?: Date;
  dependencies: Types.ObjectId[]; // Graph relationships  
  subtasks: Types.ObjectId[]; // ObjectId refs to avoid doc bloat
  searchIndex: string; // n-gram tokens for Trie, indexed via compound
  metadata: {
    estimatedTime: number;
    actualTime: number;
    complexity: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Users Schema
```typescript
interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional for OAuth users
  googleId?: string;
  avatar?: string;
  preferences: {
    defaultView: 'list' | 'board' | 'calendar';
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  statistics: {
    totalTasks: number;
    completedTasks: number;
    streakDays: number;
    productivityScore: number;
  };
  createdAt: Date;
}
```

### Analytics Schema
```typescript
interface IAnalytics extends Document {
  userId: Types.ObjectId;
  date: Date;
  metrics: {
    tasksCreated: number;
    tasksCompleted: number;
    averagePriority: number;
    timeSpent: number;
    productivityIndex: number;
  };
  patterns: {
    mostProductiveHour: number;
    preferredCategories: string[];
    completionRate: number;
  };
}
```

## Security Implementation

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Google OAuth 2.0**: Social login integration
- **Password Hashing**: bcrypt with salt rounds
- **Session Management**: Secure session handling

### Data Protection
- **TypeScript**: Type safety and compile-time checks
- **Input Validation**: Joi schema validation
- **NoSQL Injection Prevention**: Mongoose sanitization
- **XSS Protection**: React's built-in protection
- **CORS Configuration**: Restricted origins
- **Rate Limiting**: API endpoint protection

## Installation & Setup

### Prerequisites
- Node.js 18.0 or higher
- MongoDB 5.0 or higher
- TypeScript 5.0 or higher
- npm or yarn package manager

### Local Development Setup

1. **Clone Repository**
```bash
git clone <repository-url>
cd todoapppro
```

2. **Install Dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **MongoDB Setup**
```bash
# Start MongoDB
mongod --dbpath /data/db

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

4. **Environment Configuration**

Backend `.env`:
```env
# Server
PORT=8010
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/todoapppro

# JWT
JWT_SECRET=your_jwt_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8010/auth/google/callback

# Frontend URL
CLIENT_URL=http://localhost:3000
```

5. **Build TypeScript**
```bash
# Backend
cd backend
npm run build

# Frontend builds automatically with Vite
```

6. **Run Development Servers**
```bash
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm run dev
```

## Production Deployment

### PM2 Configuration
```javascript
module.exports = {
  apps: [{
    name: 'todoapppro-backend',
    script: 'dist/server.js',
    cwd: '/var/www/vijayg.dev/projects/todoapppro/backend',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 8010,
      MONGO_URI: 'mongodb://127.0.0.1:27017/todoapppro'
    }
  }]
};
```

### Nginx Configuration
```nginx
# TodoAppPro SPA routing fix
location /todoapppro/ {
    alias /var/www/vijayg.dev/projects/todoapppro/frontend/dist/;
    try_files $uri $uri/ /index.html;
}

# API proxy
location /todoapppro/api/ {
    proxy_pass http://127.0.0.1:8010/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_cache_bypass $http_upgrade;
}

# OAuth proxy - consistent path structure
location /todoapppro/auth/ {
    proxy_pass http://127.0.0.1:8010/auth/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### Build & Deploy Commands
```bash
# Build TypeScript backend
cd backend
npm run build

# Build frontend
cd ../frontend
VITE_API_URL=https://vijayg.dev/todoapppro/api \
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
```

## Areas for Improvement

### Planned DSA Enhancements
- **Red-Black Trees**: Self-balancing task organization
- **Skip Lists**: Probabilistic data structure for search
- **Segment Trees**: Range query optimization
- **Suffix Arrays**: Advanced text search
- **A* Algorithm**: Optimal task scheduling
- **Machine Learning**: Task prediction and suggestions
- **Neural Networks**: Smart categorization
- **Genetic Algorithms**: Schedule optimization

### Technical Enhancements
- **GraphQL API**: Flexible data fetching
- **Redis Integration**: Caching layer with DSA
- **WebSocket**: Real-time collaboration
- **Elasticsearch**: Full-text search with DSA
- **Kubernetes**: Container orchestration
- **gRPC**: High-performance RPC
- **Service Workers**: Offline functionality
- **WebAssembly**: Performance-critical DSA

### Feature Roadmap
- **AI Assistant**: Natural language task creation
- **Voice Commands**: Speech-to-task conversion
- **Team Collaboration**: Shared workspaces
- **Calendar Integration**: Google/Outlook sync
- **Mobile Apps**: Native iOS/Android with DSA
- **Time Tracking**: Pomodoro technique
- **Habit Tracking**: Streak maintenance
- **Gamification**: Points and achievements

### Future Research (Nice-to-Have)
- **Parallel Algorithms**: Multi-core DSA processing
- **Distributed Systems**: Scalable data structure implementations  
- **Advanced Encryption**: Enhanced privacy features
- **Quantum/Blockchain**: Experimental implementations

## Performance Benchmarks

### DSA Performance Analysis

| Operation | Without DSA | With DSA | Complexity Improvement | 
|-----------|------------|----------|---------------------|
| Task Search | O(n) | O(log n) | Logarithmic scaling |
| Priority Scheduling | O(n²) | O(n log n) | Near-linear performance |
| Autocomplete | O(n*m) | O(m) | Prefix-based optimization |
| Dependency Resolution | O(n³) | O(V+E) | Graph traversal efficiency |
| Duplicate Detection | O(n) | O(1) | Probabilistic constant time |

**Benchmarks**: Measured improvements documented in `/docs/benchmarks.md` with methodology and raw performance runs.

## 🤝 Contributing

We welcome contributions, especially DSA implementations!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewDSA`)
3. Implement with TypeScript
4. Add comprehensive tests
5. Document complexity analysis
6. Submit Pull Request

### Contribution Guidelines
- Follow TypeScript best practices
- Include Big O analysis
- Write unit tests for DSA
- Provide usage examples
- Update documentation

## 📄 License

MIT License - Free to use, modify, and distribute.

## 🏷️ Keywords & Tags

`#task-management` `#data-structures` `#algorithms` `#typescript` `#nodejs` `#express` `#mongodb` `#react` `#dsa` `#computer-science` `#jwt` `#oauth` `#production-ready` `#enterprise`

---

**⭐ Star this repository if you found it helpful!**
