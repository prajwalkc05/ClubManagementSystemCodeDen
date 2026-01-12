import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const IndividualLayout = () => {
  const [userName, setUserName] = useState('Alex Johnson');

  useEffect(() => {
    const profile = localStorage.getItem('individualProfile');
    if (profile) {
      setUserName(JSON.parse(profile).name);
    }
  }, []);

  const links = [
    { path: '/individual', label: 'Dashboard', icon: '📊' },
    { path: '/individual/schedules', label: 'Schedules', icon: '📅' },
    { path: '/individual/uploads', label: 'Uploads', icon: '📄' },
    { path: '/individual/templates', label: 'Templates', icon: '📝' },
    { path: '/individual/messages', label: 'Messages', icon: '💬' },
    { path: '/individual/profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <div className="admin-layout">
      <Sidebar links={links} userRole="Member" userName={userName} />
      <div className="admin-main">
        <Header />
        <main className="admin-content"><Outlet /></main>
      </div>
    </div>
  );
};

export default IndividualLayout;
