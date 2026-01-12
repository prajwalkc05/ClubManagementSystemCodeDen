import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const ClubLeadLayout = () => {
  const [userName, setUserName] = useState('John Doe');

  useEffect(() => {
    const profile = localStorage.getItem('clubLeadProfile');
    if (profile) {
      setUserName(JSON.parse(profile).name);
    }
  }, []);

  const links = [
    { path: '/club-lead', label: 'Dashboard', icon: '📊' },
    { path: '/club-lead/clubs', label: 'Club Management', icon: '🏛️' },
    { path: '/club-lead/schedules', label: 'Schedule Management', icon: '📅' },
    { path: '/club-lead/checklists', label: 'Document Checklists', icon: '📄' },
    { path: '/club-lead/communication', label: 'Communication', icon: '💬' },
    { path: '/club-lead/naac', label: 'NAAC/IQAC Docs', icon: '📋' },
    { path: '/club-lead/templates', label: 'Templates', icon: '📝' },
    { path: '/club-lead/audit', label: 'Audit Trail', icon: '🧾' },
    { path: '/club-lead/profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <div className="admin-layout">
      <Sidebar links={links} userRole="Club Lead" userName={userName} />
      <div className="admin-main">
        <Header />
        <main className="admin-content"><Outlet /></main>
      </div>
    </div>
  );
};

export default ClubLeadLayout;
