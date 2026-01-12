import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const Navbar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">CODE DEN</div>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><span style={{color: '#ffcc00'}}>{role}</span></li>
        <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
