
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Eye, 
  Trash2, 
  RefreshCw,
  Database,
  PlusCircle,
  FileSearch
} from 'lucide-react';
import { EstimateData } from '../types';

interface EstimateDashboardProps {
  estimates: EstimateData[];
  onLoad: (data: EstimateData) => void;
  onDelete: (id: string) => void;
  isSyncing?: boolean;
  onCreateNew?: () => void;
}

const EstimateDashboard: React.FC<EstimateDashboardProps> = ({ estimates, onLoad, onDelete, isSyncing = false, onCreateNew }) => {
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEstimates = useMemo(() => {
    return estimates.filter(est => {
      const createdAt = new Date(est.createdAt).toISOString().split('T')[0];
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = (est.client.companyName?.toLowerCase().includes(lowerSearch)) || (est.client.projectName?.toLowerCase().includes(lowerSearch)) || (est.estimateNumber?.toLowerCase().includes(lowerSearch));
      const matchesStart = !dateFilter.start || createdAt >= dateFilter.start;
      const matchesEnd = !dateFilter.end || createdAt <= dateFilter.end;
      return matchesSearch && matchesStart && matchesEnd;
    });
  }, [estimates, searchTerm, dateFilter]);

  const exportToCSV = () => {
    if (filteredEstimates.length === 0) return;
    const headers = ['作成日', '管理番号', '企業名', '案件名', '契約形態', '見積合計(税別)', '契約日', '納期'];
    const rows = filteredEstimates.map(est => {
      const subtotal = est.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0) - est.discount;
      return [new Date(est.createdAt).toLocaleDateString('ja-JP'), est.estimateNumber, est.client.companyName, est.client.projectName, est.contractType, subtotal, est.contractDate, est.deliveryDate];
    });
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `fren_master_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const inputClasses = "w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition shadow-sm placeholder:text-slate-400 text-sm";
  const dateInputClasses = "w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition shadow-sm text-sm";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Database className="text-slate-400" size={24} />
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">案件管理台帳</h2>
          {isSyncing && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-100 uppercase tracking-widest">
              <RefreshCw size={10} className="animate-spin" /> クラウド同期中
            </span>
          )}
        </div>
        <div className="flex gap-3">
           <button onClick={exportToCSV} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50 transition shadow-sm font-bold text-xs uppercase tracking-widest">
            <Download size={14} /> CSVエクスポート
          </button>
          <button onClick={onCreateNew} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-xl hover:bg-slate-800 transition shadow-lg font-bold text-xs uppercase tracking-widest">
            <PlusCircle size={14} /> 新規作成
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">案件検索</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="プロジェクト名、クライアント、管理番号..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={inputClasses} />
          </div>
        </div>
        <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">作成日 (から)</label><input type="date" value={dateFilter.start} onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))} className={dateInputClasses} /></div>
        <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">作成日 (まで)</label><input type="date" value={dateFilter.end} onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))} className={dateInputClasses} /></div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4 border-b border-slate-100">管理番号 / 作成日</th>
              <th className="px-6 py-4 border-b border-slate-100">クライアント / 案件名</th>
              <th className="px-6 py-4 border-b border-slate-100 text-right">金額 (税別)</th>
              <th className="px-6 py-4 border-b border-slate-100">最終納期</th>
              <th className="px-6 py-4 text-right border-b border-slate-100">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isSyncing && estimates.length === 0 ? (
               <tr><td colSpan={5} className="px-6 py-24 text-center text-slate-400"><div className="flex flex-col items-center gap-4"><RefreshCw size={32} className="animate-spin text-slate-200" /><p className="font-bold text-xs uppercase tracking-widest">クラウドデータを読み込み中...</p></div></td></tr>
            ) : filteredEstimates.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-32 text-center">
                  <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
                    <div className="bg-slate-50 p-6 rounded-full text-slate-200"><FileSearch size={48} /></div>
                    <h3 className="text-lg font-bold text-slate-900">まだ案件がありません</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">書類を作成してクラウドに保存すると、ここに履歴が表示されます。まずは「新規作成」ボタンから書類を作成しましょう！</p>
                    <button onClick={onCreateNew} className="mt-4 flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg font-bold text-sm">
                      最初の書類を作成する
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredEstimates.map((est) => {
                const subtotal = est.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0) - est.discount;
                return (
                  <tr key={est.id} className="hover:bg-slate-50 transition group">
                    <td className="px-6 py-5">
                      <p className="font-mono text-xs font-bold text-indigo-600 tracking-tighter">{est.estimateNumber}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                        {new Date(est.createdAt).toLocaleDateString('ja-JP')}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900 text-sm">{est.client.companyName || '（未入力）'}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">{est.client.projectName}</p>
                    </td>
                    <td className="px-6 py-5 font-black text-slate-900 text-sm text-right font-mono italic">
                      ¥ {subtotal.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                      {est.deliveryDate || '未設定'}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => onLoad(est)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="編集する"><Eye size={18} /></button>
                        <button onClick={() => onDelete(est.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="削除する"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EstimateDashboard;
