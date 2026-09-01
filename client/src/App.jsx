import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ChatbotWidget } from './components/citizen/ChatbotWidget';

// Pages
import { HomePage } from './pages/HomePage';
import { FileComplaintPage } from './pages/FileComplaintPage';
import { TrackTicketPage } from './pages/TrackTicketPage';
import { OfficerDashboardPage } from './pages/OfficerDashboardPage';
import { IncidentClustersPage } from './pages/IncidentClustersPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';
import { AuditorLogsPage } from './pages/AuditorLogsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [trackTicketId, setTrackTicketId] = useState('');

  const handleTicketCreated = (data) => {
    if (data?.ticketId) {
      setTrackTicketId(data.ticketId);
    }
  };

  const handleSelectTicketToTrack = (ticketId) => {
    setTrackTicketId(ticketId);
    setActiveTab('track');
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content View */}
      <main className="main-content container" style={{ marginTop: '2rem' }}>
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={setActiveTab}
            onSelectTicketToTrack={handleSelectTicketToTrack}
          />
        )}

        {activeTab === 'file' && (
          <FileComplaintPage onComplaintCreated={handleTicketCreated} />
        )}

        {activeTab === 'track' && (
          <TrackTicketPage initialTicketId={trackTicketId} />
        )}

        {activeTab === 'officer' && (
          <OfficerDashboardPage />
        )}

        {activeTab === 'clusters' && (
          <IncidentClustersPage />
        )}

        {activeTab === 'analytics' && (
          <AdminAnalyticsPage />
        )}

        {activeTab === 'audit' && (
          <AuditorLogsPage />
        )}

        {activeTab === 'login' && (
          <LoginPage
            onLoginSuccess={() => setActiveTab('officer')}
            onSwitchToRegister={() => setActiveTab('register')}
          />
        )}

        {activeTab === 'register' && (
          <RegisterPage
            onRegisterSuccess={() => setActiveTab('home')}
            onSwitchToLogin={() => setActiveTab('login')}
          />
        )}
      </main>

      {/* Floating 24/7 AI Civic Chatbot */}
      <ChatbotWidget onTrackTicketFromChat={handleSelectTicketToTrack} />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
