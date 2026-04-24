import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SignIn } from '@phosphor-icons/react';

const Login: React.FC = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [showAdmin, setShowAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent, type: 'user' | 'admin') => {
    e.preventDefault();
    setError('');
    setLoading(type);

    const email = type === 'user' ? userEmail : adminEmail;
    const password = type === 'user' ? userPassword : adminPassword;

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        
        if (type === 'admin' && user.role !== 'ADMIN') {
          throw new Error('Access denied. This portal is for Administrators only.');
        }

        login(response.data.token, user);
        if (user.role === 'ADMIN') navigate('/admin/dashboard');
        else if (user.role === 'STORE_OWNER') navigate('/owner/dashboard');
        else navigate('/user/dashboard');
      }
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="app-container" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '2rem',
      background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent), radial-gradient(circle at bottom left, rgba(139, 92, 246, 0.1), transparent)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Store Rating Platform
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Secure access for customers and administrators
        </p>
      </div>

      <div style={{ 
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'stretch',
        gap: '2.5rem', 
        width: '100%', 
        maxWidth: showAdmin ? '950px' : '450px',
      }}>
        <div className="glass" style={{ 
          padding: '3rem', 
          width: '100%', 
          maxWidth: '450px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', padding: '1.2rem', borderRadius: '1.5rem', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
                <SignIn size={36} color="white" />
              </div>
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>User Login</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Sign in to rate and review stores</p>
          </div>

          <form onSubmit={(e) => handleLogin(e, 'user')} style={{ flex: 1 }}>
            <div className="form-group">
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Email Address</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="name@example.com"
                style={{ padding: '0.8rem 1rem' }}
                required
              />
            </div>
            <div className="form-group">
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Password</label>
              <input
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                placeholder="••••••••"
                style={{ padding: '0.8rem 1rem' }}
                required
              />
            </div>
            <button type="submit" className="btn" style={{ width: '100%', marginTop: '1.5rem', height: '3rem', fontSize: '1rem' }} disabled={!!loading}>
              {loading === 'user' ? 'Processing...' : 'Access User Dashboard'}
            </button>
          </form>
          
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Don't have an account? <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign up now</Link>
            </p>
            {!showAdmin && (
              <button 
                onClick={() => setShowAdmin(true)}
                className="btn-secondary"
                style={{ 
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '0.5rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Switch to Admin Access
              </button>
            )}
          </div>
        </div>

        {showAdmin && (
          <div className="glass" style={{ 
            padding: '3rem', 
            width: '100%',
            maxWidth: '450px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            animation: 'slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowAdmin(false)}
              style={{ 
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: 'none',
                color: 'var(--error-color)',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}
              title="Return to User Login"
            >
              &times;
            </button>

            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--secondary-color)', padding: '1.2rem', borderRadius: '1.5rem', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
                  <SignIn size={36} color="white" />
                </div>
              </div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Admin Access</h2>
              <p style={{ color: 'var(--text-secondary)' }}>System administration & management</p>
            </div>

            <form onSubmit={(e) => handleLogin(e, 'admin')}>
              <div className="form-group">
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Admin Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@platform.com"
                  style={{ padding: '0.8rem 1rem' }}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Secret Key (Password)</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ padding: '0.8rem 1rem' }}
                  required
                />
              </div>
              <button type="submit" className="btn" style={{ width: '100%', marginTop: '1.5rem', height: '3rem', fontSize: '1rem', background: 'var(--secondary-color)' }} disabled={!!loading}>
                {loading === 'admin' ? 'Verifying Identity...' : 'Enter Admin Panel'}
              </button>
            </form>
            <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
              Authorized system access only.
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="glass" style={{ 
          padding: '1rem 2rem', 
          borderColor: 'var(--error-color)', 
          color: 'var(--error-color)',
          background: 'rgba(239, 68, 68, 0.1)',
          marginTop: '2rem',
          animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Login;
