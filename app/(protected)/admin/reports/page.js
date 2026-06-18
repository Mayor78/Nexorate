'use client';

import { useState, useEffect } from 'react';
import { Flag } from 'lucide-react';
import { getReports } from '../../../lib/admin/reports';
import ReportsTable from '../../../components/admin/ReportsTable';

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => { setLoading(true); setReports(await getReports()); setLoading(false); };
  useEffect(() => { fetchReports(); }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-400/10 rounded-xl flex items-center justify-center">
          <Flag size={20} className="text-red-400" />
        </div>
        <div>
          <h1 className="text-lg font-black text-white">Reports</h1>
          <p className="text-xs text-slate-500">{reports.length} reports submitted</p>
        </div>
      </div>
      <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4">
        <ReportsTable reports={reports} loading={loading} onRefresh={fetchReports} />
      </div>
    </div>
  );
}
