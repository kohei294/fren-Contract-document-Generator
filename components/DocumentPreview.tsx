
import React, { useState, useEffect } from 'react';
import { Printer, FileText, ClipboardList, ReceiptText, Sparkles } from 'lucide-react';
import { EstimateData } from '../types';
import BasicContract from './documents/BasicContract';
import IndividualContract from './documents/IndividualContract';
import EstimateSheet from './documents/EstimateSheet';

interface DocumentPreviewProps {
  data: EstimateData;
  highlightSection?: string | null;
}

type DocView = 'BASIC' | 'INDIVIDUAL' | 'ESTIMATE';

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ data, highlightSection }) => {
  const [view, setView] = useState<DocView>('BASIC');

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
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
    <div className="flex flex-col items-center print:block print:w-full print:m-0 print:p-0 relative">
      <div className="no-print bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-2 mb-10 flex gap-2 border border-slate-200 sticky top-4 z-[100] scale-90 md:scale-100">
        <button onClick={() => setView('BASIC')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all ${view === 'BASIC' ? 'bg-slate-900 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-400'}`}><FileText size={16} />基本契約</button>
        <button onClick={() => setView('INDIVIDUAL')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all ${view === 'INDIVIDUAL' ? 'bg-slate-900 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-400'}`}><ClipboardList size={16} />個別契約</button>
        <button onClick={() => setView('ESTIMATE')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all ${view === 'ESTIMATE' ? 'bg-slate-900 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-400'}`}><ReceiptText size={16} />御見積書</button>
      </div>

      <div className="no-print w-full max-w-[210mm] flex justify-between items-center mb-6 text-slate-500 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100 uppercase tracking-widest">
             <Sparkles size={10} className="animate-pulse" /> リアルタイム反映中
           </div>
           <span className="text-xs font-bold text-slate-800">{getDocTitle()}</span>
        </div>
        <button onClick={handlePrint} className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-xl active:scale-95 group"><Printer size={18} /><span className="font-black text-xs">PDF出力 / 印刷</span></button>
      </div>

      <div className={`w-full flex flex-col items-center gap-10 print:gap-0 print:block print:p-0 print:w-full transition-all duration-500`}>
        {view === 'BASIC' && <BasicContract data={data} highlightSection={highlightSection} />}
        {view === 'INDIVIDUAL' && <IndividualContract data={data} highlightSection={highlightSection} />}
        {view === 'ESTIMATE' && <EstimateSheet data={data} highlightSection={highlightSection} />}
      </div>

      <style>{`
        .section-highlight {
          position: relative;
          transition: all 0.4s ease;
        }
        .section-highlight.active {
          background-color: rgba(79, 70, 229, 0.05);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
          border-radius: 4px;
        }
        @media print {
          .section-highlight.active {
            background-color: transparent !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DocumentPreview;
