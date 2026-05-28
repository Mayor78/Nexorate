'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MessageSquare, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

export default function MessagesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Real-time listener for conversations
  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);
    
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const fetchedConversations = snapshot.docs.map(doc => {
          const data = doc.data();
          const messages = data.messages || [];
          
          // Calculate unread count for this conversation
          const unreadCount = messages.filter(msg => 
            msg.senderId !== user.uid && !msg.read
          ).length;
          
          return {
            id: doc.id,
            ...data,
            unreadCount,
            lastMessage: data.lastMessage || 'No messages yet',
            updatedAt: data.updatedAt,
          };
        });
        
        setConversations(fetchedConversations);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching conversations:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const handleConversationClick = (conversationId) => {
    router.push(`/messages/${conversationId}`);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.buyerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.sellerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate?.() || new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-10">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-5 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={() => router.push('/')}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Messages
                {totalUnread > 0 && (
                  <span className="ml-2 text-sm font-bold text-white bg-red-500 px-2 py-0.5 rounded-full align-middle">
                    {totalUnread}
                  </span>
                )}
              </h1>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Chat with buyers and sellers</p>
            </div>
          </div>
          
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-150"
            />
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
        {error ? (
          <div className="text-red-500 text-center py-8">Error loading messages: {error}</div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl bg-white">
            <MessageSquare size={40} className="mx-auto text-slate-300 mb-4 stroke-[1.5]" />
            <h3 className="font-bold text-slate-800 text-base">No conversations yet</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
              Start a conversation by asking about a product or wait for interested buyers to message you.
            </p>
            <Link href="/" className="text-primary text-sm font-bold mt-4 inline-block hover:underline">
              Browse Products →
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredConversations.map((conv) => {
              const otherUserName = conv.buyerId === user?.uid ? conv.sellerName : conv.buyerName;
              const productImage = typeof conv.productImage === 'object' ? conv.productImage?.url : conv.productImage;
              const hasUnread = conv.unreadCount > 0;
              
              return (
                <button
                  key={conv.id}
                  onClick={() => handleConversationClick(conv.id)}
                  className="w-full text-left block"
                >
                  <div className={`bg-white rounded-xl p-4 flex gap-4 border transition-all duration-150 hover:shadow-md cursor-pointer ${
                    hasUnread 
                      ? 'border-sky-200 shadow-sm shadow-sky-500/5 bg-sky-50/20' 
                      : 'border-slate-100 hover:border-slate-200'
                  }`}>
                    
                    {/* Product Image */}
                    <div className="relative w-16 h-16 bg-slate-100 border border-slate-200/60 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                      {productImage ? (
                        <Image 
                          src={productImage} 
                          alt={conv.productName} 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <MessageSquare size={24} className="text-slate-400" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="truncate">
                          <h3 className={`text-sm sm:text-base tracking-tight truncate flex items-center gap-2 ${
                            hasUnread ? 'font-extrabold text-slate-900' : 'font-bold text-slate-800'
                          }`}>
                            {conv.productName || 'Product'}
                            {hasUnread && (
                              <span className="inline-flex items-center justify-center min-w-[20px] h-5 bg-red-500 text-white text-[11px] font-bold rounded-full px-1.5">
                                {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                              </span>
                            )}
                          </h3>
                          <p className="text-xs font-medium text-slate-400 mt-0.5">
                            with <span className="text-slate-600 font-semibold">{otherUserName || 'Unknown'}</span>
                          </p>
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap pt-0.5">
                          {formatTime(conv.updatedAt)}
                        </span>
                      </div>

                      <p className={`text-xs sm:text-sm mt-2 truncate ${
                        hasUnread ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'
                      }`}>
                        {conv.lastMessage || 'No messages yet'}
                      </p>
                    </div>

                    <ChevronRight size={18} className="text-slate-300 shrink-0 self-center" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}