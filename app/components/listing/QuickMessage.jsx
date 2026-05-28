'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';

const quickMessages = [
  { id: 1, text: "Is this still available?", icon: "❓" },
  { id: 2, text: "What's the condition like?", icon: "🔍" },
  { id: 3, text: "Can we negotiate the price?", icon: "💰" },
  { id: 4, text: "Where are you located?", icon: "📍" },
  { id: 5, text: "Can I see more pictures?", icon: "📸" },
  { id: 6, text: "Is the price firm?", icon: "🏷️" },
];

export default function QuickMessage({ onSendMessage, isSending }) {
  const [selectedMessage, setSelectedMessage] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    const messageToSend = selectedMessage || customMessage;
    if (!messageToSend.trim()) return;
    
    const success = await onSendMessage(messageToSend);
    if (success) {
      setSent(true);
      setSelectedMessage('');
      setCustomMessage('');
      setTimeout(() => setSent(false), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Message Buttons */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-2">
          Quick Messages
        </label>
        <div className="flex flex-wrap gap-2">
          {quickMessages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelectedMessage(msg.text)}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-150 ${
                selectedMessage === msg.text
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{msg.icon}</span>
              {msg.text}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Message Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-2">
          Or type your own message
        </label>
        <div className="flex gap-2">
          <textarea
            value={customMessage}
            onChange={(e) => {
              setCustomMessage(e.target.value);
              if (e.target.value) setSelectedMessage('');
            }}
            placeholder="Type your message here..."
            rows={2}
            className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
          />
        </div>
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={isSending || (!selectedMessage && !customMessage.trim())}
        className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending...
          </>
        ) : sent ? (
          <>
            <CheckCircle size={16} />
            Message Sent!
          </>
        ) : (
          <>
            <Send size={16} />
            Send Message
          </>
        )}
      </button>
    </div>
  );
}