
import React, { useState } from 'react';
import { Printer, FileText, ClipboardList, ReceiptText } from 'lucide-react';
import { EstimateData } from '../types';
import BasicContract from './documents/BasicContract';
import IndividualContract from './documents/IndividualContract';
import EstimateSheet from './documents/EstimateSheet';

interface DocumentPreviewProps {
  data: EstimateData;
}

type DocView = 'BASIC' | 'INDIVIDUAL' | 'ESTIMATE';

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ data }) => {
  const [view, setView] = useState<DocView>('BASIC');

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    // ブラウザの印刷機能を呼び出し
    window.print();
  };

  const getDocTitle = () => {
    switch(view) {
      case 'BASIC': return '業務委託基本契約書';
      case 'INDIVIDUAL': return '個別契約書（発注書）';
      case 'ESTIMATE': return '御見積書';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* View Switcher */}
      <div className="no-print bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-2 mb-10 flex gap-2 border border-slate-200 sticky top-4 z-[100]">
        <button 
          onClick={() => setView('BASIC')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all duration-200 ${view === 'BASIC' ? 'bg-slate-900 text-white shadow-lg scale-105' : 'hover:bg-slate-50 text-slate-400'}`}
        >
          <FileText size={18} />
          基本契約書
        </button>
        <button 
          onClick={() => setView('INDIVIDUAL')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all duration-200 ${view === 'INDIVIDUAL' ? 'bg-slate-900 text-white shadow-lg scale-105' : 'hover:bg-slate-50 text-slate-400'}`}
        >
          <ClipboardList size={18} />
          個別契約書
        </button>
        <button 
          onClick={() => setView('ESTIMATE')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all duration-200 ${view === 'ESTIMATE' ? 'bg-slate-900 text-white shadow-lg scale-105' : 'hover:bg-slate-50 text-slate-400'}`}
        >
          <ReceiptText size={18} />
          御見積書
        </button>
      </div>

      {/* Action Bar */}
      <div className="no-print w-full max-w-[210mm] flex justify-between items-center mb-6 text-slate-500 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
           <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Preview: <span className="text-slate-800">{getDocTitle()}</span></span>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-xl active:scale-95 group relative overflow-hidden"
        >
          <Printer size={20} className="group-hover:scale-110 transition-transform" />
          <span className="font-black">印刷・PDFとして出力</span>
        </button>
      </div>

      {/* Document Container */}
      <div className="print-page w-full flex flex-col items-center gap-10">
        {view === 'BASIC' && <BasicContract data={data} />}
        {view === 'INDIVIDUAL' && <IndividualContract data={data} />}
        {view === 'ESTIMATE' && <EstimateSheet data={data} />}
      </div>
    </div>
  );
};

export default DocumentPreview;
