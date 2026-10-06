import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, RotateCcw, Upload, FileAudio, CheckCircle, AlertCircle, Type } from 'lucide-react';

export default function AudioRecorder({
  onAudioReady,
  textResponse,
  setTextResponse,
  speakingDuration,
  setSpeakingDuration,
  mode,
  setMode
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [micError, setMicError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const fileInputRef = useRef(null);

  // Clean up timer and audio context on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerIntervalRef.current);
      cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Draw Audio Waveform Visualization
  const drawWaveform = (analyser) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2.5;
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#4f46e5');
      gradient.addColorStop(0.5, '#06b6d4');
      gradient.addColorStop(1, '#7c3aed');
      ctx.strokeStyle = gradient;

      ctx.beginPath();
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    render();
  };

  const startRecording = async () => {
    setMicError(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 1024;
      source.connect(analyserRef.current);

      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onAudioReady(audioBlob, 'recorded_speech.wav');
        stream.getTracks().forEach((track) => track.stop());
        cancelAnimationFrame(animationFrameRef.current);
      };

      mediaRecorderRef.current.start(200);
      setIsRecording(true);
      setRecordingTime(0);

      // Start waveform drawing
      drawWaveform(analyserRef.current);

      // Timer counter
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const nextTime = prev + 1;
          setSpeakingDuration(nextTime);
          if (nextTime >= 60) {
            stopRecording();
            return 60;
          }
          return nextTime;
        });
      }, 1000);
    } catch (err) {
      console.warn('Microphone access denied or unsupported:', err);
      setMicError('Microphone access was denied or is not supported in this browser. You can upload an audio file or use the Text Response fallback below.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  const resetRecording = () => {
    setAudioUrl(null);
    setRecordingTime(0);
    setUploadedFileName(null);
    onAudioReady(null, null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setSpeakingDuration(45.0); // Calibrated default duration
      onAudioReady(file, file.name);
    }
  };

  // Filler word count preview for text
  const detectedFillers = (textResponse || '')
    .toLowerCase()
    .match(/\b(um|uh|er|ah|like|actually|basically|literally|honestly|you know|i mean|i think|sort of|kind of)\b/g) || [];

  return (
    <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
      {/* Mode Switcher Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Speaking Task <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>(Audio or Text)</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Prompt: <strong style={{ color: 'var(--primary)' }}>“Introduce yourself and describe one thing you are proud of.”</strong> (30–60s)
          </p>
        </div>

        <div style={{ display: 'flex', background: 'var(--bg-muted)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
          <button
            type="button"
            onClick={() => setMode('audio')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: mode === 'audio' ? '#ffffff' : 'transparent',
              color: mode === 'audio' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: mode === 'audio' ? 700 : 500,
              fontSize: '0.825rem',
              cursor: 'pointer',
              boxShadow: mode === 'audio' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <Mic size={14} />
            <span>Record / Upload Audio</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('text')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: mode === 'text' ? '#ffffff' : 'transparent',
              color: mode === 'text' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: mode === 'text' ? 700 : 500,
              fontSize: '0.825rem',
              cursor: 'pointer',
              boxShadow: mode === 'text' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <Type size={14} />
            <span>Text Response Fallback</span>
          </button>
        </div>
      </div>

      {/* AUDIO MODE */}
      {mode === 'audio' && (
        <div>
          {micError && (
            <div style={{
              background: 'var(--warning-light)',
              border: '1px solid #fde68a',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              color: '#92400e',
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{micError}</div>
            </div>
          )}

          {/* Waveform Canvas */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <canvas ref={canvasRef} width={600} height={90} className="waveform-canvas" />
            {!isRecording && !audioUrl && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}>
                Waveform visualizer will activate when you start recording
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {!isRecording && !audioUrl && (
                <button
                  type="button"
                  id="start-recording-btn"
                  className="btn btn-primary"
                  onClick={startRecording}
                >
                  <Mic size={18} />
                  <span>Start Microphone Recording</span>
                </button>
              )}

              {isRecording && (
                <button
                  type="button"
                  id="stop-recording-btn"
                  className="btn btn-primary"
                  style={{ background: '#ef4444' }}
                  onClick={stopRecording}
                >
                  <Square size={18} />
                  <span>Stop Recording ({60 - recordingTime}s left)</span>
                </button>
              )}

              {isRecording && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} className="rec-pulse" />
                  <span>{recordingTime}s / 60s</span>
                </div>
              )}

              {audioUrl && !isRecording && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <audio controls src={audioUrl} style={{ height: '40px' }} />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={resetRecording}
                    title="Record Again"
                  >
                    <RotateCcw size={14} />
                    <span>Re-record</span>
                  </button>
                </div>
              )}
            </div>

            {/* File Upload Option */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <Upload size={14} />
                <span>Upload Audio File</span>
              </button>
              {uploadedFileName && (
                <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle size={12} />
                  <span>{uploadedFileName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TEXT RESPONSE (OR COMPANION TRANSCRIPT) */}
      <div style={{ marginTop: mode === 'audio' ? '1.25rem' : '0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>
            {mode === 'audio' ? 'Accompanying Transcript / Written Notes (Optional):' : 'Written Self-Introduction & Accomplishment:'}
          </label>
          <div style={{ display: 'flex', gap: '0.65rem', fontSize: '0.775rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              Words: <strong>{(textResponse || '').trim().split(/\s+/).filter(Boolean).length}</strong>
            </span>
            <span style={{ color: detectedFillers.length > 3 ? '#ef4444' : '#10b981' }}>
              Fillers: <strong>{detectedFillers.length}</strong>
            </span>
          </div>
        </div>

        <textarea
          id="assessment-text-input"
          className="form-textarea"
          rows={3}
          placeholder="e.g. Hello, I am a computer science student passionate about AI. One accomplishment I am proud of is leading our team in the university hackathon..."
          value={textResponse}
          onChange={(e) => setTextResponse(e.target.value)}
        />
      </div>
    </div>
  );
}
