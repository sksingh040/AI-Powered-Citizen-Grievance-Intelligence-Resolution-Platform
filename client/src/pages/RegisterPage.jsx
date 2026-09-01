import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { registerApi } from '../services/api';
import { ShieldCheck, UserPlus } from 'lucide-react';

export const RegisterPage = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [ward, setWard] = useState('Ward-12 (Connaught Place & Central)');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await registerApi({
        name,
        email,
        phone,
        password,
        role,
        ward
      });

      if (res.data.success) {
        await login(email, password);
        if (onRegisterSuccess) onRegisterSuccess();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '2rem auto' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create Civic Account</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Register as a citizen or municipal officer for grievance resolution
          </p>
        </div>

        {errorMsg && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--priority-critical-bg)', color: 'var(--priority-critical)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              required
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Sharma"
            />
          </div>

          <div>
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              required
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ramesh@example.com"
            />
          </div>

          <div>
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="form-label">Password *</label>
            <input
              type="password"
              required
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="grid-2" style={{ gap: '0.75rem' }}>
            <div>
              <label className="form-label">Role</label>
              <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="citizen">Citizen Reporter</option>
                <option value="field_officer">Field Officer</option>
                <option value="supervisor">Supervisor</option>
                <option value="auditor">Auditor</option>
              </select>
            </div>

            <div>
              <label className="form-label">Ward</label>
              <select className="form-control" value={ward} onChange={(e) => setWard(e.target.value)}>
                <option value="Ward-12 (Connaught Place & Central)">Ward-12 (Central)</option>
                <option value="Ward-08 (Karol Bagh & Pusa)">Ward-08 (North Central)</option>
                <option value="Ward-15 (Lajpat Nagar & South)">Ward-15 (South)</option>
                <option value="Ward-21 (Rohini Sector 7)">Ward-21 (North West)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '0.85rem', fontSize: '0.95rem', fontWeight: 700, borderRadius: 'var(--radius-md)' }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontWeight: 700, cursor: 'pointer' }}
          >
            Sign In
          </button>
        </div>

      </div>
    </div>
  );
};
