'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Zap, Package, MessageCircle, Tag, Loader2 } from 'lucide-react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { markNotificationRead, markAllNotificationsRead } from '../../lib/notifications';
import { trackListingEvent } from '../../lib/analytics';
import { useAuth } from '../../context/AuthContext';

const notifIcons = {
  boost: { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-100' },
  message: { icon: MessageCircle, color: 'text-sky-500', bg: 'bg-sky-100' },
  listing: { icon: Package, color: 'text-green-500', bg: 'bg-green-100' },
  default: { icon: Tag, color: 'text-slate-500', bg: 'bg-slate-100' },
};

export default function NotificationCenter() {
  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(30)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setNotifications(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotifClick = async (notif) => {
    if (!notif.read) {
      await markNotificationRead(notif.id);
    }
    if (notif.metadata?.listingId) {
      trackListingEvent(notif.metadata.listingId, 'click', { title: notif.metadata.listingTitle }).catch(() => {});
    }
    if (notif.actionUrl) {
      router.push(notif.actionUrl);
    }
    setIsOpen(false);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(user.uid);
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const date = ts.toDate?.() || new Date(ts);
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m`;
    if (hrs < 24) return `${hrs}h`;
    return date.toLocaleDateString();
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 hover:bg-slate-100 rounded-lg transition ${unreadCount > 0 ? 'animate-bell-shake' : ''}`}
      >
        <Bell size={20} className="text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 animate-fadeIn max-h-[70vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-700"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-slate-400" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <Bell size={32} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-sm font-medium text-slate-500">No notifications yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Boost notifications and updates will appear here
                  </p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const meta = notifIcons[notif.type] || notifIcons.default;
                  const Icon = meta.icon;
                  return (
                    <button
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      className={`w-full text-left p-4 flex gap-3 hover:bg-slate-50 transition border-b border-slate-50 ${
                        !notif.read ? 'bg-sky-50/30' : ''
                      }`}
                    >
                      <div className={`w-9 h-9 ${meta.bg} rounded-xl flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon size={18} className={meta.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm truncate ${!notif.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span className="w-2 h-2 bg-sky-500 rounded-full shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{formatTime(notif.createdAt)}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
