import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  ShieldAlert,
  FilePlus,
  Search,
  LayoutDashboard,
  Layers,
  BarChart3,
  FileText,
  Sun,
  Moon,
  Globe,
  User,
  LogOut,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout, login } = useAuth();
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const demoRoles = [
    { label: 'Citizen Reporter', email: 'citizen@example.com', role: 'citizen', badge: 'Public' },
    { label: 'Field Officer (Roads)', email: 'officer@roads.gov.in', role: 'field_officer', badge: 'Field' },
    { label: 'Department Supervisor', email: 'supervisor@civic.gov.in', role: 'supervisor', badge: 'Triage' },
    { label: 'Municipal Commissioner', email: 'admin@delhi.gov.in', role: 'admin', badge: 'Admin' },
    { label: 'Independent Auditor', email: 'auditor@audit.gov.in', role: 'auditor', badge: 'Audit' }
  ];

  const handleQuickSwitch = async (email) => {
    try {
      await login(email, 'password123');
      setShowRoleMenu(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="navbar-header">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand & Logo */}
        <div
          onClick={() => setActiveTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #ff7700, #1e3a8a, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            <ShieldAlert size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>CIVIC AI</span>
              <span className="badge badge-normal" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>SIH 2026</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Grievance Intelligence & Resolution
            </div>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('home')}
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Sparkles size={16} />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('file')}
            className={`nav-link ${activeTab === 'file' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <FilePlus size={16} />
            <span>{t('fileGrievance')}</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`nav-link ${activeTab === 'track' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Search size={16} />
            <span>{t('trackTicket')}</span>
          </button>

          {/* Staff Accessible Links */}
          <button
            onClick={() => setActiveTab('officer')}
            className={`nav-link ${activeTab === 'officer' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <LayoutDashboard size={16} />
            <span>{t('officerDashboard')}</span>
          </button>

          <button
            onClick={() => setActiveTab('clusters')}
            className={`nav-link ${activeTab === 'clusters' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Layers size={16} />
            <span>{t('incidentClusters')}</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <BarChart3 size={16} />
            <span>{t('analytics')}</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`nav-link ${activeTab === 'audit' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <FileText size={16} />
            <span>{t('auditLogs')}</span>
          </button>
        </nav>

        {/* Right Action Tools: Language, Theme, Quick Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          
          {/* Language Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
              title="Change Language"
            >
              <Globe size={15} />
              <span>{supportedLanguages.find((l) => l.code === language)?.label || 'EN'}</span>
            </button>

            {showLangMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xl)',
                  width: '160px',
                  zIndex: 2000,
                  overflow: 'hidden'
                }}
              >
                {supportedLanguages.map((l) => (\n                  <button\n                    key={l.code}\n                    onClick={() => {\n                      setLanguage(l.code);\n                      setShowLangMenu(false);\n                    }}\n                    style={{\n                      width: '100%',\n                      padding: '0.6rem 1rem',\n                      display: 'flex',\n                      alignItems: 'center',\n                      justifyContent: 'space-between',\n                      background: language === l.code ? 'var(--primary-50)' : 'transparent',\n                      border: 'none',\n                      color: language === l.code ? 'var(--primary-700)' : 'var(--text-primary)',\n                      cursor: 'pointer',\n                      fontSize: '0.85rem',\n                      fontWeight: language === l.code ? 700 : 500,\n                      textAlign: 'left'\n                    }}\n                  >\n                    <span>{l.label}</span>\n                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.name}</span>\n                  </button>\n                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{ padding: '0.45rem', borderRadius: 'var(--radius-full)' }}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* 1-Click Role Switcher for Hackathon Judges */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="btn btn-primary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
            >
              <User size={15} />
              <span>{user ? user.name.split(' ')[0] : 'Demo Roles'}</span>
              <ChevronDown size={14} />
            </button>

            {showRoleMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  width: '260px',
                  zIndex: 2000,
                  padding: '0.5rem',
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Switch Role Persona (SIH Demo)
                </div>
                {demoRoles.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickSwitch(r.email)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: user?.email === r.email ? 'var(--primary-50)' : 'transparent',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      marginBottom: '0.2rem'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{r.label}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{r.email}</div>
                    </div>
                    <span className="badge badge-normal" style={{ fontSize: '0.65rem' }}>{r.badge}</span>
                  </button>
                ))}
                {user && (
                  <button
                    onClick={() => {
                      logout();
                      setShowRoleMenu(false);
                    }}
                    style={{
                      width: '100%',
                      marginTop: '0.4rem',
                      padding: '0.5rem',
                      borderTop: '1px solid var(--border-subtle)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--rose-500)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
