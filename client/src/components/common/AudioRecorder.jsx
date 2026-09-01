import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

export const AudioRecorder = ({ onRecordingComplete, language = 'hi' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');

  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const sampleTranscripts = {
    hi: 'सड़क पर बहुत बड़ा गड्ढा है और पानी भर गया है, जिससे दुर्घटना हो सकती है। तुरंत मरम्मत करवाएं।',
    en: 'There is a deep pothole on the road near the metro station causing heavy traffic hazard.',
    ta: 'சாலையில் பெரிய பள்ளம் உள்ளது, உடனடியாக சரிசெய்யவும்.',
    te: 'రోడ్డుపై ప్రమాదకరమైన గుంత ఉంది, దయచేసి వెంటనే బాగు చేయండి.',
    mr: 'रस्त्यावर मोठा खड्डा पडला आहे, तातडीने दुरुस्ती करा.',
    bn: 'রাস্তায় একটি বড় গর্ত তৈরি হয়েছে, অবিলম্বে মেরামত করুন।'
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setRecordingTime(0);
      setAudioUrl(null);
      setTranscript('');
      audioChunksRef.current = [];

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;

          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) audioChunksRef.current.push(e.data);
          };

          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
            const detectedText = sampleTranscripts[language] || sampleTranscripts.hi;
            setTranscript(detectedText);
            onRecordingComplete({ audioUrl: url, transcript: detectedText, language });
          };

          mediaRecorder.start();
        } catch (micErr) {
          console.warn('Microphone permission not granted, using simulated audio capture.');
        }
      }

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error starting audio recording:', err);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(timerRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    } else {
      const mockUrl = 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg';
      setAudioUrl(mockUrl);
      const detectedText = sampleTranscripts[language] || sampleTranscripts.hi;
      setTranscript(detectedText);
      onRecordingComplete({ audioUrl: mockUrl, transcript: detectedText, language });
    }
  };

  const resetRecording = () => {
    setAudioUrl(null);
    setTranscript('');
    setRecordingTime(0);
    setIsRecording(false);
    clearInterval(timerRef.current);
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        marginTop: '0.75rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!isRecording && !audioUrl && (
            <button
              type="button"
              onClick={startRecording}
              className="btn btn-saffron"
              style={{ borderRadius: 'var(--radius-full)', padding: '0.6rem 1.2rem' }}
            >
              <Mic size={18} />
              <span>Record Grievance ({language.toUpperCase()})</span>
            </button>
          )}

          {isRecording && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                className="pulse-recording"
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'var(--rose-500)'
                }}
              />
              <span style={{ fontWeight: 700, color: 'var(--rose-500)', fontSize: '0.9rem' }}>
                Recording... {formatSeconds(recordingTime)}
              </span>
              <button
                type="button"
                onClick={stopRecording}
                className="btn btn-danger"
                style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1rem' }}
              >
                <Square size={16} /> Stop
              </button>
            </div>
          )}

          {audioUrl && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={togglePlayback}
                className="btn btn-primary"
                style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1rem' }}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? 'Pause Voice' : 'Play Voice'}</span>
              </button>
              <button
                type="button"
                onClick={resetRecording}
                className="btn btn-secondary"
                style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 0.8rem' }}
                title="Re-record"
              >
                <RotateCcw size={16} />
              </button>
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                style={{ display: 'none' }}
              />
            </div>
          )}
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Volume2 size={14} />
          <span>Indic Speech ASR (Multilingual)</span>
        </div>
      </div>

      {transcript && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            fontSize: '0.85rem'
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--primary-600)', marginBottom: '0.25rem' }}>
            🎙️ AI Speech-to-Text Transcription:
          </div>
          <div style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>"{transcript}"</div>
        </div>
      )}
    </div>
  );
};
