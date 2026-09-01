import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, User } from 'lucide-react';
import { sendChatMessageApi } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export const ChatbotWidget = ({ onTrackTicketFromChat }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! I am your 24/7 AI Civic Assistant. How can I assist you today?',
      suggestions: ['Track Ticket GRV-2026-00101', 'Report a Pothole', 'Check Sanitation SLA', 'Emergency Contacts']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text || text.trim() === '') return;

    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await sendChatMessageApi({ message: text, language });
      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: res.data.data.reply,
            suggestions: res.data.data.suggestions || []
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'I am here to help you file grievances, track status, and view municipal SLA standards. Type your question or ticket number anytime!',
          suggestions: ['File a Complaint', 'Track Ticket']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1500 }}>
      {!isOpen && (\n        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-primary"
          style={{
            borderRadius: 'var(--radius-full)',
            padding: '0.85rem 1.4rem',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 700
          }}
        >
          <Bot size={20} />
          <span>AI Civic Assistant</span>
        </button>
      )}

      {isOpen && (
        <div
          className="glass-card"
          style={{
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '520px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-glass)'
          }}
        >
          <div
            style={{
              padding: '1rem 1.25rem',
              background: 'linear-gradient(135deg, var(--primary-700), var(--primary-900))',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={18} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>AI Civic Assistant</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Online • Multilingual Indic NLP</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', opacity: 0.8 }}
            >
              <X size={20} />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '0.75rem 1rem',
                    borderRadius: m.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    background: m.sender === 'user' ? 'var(--primary-600)' : 'var(--bg-surface-elevated)',
                    color: m.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                    fontSize: '0.84rem',
                    lineHeight: 1.4,
                    boxShadow: 'var(--shadow-sm)',
                    border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)'
                  }}
                >
                  {m.text}
                </div>

                {m.suggestions && m.suggestions.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {m.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(sug)}
                        style={{
                          fontSize: '0.72rem',
                          padding: '0.3rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--bg-glass)',
                          border: '1px solid var(--border-glass)',
                          color: 'var(--primary-600)',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <Bot size={14} />
                <span>AI assistant is typing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '0.75rem',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              display: 'flex',
              gap: '0.5rem'
            }}
          >
            <input
              type=\"text\"
              className=\"form-control\"
              placeholder=\"Ask a question or track ticket...\"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
            />
            <button
              type=\"submit\"
              disabled={loading || !inputText.trim()}
              className=\"btn btn-primary\"
              style={{ padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
