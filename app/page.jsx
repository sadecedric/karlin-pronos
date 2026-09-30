'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import ChatBubble from '@/components/ChatBubble';
import VoiceNote from '@/components/VoiceNote';
import PlatformsCard from '@/components/PlatformsCard';
import ChatInput from '@/components/ChatInput';
import { WELCOME_MESSAGE } from '@/lib/config';
import { sendMessage } from '@/services/chatApi';

function getSessionId() {
  const key = 'dj_session_id';
  let id = sessionStorage.getItem(key);
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem(key, id); }
  return id;
}

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([
    { role: 'assistant', content: WELCOME_MESSAGE },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const sessionIdRef = useRef(null);

  useEffect(() => {
    sessionIdRef.current = getSessionId();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text) => {
    const currentHistory = history;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text },
    ]);
    setIsLoading(true);

    try {
      const reply = await sendMessage(text, currentHistory.slice(-20), sessionIdRef.current);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: 'assistant', text: reply },
      ]);
      setHistory((prev) => [
        ...prev,
        { role: 'user', content: text },
        { role: 'assistant', content: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'assistant',
          text: "Désolé, je n'ai pas pu répondre. Réessaie dans un instant.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const QUICK_REPLIES = [
    'Comment gagner à Apple of Fortune ?',
    "Comment s'inscrire ?",
  ];

  return (
    <div
      className="chat-shell flex flex-col h-dvh max-w-md mx-auto overflow-hidden"
    >
      <div className="shrink-0 sticky top-0 z-20">
        <Header />
      </div>

      <main className="chat-scroll flex-1 overflow-y-auto min-h-0 px-4 py-5 space-y-3.5">
        <ChatBubble sender="assistant" text={WELCOME_MESSAGE} />

        <ChatBubble sender="assistant">
          <VoiceNote src="/welcome.ogg" />
        </ChatBubble>

        <div className="flex flex-wrap gap-2">
          {QUICK_REPLIES.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => handleSend(question)}
              disabled={isLoading}
              className="text-xs font-bold px-3.5 py-2 rounded-full shadow-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#fffdf7', color: '#057a5b', border: '1px solid rgba(7,17,31,.12)' }}
            >
              {question}
            </button>
          ))}
        </div>

        {messages.map((msg) => (
          <ChatBubble key={msg.id} sender={msg.sender} text={msg.text} />
        ))}

        {isLoading && (
          <ChatBubble sender="assistant">
            <span className="flex gap-1 items-center py-0.5">
              <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:0ms]" style={{ background: '#13a478' }} />
              <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:150ms]" style={{ background: '#13a478' }} />
              <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:300ms]" style={{ background: '#13a478' }} />
            </span>
          </ChatBubble>
        )}

        <div ref={bottomRef} />
      </main>

      <div
        className="glass-panel shrink-0 sticky bottom-0 z-20"
      >
        <PlatformsCard />
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}

