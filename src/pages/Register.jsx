import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { authService } from '../../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'INDIVIDUAL'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    // Real API call (uncomment when backend ready)
    // try {
    //   await authService.register(formData);
    //   alert('Registration successful! Please login.');
    //   navigate('/login');
    // } catch {
    //   alert('Registration failed');
    // }

    // MOCK REGISTRATION
    alert('Registration successful! Please login.');
    navigate('/login');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>CODE DEN</h1>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" value={formData.name} 
            onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} 
            onChange={handleChange} required />
          <div style={{position: 'relative'}}>
            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" 
              value={formData.password} onChange={handleChange} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px'}}>
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <div style={{position: 'relative'}}>
            <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" 
              placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px'}}>
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="INDIVIDUAL">Individual Member</option>
            <option value="CLUB_LEAD">Club Lead</option>
            <option value="FACULTY">Faculty</option>
          </select>
          <button type="submit" className="primary-btn">Register</button>
        </form>
        <p style={{marginTop: '15px', textAlign: 'center'}}>Already have an account? <Link to="/login" style={{color: '#007bff', textDecoration: 'none'}}>Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
