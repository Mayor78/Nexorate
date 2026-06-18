'use client';

import { useState } from 'react';
import { Search, CheckCircle, XCircle, Trash2, Loader2, Flag } from 'lucide-react';
import { resolveReport, dismissReport, deleteReport } from '../../lib/admin/reports';
import { useToast } from '../../context/ToastContext';
import ConfirmActionModal from './ConfirmActionModal';

export default function ReportsTable({ reports, loading, onRefresh }) {
  const [search, setSearch] = useState('');
  const [actionModal, setActionModal] = useState(null);
  const { success: showSuccess, error: showError } = useToast();

  const filtered = reports.filter(r =>
    (r.listingTitle || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.reason || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = async (action, reportId) => {
    try {
      let r;
      switch (action) { case 'resolve': r = await resolveReport(reportId, 'Resolved'); break; case 'dismiss': r = await dismissReport(reportId); break; case 'delete': r = await deleteReport(reportId); break; default: return; }
      r.success ? showSuccess(`${action} successful`) : showError(r.error || 'Failed');
      if (r.success) onRefresh();
    } catch { showError('Action failed'); }
    setActionModal(null);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-slate-500" /></div>;

  return (
    <div>
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reports..." className="w-full pl-9 pr-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/30 transition" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="py-2.5 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-left">Report</th>
              <th className="py-2.5 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-left hidden md:table-cell">Reason</th>
              <th className="py-2.5 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-left hidden sm:table-cell">Status</th>
              <th className="py-2.5 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {filtered.slice(0, 50).map((report) => (
              <tr key={report.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-400/10 rounded-lg flex items-center justify-center shrink-0"><Flag size={14} className="text-red-400" /></div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-xs truncate max-w-[150px] md:max-w-full">{report.listingTitle || 'Unknown'}</p>
                      <p className="text-[10px] text-slate-500">{report.createdAt?.toDate?.() ? new Date(report.createdAt.toDate()).toLocaleDateString() : '-'}</p>
                      <div className="md:hidden mt-0.5 text-[10px] text-slate-400 truncate max-w-[150px]">{report.reason || '-'}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-xs text-slate-400 max-w-[200px] truncate hidden md:table-cell">{report.reason || '-'}</td>
                <td className="py-3 px-3 hidden sm:table-cell">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${report.status === 'resolved' ? 'bg-emerald-400/10 text-emerald-400' : report.status === 'dismissed' ? 'bg-white/5 text-slate-500' : 'bg-red-400/10 text-red-400'}`}>{report.status || 'pending'}</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-end gap-0.5">
                    {report.status === 'pending' && (
                      <>
                        <button onClick={() => setActionModal({ action: 'resolve', report, label: 'Resolve this report?' })} className="p-1.5 text-slate-500 hover:text-emerald-400 hover:bg-white/5 rounded-lg transition"><CheckCircle size={13} /></button>
                        <button onClick={() => setActionModal({ action: 'dismiss', report, label: 'Dismiss this report?' })} className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-white/5 rounded-lg transition"><XCircle size={13} /></button>
                      </>
                    )}
                    <button onClick={() => setActionModal({ action: 'delete', report, label: 'Delete this report?' })} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={4} className="py-16 text-center text-slate-600 text-sm">No reports found</td></tr>}
          </tbody>
        </table>
      </div>

      <ConfirmActionModal isOpen={!!actionModal} onClose={() => setActionModal(null)} onConfirm={() => actionModal && handleAction(actionModal.action, actionModal.report.id)} title="Confirm Action" message={actionModal?.label || ''} confirmText={actionModal?.action || 'Confirm'} />
    </div>
  );
}
