'use client';

import { useState } from 'react';

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const canSend = value.trim() && !disabled;

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Écris ton message..."
        disabled={disabled}
        className="flex-1 rounded-full px-4 py-2.5 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
        style={{
          background: '#fffdf7',
          color: '#172033',
          border: '1px solid rgba(7,17,31,.16)',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#13a478';
          e.target.style.boxShadow = '0 0 0 3px rgba(19,164,120,.15)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(7,17,31,.16)';
          e.target.style.boxShadow = 'none';
        }}
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={!canSend}
        className="shrink-0 w-10 h-10 text-white rounded-full flex items-center justify-center transition-colors shadow"
        style={{ background: canSend ? 'linear-gradient(135deg, #057a5b, #13a478)' : '#9ca3af', cursor: canSend ? 'pointer' : 'not-allowed', boxShadow: canSend ? '0 6px 16px rgba(5,122,91,.25)' : 'none' }}
        aria-label="Envoyer"
      >
        <SendIcon />
      </button>
    </form>
  );
}
