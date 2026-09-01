import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDemoAccountsApi } from '../services/api';
import { ShieldAlert, LogIn, UserCheck, KeyRound, Sparkles } from 'lucide-react';

export const LoginPage = ({ onLoginSuccess, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('officer@roads.gov.in');
  const [password, setPassword] = useState('password123');
  const [demoAccounts, setDemoAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchDemoAccounts = async () => {
      try {
        const res = await getDemoAccountsApi();
        if (res.data.success) {
          setDemoAccounts(res.data.data.demoAccounts);
        }
      } catch (e) {
        console.warn('Demo accounts error');
      }
    };
    fetchDemoAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg('');
      await login(email, password);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div style={{ maxWidth: '520px', margin: '2rem auto' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #ff7700, #1e3a8a, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}
          >
            <ShieldAlert size={28} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Sign In to Civic Portal</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Access role-based queues, analytics, and grievance resolution tools
          </p>
        </div>

        {errorMsg && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--priority-critical-bg)', color: 'var(--priority-critical)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@roads.gov.in"
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '0.85rem', fontSize: '0.95rem', fontWeight: 700, borderRadius: 'var(--radius-md)' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {demoAccounts.length > 0 && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary-600)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              <Sparkles size={15} />
              <span>1-Click Demo Accounts (SIH Evaluation):</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {demoAccounts.map((acc, idx) => (\n                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickSelect(acc)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: email === acc.email ? 'var(--primary-50)' : 'var(--bg-surface-elevated)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    textAlign: 'left'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{acc.label}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{acc.email}</div>
                  </div>
                  <span className="badge badge-normal" style={{ fontSize: '0.65rem' }}>{acc.role}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
