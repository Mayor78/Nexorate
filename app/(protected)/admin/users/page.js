'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { getAllUsers } from '../../../lib/admin/users';
import UsersTable from '../../../components/admin/UsersTable';
import UserDetailModal from '../../../components/admin/UserDetailModal';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewUser, setViewUser] = useState(null);

  const fetchUsers = async () => { setLoading(true); setUsers(await getAllUsers()); setLoading(false); };
  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-sky-400/10 rounded-xl flex items-center justify-center">
          <Users size={20} className="text-sky-400" />
        </div>
        <div>
          <h1 className="text-lg font-black text-white">Users</h1>
          <p className="text-xs text-slate-500">{users.length} registered on the platform</p>
        </div>
      </div>
      <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4">
        <UsersTable users={users} loading={loading} onRefresh={fetchUsers} onViewUser={setViewUser} />
      </div>
      <UserDetailModal isOpen={!!viewUser} onClose={() => setViewUser(null)} user={viewUser} />
    </div>
  );
}
