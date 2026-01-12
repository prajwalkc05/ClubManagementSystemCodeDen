import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Sidebar = ({ links, userRole, userName }) => {
  const [profile, setProfile] = useState({ name: userName, designation: '' });
  const location = useLocation();

  useEffect(() => {
    const panel = location.pathname.split('/')[1];
    const storageKey = panel === 'individual' ? 'individualProfile' : panel === 'club-lead' ? 'clubLeadProfile' : 'facultyProfile';
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      setProfile({ 
        name: data.name, 
        designation: data.designation || data.role || data.clubName || ''
      });
    }
  }, [location]);

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">CODE DEN</h2>
      </div>
      
      <div className="sidebar-profile">
        <div className="profile-avatar">{profile.name?.[0] || userName?.[0] || 'U'}</div>
        <div className="profile-info">
          <div className="profile-name">{profile.name || userName || 'User'}</div>
          <div className="profile-role">
            {profile.designation || userRole}
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map(link => (
          <NavLink key={link.path} to={link.path} end={link.path.split('/').length === 2}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">{link.icon}</span>
            <span className="nav-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
