import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Calendar, Users, FileText, Settings } from 'lucide-react';

export const Sidebar = () => {
  const { t } = useTranslation();

  const navigationItems = [
    { icon: LayoutDashboard, label: t('dashboard'), path: '/' },
    { icon: Calendar, label: t('scheduler'), path: '/scheduler' },
    { icon: Users, label: t('users'), path: '/users' },
    { icon: FileText, label: t('reports'), path: '/reports' },
    { icon: Settings, label: t('settings'), path: '/settings' }
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">Security Hub</h1>
      </div>
      <nav className="mt-6">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 
              ${isActive ? 'bg-gray-50 text-blue-600 border-r-4 border-blue-600' : ''}
            `}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};