'use client';

import { useState, useRef, useEffect } from 'react';

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function formatTime(sec) {
  if (!Number.isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const SPEEDS = [1, 1.5, 2];

export default function VoiceNote({ src }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(0);
  const speed = SPEEDS[speedIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => { setIsPlaying(false); setCurrentTime(0); };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
    setCurrentTime(audio.currentTime);
  };

  const cycleSpeed = () => {
    const nextIndex = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(nextIndex);
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[nextIndex];
  };

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-2.5 min-w-55">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        type="button"
        onClick={togglePlay}
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white"
        style={{ background: '#dc2626' }}
        aria-label={isPlaying ? 'Pause' : 'Lecture'}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <div className="flex-1 min-w-0">
        <div
          onClick={handleSeek}
          className="h-1.5 rounded-full cursor-pointer overflow-hidden"
          style={{ background: '#e5e7eb' }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${progressPct}%`, background: '#dc2626' }}
          />
        </div>
        <p className="text-[11px] mt-1" style={{ color: '#6b7280' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </p>
      </div>

      <button
        type="button"
        onClick={cycleSpeed}
        className="shrink-0 px-2 py-1 rounded-full text-[11px] font-bold"
        style={{ background: '#f3f4f6', color: '#dc2626', border: '1px solid #d1d5db' }}
        aria-label="Changer la vitesse de lecture"
        title="Vitesse de lecture"
      >
        {speed}x
      </button>
    </div>
  );
}
