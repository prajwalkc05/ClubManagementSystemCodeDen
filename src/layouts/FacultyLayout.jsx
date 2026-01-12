import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const FacultyLayout = () => {
  const [userName, setUserName] = useState('Dr. Smith');

  useEffect(() => {
    const profile = localStorage.getItem('facultyProfile');
    if (profile) {
      setUserName(JSON.parse(profile).name);
    }
  }, []);

  const links = [
    { path: '/faculty', label: 'Dashboard', icon: '📊' },
    { path: '/faculty/clubs', label: 'Clubs', icon: '🏛️' },
    { path: '/faculty/schedules', label: 'Schedules', icon: '📅' },
    { path: '/faculty/documents', label: 'Documents', icon: '📄' },
    { path: '/faculty/completion', label: 'Event Completion', icon: '📊' },
    { path: '/faculty/communication', label: 'Communication', icon: '💬' },
    { path: '/faculty/audit', label: 'Audit Logs', icon: '🧾' },
    { path: '/faculty/profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <div className="admin-layout">
      <Sidebar links={links} userRole="Faculty" userName={userName} />
      <div className="admin-main">
        <Header />
        <main className="admin-content"><Outlet /></main>
      </div>
    </div>
  );
};

export default FacultyLayout;
