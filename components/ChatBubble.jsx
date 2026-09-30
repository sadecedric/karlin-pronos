'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const mdComponents = {
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
  ),
};

export default function ChatBubble({ sender, text, children }) {
  const isUser = sender === 'user';

  let content;
  if (isUser) {
    content = <p>{text ?? children}</p>;
  } else if (text) {
    content = (
      <div className="markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
          {text}
        </ReactMarkdown>
      </div>
    );
  } else {
    content = children;
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className="max-w-[84%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
        style={isUser ? {
          background: 'linear-gradient(135deg, #057a5b, #13a478)',
          color: '#ffffff',
          borderBottomRightRadius: '4px',
          boxShadow: '0 8px 20px rgba(5,122,91,.2)',
        } : {
          background: 'rgba(255,253,247,.96)',
          color: '#172033',
          border: '1px solid rgba(7,17,31,.1)',
          borderBottomLeftRadius: '4px',
          boxShadow: '0 7px 20px rgba(7,17,31,.07)',
        }}
      >
        {content}
      </div>
    </div>
  );
}
