'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { useAuth } from '../../../context/AuthContext';
import { Loader2, AlertCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import LoginPrompt from '../../../components/ui/LoginPrompt';
import ChatHeader from '../../../components/message/ChatHeader';
import MessagesArea from '../../../components/message/MessagesArea';
import MessageInput from '../../../components/message/MessageInput';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      setShowLoginPrompt(true);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!params.id || !user) return;

    setLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, 'conversations', params.id),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (!data.participants?.includes(user.uid)) {
            setError('You are not a participant in this conversation');
            setLoading(false);
            return;
          }
          setConversation(data);
          const sortedMessages = (data.messages || []).sort((a, b) => {
            return new Date(a.timestamp) - new Date(b.timestamp);
          });
          setMessages(sortedMessages);
          setLoading(false);
        } else {
          setError('Conversation not found');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error fetching conversation:', err);
        setError('Failed to load conversation');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [params.id, user]);

  // Add this after your conversation listener
useEffect(() => {
  const markMessagesAsRead = async () => {
    if (!conversation || !user) return;
    
    const messagesList = conversation.messages || [];
    // Find unread messages from the other user
    const unreadMessages = messagesList.filter(msg => 
      msg.senderId !== user.uid && !msg.read
    );
    
    if (unreadMessages.length > 0) {
      // Mark all unread messages as read
      const updatedMessages = messagesList.map(msg => {
        if (msg.senderId !== user.uid && !msg.read) {
          return { ...msg, read: true };
        }
        return msg;
      });
      
      try {
        await updateDoc(doc(db, 'conversations', params.id), {
          messages: updatedMessages
        });
        console.log(`✅ Marked ${unreadMessages.length} messages as read`);
      } catch (err) {
        console.error('Error marking messages as read:', err);
      }
    }
  };
  
  if (conversation) {
    markMessagesAsRead();
  }
}, [conversation, user, params.id]);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const now = new Date();
      const messageObj = {
        senderId: user.uid,
        senderName: user.displayName || 'Anonymous',
        text: newMessage,
        timestamp: now.toISOString(),
        read: false,
      };

      await updateDoc(doc(db, 'conversations', params.id), {
        messages: arrayUnion(messageObj),
        lastMessage: newMessage,
        updatedAt: now.toISOString(),
      });

      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (authLoading) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={36} className="animate-spin text-sky-500 mx-auto mb-3" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Verifying session</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="h-screen bg-slate-50 flex items-center justify-center px-4">
          <div className="text-center max-w-sm w-full p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={22} className="stroke-[1.5] text-slate-400" />
            </div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Conversation Locked</h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Please authenticate to interact with this conversation.
            </p>
            <div className="space-y-2">
              <Link href="/auth" className="block w-full bg-sky-500 hover:bg-sky-400 text-slate-950 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition text-center">
                Log In
              </Link>
              <Link href="/auth" className="block w-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition text-center">
                Create Account
              </Link>
            </div>
          </div>
        </div>
        <LoginPrompt isOpen={showLoginPrompt} onClose={() => { setShowLoginPrompt(false); router.push('/'); }} action="view and send messages" />
      </>
    );
  }

  if (loading) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={36} className="animate-spin text-sky-500 mx-auto mb-3" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading secure chat</p>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center p-8 bg-white border border-slate-200 rounded-2xl max-w-sm w-full shadow-sm">
          <AlertCircle size={36} className="text-red-500 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-base mb-1">Thread Error</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">{error || 'Conversation not found.'}</p>
          <button onClick={() => router.back()} className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition hover:bg-slate-800">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const otherUserName = conversation.buyerId === user.uid ? conversation.sellerName : conversation.buyerName;
  const productImage = conversation.productImage?.url || '';

  return (
    <div className="h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto h-full flex flex-col bg-white border-x border-slate-100">
        <ChatHeader conversation={conversation} productImage={productImage} otherUserName={otherUserName} className="fix" />
        <MessagesArea messages={messages} currentUserId={user.uid} otherUserName={otherUserName} />
        <MessageInput newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} sending={sending} />
      </div>
    </div>
  );
}