import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2 as Hospital,
  UserRound as Doctor,
  LogOut,
  UserCircle
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Doctor, label: 'Doctors', path: '/doctors' },
    { icon: Hospital, label: 'Hospitals', path: '/hospitals' },
    { icon: Users, label: 'Users', path: '/users' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className="flex items-center">
          <Doctor className="w-8 h-8 text-blue-600" />
          <span className="ml-2 text-xl font-semibold">MediDash</span>
        </div>
      </div>

      <div className="flex flex-col h-[calc(100%-4rem)] justify-between">
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <UserCircle className="w-8 h-8 text-gray-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">admin@medidash.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}