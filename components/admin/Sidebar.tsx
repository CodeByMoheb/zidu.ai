import React from 'react';
import { AdminPage } from './AdminDashboard';
import { Logo } from '../Logo';
import { DashboardIcon } from './icons/DashboardIcon';
import { UsersIcon } from './icons/UsersIcon';
import { KeyIcon } from './icons/KeyIcon';

interface SidebarProps {
  currentPage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-fuchsia-500/20 text-fuchsia-300 font-semibold'
          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-4">{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, onClose }) => {
  const handleNavigation = (page: AdminPage) => {
    onNavigate(page);
    onClose(); // Close sidebar on navigation in mobile view
  }

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-900 z-30 p-4 flex flex-col transition-transform transform md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-2 mb-8">
          <Logo className="h-9 w-9 text-fuchsia-500" />
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">
            Zidu.ai
          </h1>
        </div>
        <nav>
          <ul className="space-y-2">
            <NavItem
              icon={<DashboardIcon className="h-6 w-6" />}
              label="Overview"
              isActive={currentPage === 'overview'}
              onClick={() => handleNavigation('overview')}
            />
            <NavItem
              icon={<UsersIcon className="h-6 w-6" />}
              label="User Logs"
              isActive={currentPage === 'logs'}
              onClick={() => handleNavigation('logs')}
            />
            <NavItem
              icon={<KeyIcon className="h-6 w-6" />}
              label="API Keys"
              isActive={currentPage === 'api-keys'}
              onClick={() => handleNavigation('api-keys')}
            />
          </ul>
        </nav>
        <div className="mt-auto text-center text-xs text-gray-600">
          Admin Panel v1.0
        </div>
      </aside>
    </>
  );
};

export default Sidebar;