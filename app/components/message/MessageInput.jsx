'use client';

import { Send, Loader2 } from 'lucide-react';

export default function MessageInput({ newMessage, setNewMessage, handleSendMessage, sending }) {
  return (
    <div className="bg-white border-t border-slate-100 px-4 py-4 flex-shrink-0">
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write message..."
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-150"
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="bg-sky-500 hover:bg-sky-400 text-slate-950 px-5 py-3 rounded-xl transition duration-150 disabled:opacity-40 disabled:hover:bg-sky-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
}