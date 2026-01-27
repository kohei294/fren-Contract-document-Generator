
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Eye, 
  Trash2, 
  Calendar,
  RefreshCw,
  Database
} from 'lucide-react';
import { EstimateData } from '../types';

interface EstimateDashboardProps {
  estimates: EstimateData[];
  onLoad: (data: EstimateData) => void;
  onDelete: (id: string) => void;
  isSyncing?: boolean;
}

const EstimateDashboard: React.FC<EstimateDashboardProps> = ({ estimates, onLoad, onDelete, isSyncing = false }) => {
  const [dateFilter, setDateFilter] = useState({
    start: '',
    end: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEstimates = useMemo(() => {
    return estimates.filter(est => {
      const createdAt = new Date(est.createdAt).toISOString().split('T')[0];
      const lowerSearch = searchTerm.toLowerCase();
      
      const matchesSearch = 
        (est.client.companyName?.toLowerCase().includes(lowerSearch)) || 
        (est.client.projectName?.toLowerCase().includes(lowerSearch)) ||
        (est.estimateNumber?.toLowerCase().includes(lowerSearch));
      
      const matchesStart = !dateFilter.start || createdAt >= dateFilter.start;
      const matchesEnd = !dateFilter.end || createdAt <= dateFilter.end;
      
      return matchesSearch && matchesStart && matchesEnd;
    });
  }, [estimates, searchTerm, dateFilter]);

  const exportToCSV = () => {
    if (filteredEstimates.length === 0) return;

    const headers = [
      '作成日',
      '管理番号',
      '企業名',
      '案件名',
      '契約形態',
      '見積合計(税別)',
      '契約日',
      '納期'
    ];

    const rows = filteredEstimates.map(est => {
      const subtotal = est.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0) - est.discount;
      return [
        new Date(est.createdAt).toLocaleDateString('ja-JP'),
        est.estimateNumber,
        est.client.companyName,
        est.client.projectName,
        est.contractType,
        subtotal,
        est.contractDate,
        est.deliveryDate
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

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

  const inputClasses = "w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition shadow-sm placeholder:text-slate-400";
  const dateInputClasses = "w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition shadow-sm";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Database className="text-slate-400" size={24} />
          <h2 className="text-2xl font-bold text-slate-900">案件管理台帳（スプレッドシート連携中）</h2>
          {isSyncing && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full animate-pulse border border-indigo-100">
              <RefreshCw size={10} className="animate-spin" />
              同期中
            </span>
          )}
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-md font-bold"
        >
          <Download size={18} />
          <span>CSVダウンロード ({filteredEstimates.length}件)</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative md:col-span-1">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">プロジェクト検索</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="番号・企業名・案件名で検索"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">作成開始日</label>
          <input 
            type="date" 
            value={dateFilter.start}
            onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
            className={dateInputClasses}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">作成終了日</label>
          <input 
            type="date" 
            value={dateFilter.end}
            onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
            className={dateInputClasses}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 border-b border-slate-100">管理番号 / 作成日</th>
              <th className="px-6 py-4 border-b border-slate-100">企業名 / 案件</th>
              <th className="px-6 py-4 border-b border-slate-100 text-right">金額 (税別)</th>
              <th className="px-6 py-4 border-b border-slate-100">納期</th>
              <th className="px-6 py-4 text-right border-b border-slate-100">アクション</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isSyncing && estimates.length === 0 ? (
               <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw size={32} className="animate-spin text-slate-200" />
                    <p className="font-medium">スプレッドシートからデータを取得中...</p>
                  </div>
                </td>
              </tr>
            ) : filteredEstimates.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-slate-400">
                  該当する履歴が見つかりません。
                </td>
              </tr>
            ) : (
              filteredEstimates.map((est) => {
                const subtotal = est.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0) - est.discount;
                return (
                  <tr key={est.id} className="hover:bg-slate-50 transition group">
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs font-bold text-indigo-600">{est.estimateNumber}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(est.createdAt).toLocaleDateString('ja-JP')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{est.client.companyName || '（未入力）'}</p>
                      <p className="text-xs text-slate-500">{est.client.projectName}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm text-right font-mono">
                      ¥ {subtotal.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {est.deliveryDate}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button 
                          onClick={() => onLoad(est)}
                          className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition"
                          title="閲覧・編集"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => onDelete(est.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                          title="削除"
                        >
                          <Trash2 size={18} />
                        </button>
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
