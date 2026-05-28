'use client';

import { useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';

export default function MessagesArea({ messages, currentUserId, otherUserName }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMs / 3600000 < 24) return `${Math.floor(diffMs / 3600000)}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50">
      <div className="px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl bg-white max-w-xs mx-auto mt-8">
            <MessageCircle size={32} className="mx-auto text-slate-300 mb-2 stroke-[1.5]" />
            <p className="text-xs font-bold text-slate-700">No logs on record</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Send a message statement to initialize exchange.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = String(msg.senderId || '').trim() === String(currentUserId || '').trim();

            return (
              <div key={idx} className={`flex w-full ${isOwn ? 'justify-end items-end' : 'justify-start items-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl border text-sm leading-relaxed transition-all duration-200 ${
                    isOwn
                      ? 'ml-auto bg-sky-500 border-sky-600 text-slate-950 rounded-br-none shadow-sm shadow-sky-500/10'
                      : 'mr-auto bg-white border-slate-200/70 text-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {!isOwn && (
                    <p className="text-[10px] font-black uppercase tracking-wider text-sky-600 mb-1 select-none">
                      {msg.senderName || otherUserName}
                    </p>
                  )}
                  <p className="break-words font-medium text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] font-semibold mt-1.5 text-right select-none ${isOwn ? 'text-slate-900/60' : 'text-slate-400'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}