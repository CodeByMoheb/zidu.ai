import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import OverviewPage from './pages/OverviewPage';
import LogsPage from './pages/LogsPage';
import ApiKeysPage from './pages/ApiKeysPage';

interface AdminDashboardProps {
  onClose: () => void;
}

export type AdminPage = 'overview' | 'logs' | 'api-keys';

const ADMIN_PASSWORD = 'zidu_admin_2024';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [currentPage, setCurrentPage] = useState<AdminPage>('overview');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex justify-center items-center p-4 animate-fade-in">
        <div className="w-full max-w-sm">
           <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">Admin Access</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-2xl">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                />
              </div>
              {authError && <p className="text-red-400 text-sm text-center">{authError}</p>}
              <button 
                type="submit"
                className="w-full bg-fuchsia-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-fuchsia-700 transition-colors"
              >
                Login
              </button>
               <button 
                type="button"
                onClick={onClose}
                className="w-full mt-2 text-center text-gray-400 text-sm hover:text-white"
              >
                Back to App
              </button>
            </form>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewPage />;
      case 'logs':
        return <LogsPage />;
      case 'api-keys':
        return <ApiKeysPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onClose={onClose}
    >
      {renderPage()}
    </AdminLayout>
  );
};

export default AdminDashboard;
