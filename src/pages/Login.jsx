import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { authService } from '../../services/authService';
import { getRoleRoute } from '../utils/roleGuard';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // MOCK LOGIN - Remove when backend is ready
    const mockUsers = {
      'faculty@test.com': { role: 'FACULTY', token: 'mock-faculty-token' },
      'lead@test.com': { role: 'CLUB_LEAD', token: 'mock-lead-token' },
      'member@test.com': { role: 'INDIVIDUAL', token: 'mock-member-token' }
    };
    
    if (mockUsers[email] && password === 'password') {
      const data = mockUsers[email];
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      navigate(getRoleRoute(data.role));
      return;
    }
    
    // Real API call (uncomment when backend ready)
    // try {
    //   const data = await authService.login(email, password);
    //   navigate(getRoleRoute(data.role));
    // } catch {
    //   alert('Login failed');
    // }
    
    alert('Invalid credentials. Try:\nfaculty@test.com\nlead@test.com\nmember@test.com\nPassword: password');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>CODE DEN</h1>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} 
            onChange={e => setEmail(e.target.value)} required />
          <div style={{position: 'relative'}}>
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px'}}>
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <button type="submit" className="primary-btn">Login</button>
        </form>
        <p style={{marginTop: '15px', textAlign: 'center'}}>Don't have an account? <Link to="/register" style={{color: '#007bff', textDecoration: 'none'}}>Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
