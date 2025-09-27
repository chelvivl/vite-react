// src/layouts/MainLayout.tsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaBook, FaCalendarAlt, FaChartPie } from 'react-icons/fa';
import './MainLayout.css';

export default function MainLayout() {
  const location = useLocation();

  const tabs = [
    { path: '/', icon: <FaBook size={24} />, label: 'Библия' },
    { path: '/plan', icon: <FaCalendarAlt size={24} />, label: 'План' },
    { path: '/tracker', icon: <FaChartPie size={24} />, label: 'Трекеры' },
  ];

  return (
    <>
      <div className="main-content">
        <Outlet />
      </div>
      <nav className="bottom-nav">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={location.pathname === tab.path ? 'active' : ''}
          >
            <div className="tab-icon">{tab.icon}</div>
            <span className="tab-label">{tab.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}