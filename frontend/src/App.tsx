import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import TodoApp from './components/TodoApp';
import Guides from './components/Guides';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [currentPath, setCurrentPath] = React.useState(window.location.pathname);

  React.useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading TodoAppPro...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  // Handle /guide route for authenticated users
  if (currentPath === '/todoapppro/guide') {
    return (
      <Guides 
        onBack={() => {
          window.history.pushState({}, '', '/todoapppro');
          setCurrentPath('/todoapppro');
        }}
      />
    );
  }

  return <TodoApp />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="auto"
        className="!text-sm"
        style={{
          fontSize: '14px'
        }}
      />
    </AuthProvider>
  );
};

export default App;