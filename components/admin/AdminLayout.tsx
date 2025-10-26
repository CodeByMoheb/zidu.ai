import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { AdminPage } from './AdminDashboard';
import { Header } from './Header';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onClose: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage, onNavigate, onClose }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-800 text-gray-200 animate-fade-in">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={onNavigate} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col md:ml-64">
        <Header onClose={onClose} onToggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;