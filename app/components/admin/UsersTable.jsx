'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Shield, Ban, UserCheck, Trash2, Eye, Loader2, 
  User, Mail, Calendar, Grid3x3, List, ChevronLeft, 
  ChevronRight, MoreVertical, X, Filter, CheckCircle, 
  XCircle, Crown, Clock, AtSign, Phone, MapPin
} from 'lucide-react';
import { banUser, unbanUser, deleteUser, makeAdmin, removeAdmin } from '../../lib/admin/users';
import { useToast } from '../../context/ToastContext';
import ConfirmActionModal from './ConfirmActionModal';

// Format date safely (handles ISO strings, Firestore timestamps, and missing values)
const formatDate = (dateValue) => {
  if (!dateValue) return '-';
  try {
    const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString();
  } catch {
    return '-';
  }
};

export default function UsersTable({ users, loading, onRefresh, onViewUser }) {
  const [search, setSearch] = useState('');
  const [actionModal, setActionModal] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const { success: showSuccess, error: showError } = useToast();

  const itemsPerPageOptions = [12, 24, 48, 96];

  // Filter users
  let filtered = users.filter(u =>
    (u.displayName || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  // Apply role filter
  if (roleFilter !== 'all') {
    filtered = filtered.filter(u => roleFilter === 'admin' ? u.role === 'admin' : u.role !== 'admin');
  }

  // Apply status filter
  if (statusFilter !== 'all') {
    filtered = filtered.filter(u => statusFilter === 'banned' ? u.banned : !u.banned);
  }

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedUsers = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAction = async (action, userId) => {
    try {
      let result;
      switch (action) {
        case 'ban': result = await banUser(userId); break;
        case 'unban': result = await unbanUser(userId); break;
        case 'delete': result = await deleteUser(userId); break;
        case 'makeAdmin': result = await makeAdmin(userId); break;
        case 'removeAdmin': result = await removeAdmin(userId); break;
        default: return;
      }
      if (result.success) {
        showSuccess(`${action} successful`);
        onRefresh();
      } else {
        showError(result.error || 'Action failed');
      }
    } catch {
      showError('Action failed');
    }
    setActionModal(null);
    setOpenMenuId(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <User size={20} className="text-sky-500" />
          </div>
        </div>
        <p className="text-slate-500 text-sm mt-4">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">User Management</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and moderate platform users</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              showFilters 
                ? 'bg-sky-500 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Filter size={16} />
            <span className="text-sm font-medium">Filters</span>
            {(roleFilter !== 'all' || statusFilter !== 'all') && (
              <span className="ml-1 w-5 h-5 bg-white/20 rounded-full text-xs flex items-center justify-center">
                {(roleFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0)}
              </span>
            )}
          </button>

          {/* View Toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white text-sky-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'table' 
                  ? 'bg-white text-sky-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200"
            >
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-sky-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="user">Regular Users</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-sky-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>

              {(roleFilter !== 'all' || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setRoleFilter('all');
                    setStatusFilter('all');
                  }}
                  className="px-3 py-2 text-sm text-sky-600 hover:text-sky-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-3 border border-sky-200">
          <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Total Users</p>
          <p className="text-2xl font-bold text-sky-700 mt-1">{users.length}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-3 border border-emerald-200">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Active</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{users.filter(u => !u.banned).length}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 border border-red-200">
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Banned</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{users.filter(u => u.banned).length}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3 border border-amber-200">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Admins</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{users.filter(u => u.role === 'admin').length}</p>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginatedUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onView={() => onViewUser?.(user)}
                onAction={(action) => setActionModal(action)}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
              />
            ))}
          </div>

          {paginatedUsers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={32} className="text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No users found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                <th className="py-4 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="py-4 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="py-4 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                <th className="py-4 px-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.map((user) => (
                <motion.tr 
                  key={user.id} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                        {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{user.displayName || 'Anonymous'}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {user.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg">
                        <Crown size={12} /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg">
                        <User size={12} /> User
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {user.banned ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-lg">
                        <XCircle size={12} /> Banned
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-lg">
                        <CheckCircle size={12} /> Active
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-400" />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => onViewUser?.(user)} 
                        className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {user.role !== 'admin' ? (
                        <button 
                          onClick={() => setActionModal({ action: 'makeAdmin', user, label: `Make ${user.displayName || 'user'} an admin?` })} 
                          className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="Make Admin"
                        >
                          <Crown size={16} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => setActionModal({ action: 'removeAdmin', user, label: `Remove admin from ${user.displayName || 'user'}?` })} 
                          className="p-2 text-amber-600 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                          title="Remove Admin"
                        >
                          <Crown size={16} />
                        </button>
                      )}
                      {user.banned ? (
                        <button 
                          onClick={() => setActionModal({ action: 'unban', user, label: `Unban ${user.displayName || 'user'}?` })} 
                          className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Unban User"
                        >
                          <UserCheck size={16} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => setActionModal({ action: 'ban', user, label: `Ban ${user.displayName || 'user'}?` })} 
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Ban User"
                        >
                          <Ban size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => setActionModal({ action: 'delete', user, label: `Delete ${user.displayName || 'user'}? This cannot be undone.` })} 
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {paginatedUsers.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-500">No users found</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-sky-500"
            >
              {itemsPerPageOptions.map(opt => (
                <option key={opt} value={opt}>Show {opt}</option>
              ))}
            </select>
            <p className="text-sm text-slate-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} users
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 text-slate-500 hover:text-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-lg hover:bg-sky-50"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all ${
                      currentPage === pageNum
                        ? 'bg-sky-500 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-slate-500 hover:text-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-lg hover:bg-sky-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Confirm Action Modal */}
      <ConfirmActionModal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        onConfirm={() => actionModal && handleAction(actionModal.action, actionModal.user.id)}
        title="Confirm Action"
        message={actionModal?.label || ''}
        confirmText={actionModal?.action === 'delete' ? 'Delete' : actionModal?.action === 'ban' ? 'Ban' : actionModal?.action === 'unban' ? 'Unban' : 'Confirm'}
        danger={actionModal?.action === 'delete' || actionModal?.action === 'ban'}
      />
    </div>
  );
}

// User Card Component for Grid View
function UserCard({ user, onView, onAction, openMenuId, setOpenMenuId }) {
  const isOpen = openMenuId === user.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300"
    >
      {/* Card Header with Gradient */}
      <div className="relative h-24 bg-gradient-to-r from-sky-500 to-sky-600">
        <button
          onClick={() => setOpenMenuId(isOpen ? null : user.id)}
          className="absolute top-3 right-3 p-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all"
        >
          <MoreVertical size={14} />
        </button>
        
        {/* Role Badge in Header */}
        {user.role === 'admin' && (
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/90 backdrop-blur-sm rounded-lg text-white text-[10px] font-bold">
              <Crown size={10} /> ADMIN
            </div>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="relative px-4">
        <div className="absolute -top-10">
          <div className="w-20 h-20 rounded-xl bg-white shadow-md flex items-center justify-center border-2 border-white">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-sky-100 to-sky-50 flex items-center justify-center">
              <span className="text-2xl font-bold text-sky-600">
                {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="pt-12 px-4 pb-4">
        <h3 className="font-bold text-slate-800 text-base truncate">
          {user.displayName || 'Anonymous User'}
        </h3>
        
        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
          <AtSign size={12} />
          <span className="truncate">{user.email}</span>
        </div>

        {/* Status Badge */}
        <div className="mt-3">
          {user.banned ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-lg">
              <XCircle size={12} /> Banned
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-lg">
              <CheckCircle size={12} /> Active
            </span>
          )}
        </div>

        {/* Join Date */}
        <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400">
          <Calendar size={12} />
          <span>Joined {formatDate(user.createdAt)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={() => onView(user)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-lg transition-all"
          >
            <Eye size={14} /> View
          </button>
          <button
            onClick={() => onAction({ action: user.banned ? 'unban' : 'ban', user, label: user.banned ? `Unban ${user.displayName || 'user'}?` : `Ban ${user.displayName || 'user'}?` })}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              user.banned
                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
          >
            {user.banned ? <UserCheck size={14} /> : <Ban size={14} />}
            {user.banned ? 'Unban' : 'Ban'}
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-3 top-12 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 overflow-hidden"
            >
              {user.role !== 'admin' ? (
                <button
                  onClick={() => {
                    onAction({ action: 'makeAdmin', user, label: `Make ${user.displayName || 'user'} an admin?` });
                    setOpenMenuId(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition-all"
                >
                  <Crown size={14} /> Make Admin
                </button>
              ) : (
                <button
                  onClick={() => {
                    onAction({ action: 'removeAdmin', user, label: `Remove admin from ${user.displayName || 'user'}?` });
                    setOpenMenuId(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition-all"
                >
                  <Crown size={14} /> Remove Admin
                </button>
              )}
              <div className="h-px bg-slate-100 my-1" />
              <button
                onClick={() => {
                  onAction({ action: 'delete', user, label: `Delete ${user.displayName || 'user'}? This cannot be undone.` });
                  setOpenMenuId(null);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all"
              >
                <Trash2 size={14} /> Delete User
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}