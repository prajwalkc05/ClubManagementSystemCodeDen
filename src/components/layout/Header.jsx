import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    const titles = {
      'club-lead': 'Dashboard',
      'faculty': 'Dashboard',
      'individual': 'Dashboard',
      'clubs': 'Club Management',
      'schedules': 'Schedule Management',
      'checklists': 'Document Checklists',
      'communication': 'Communication',
      'audit': 'Audit Trail',
      'naac': 'NAAC/IQAC Documents',
      'templates': 'Templates',
      'uploads': 'Document Uploads',
      'messages': 'Messages',
      'documents': 'Documents'
    };
    return titles[path] || 'Dashboard';
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>
      <div className="header-right">
        <span className="academic-year">Academic Year: 2024-25</span>
        <button className="icon-btn">🔔</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;
