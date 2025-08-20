import React from 'react';
import { BookOpen, Code, Database, Cpu, Globe, ArrowLeft } from 'lucide-react';

interface GuidesProps {
  onBack: () => void;
}

const Guides: React.FC<GuidesProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to TodoAppPro
          </button>
          <h1 className="text-3xl font-bold text-gray-900">TodoAppPro Learning Guides</h1>
        </div>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold mb-4">🚀 Welcome to TodoAppPro Learning Hub!</h2>
          <p className="text-lg opacity-90 mb-6">
            Master advanced task management powered by 19 Data Structures & Algorithms. 
            Learn how enterprise-grade software is built from the ground up!
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="text-2xl font-bold">19</div>
              <div className="text-sm opacity-80">Data Structures</div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="text-2xl font-bold">2000+</div>
              <div className="text-sm opacity-80">Lines of Code</div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm opacity-80">TypeScript</div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="text-2xl font-bold">Pro</div>
              <div className="text-sm opacity-80">Level Code</div>
            </div>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <a 
            href="/todoapppro/guides/basics.html" 
            target="_blank"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-l-4 border-green-500"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Programming Basics</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Learn programming fundamentals, variables, functions, and web development basics explained simply.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Beginner</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Interactive</span>
            </div>
          </a>

          <a 
            href="/todoapppro/guides/data-structures.html" 
            target="_blank"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-l-4 border-blue-500"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">19 Data Structures</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Master all 19 DSAs with real-world analogies, interactive demos, and TodoAppPro implementations.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Advanced</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">Hands-on</span>
            </div>
          </a>

          <a 
            href="/todoapppro/guides/system-design.html" 
            target="_blank"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-l-4 border-purple-500"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Cpu className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">System Design</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Understand TodoAppPro's architecture, component design, and enterprise-level system patterns.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">Expert</span>
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">Architecture</span>
            </div>
          </a>

          <a 
            href="/todoapppro/guides/step-by-step-guide.html" 
            target="_blank"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-l-4 border-orange-500"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Code className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Step-by-Step Guide</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Complete tutorial from first line of code to production deployment in 6 detailed phases.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">Tutorial</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Complete</span>
            </div>
          </a>

          <a 
            href="/todoapppro/guides/resources.html" 
            target="_blank"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-l-4 border-red-500"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-lg">
                <Globe className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Free Resources</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Access free tools, complete code snippets, learning materials, and external resources.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Free</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Tools</span>
            </div>
          </a>

          <a 
            href="/todoapppro/guides" 
            target="_blank"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-l-4 border-indigo-500"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Full Guide Hub</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Access the complete interactive learning hub with all guides, navigation, and progress tracking.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">Complete</span>
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">Hub</span>
            </div>
          </a>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 What You'll Learn</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🧠 Data Structures & Algorithms:</h4>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Arrays, Strings, Linked Lists, Stacks, Queues</li>
                <li>• Hash Tables, Binary Trees, BST, Heaps</li>
                <li>• Tries, Graphs, Union-Find, Dynamic Programming</li>
                <li>• Sorting, Searching, Bit Manipulation, Sliding Window</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🚀 Technologies & Skills:</h4>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• TypeScript, Node.js, Express, MongoDB</li>
                <li>• React, Vite, TailwindCSS, JWT Authentication</li>
                <li>• RESTful APIs, Real-time Features, Error Handling</li>
                <li>• Production Deployment, System Architecture</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guides;