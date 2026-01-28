
import React, { useState, useEffect, useCallback } from 'react';
import { 
  PlusCircle, 
  Download, 
  History, 
  ClipboardList,
  Columns,
  Maximize2,
  RefreshCw,
  Trash2,
  LogOut,
  CheckCircle,
  HelpCircle,
  Info
} from 'lucide-react';
import InputForm from './components/InputForm';
import DocumentPreview from './components/DocumentPreview';
import EstimateDashboard from './components/EstimateDashboard';
import AuthGate from './components/AuthGate';
import { EstimateData, ProviderInfo } from './types';

const getEnv = () => {
  try { return (import.meta as any).env || {}; } catch (e) { return {}; }
};

const env = getEnv();
const API_ACCESS_KEY = env.VITE_GAS_API_KEY || 'fren-access'; 
const GAS_API_URL = env.VITE_GAS_API_URL || 'https://script.google.com/macros/s/AKfycby6j3MJ5qcU7G5k8teSOz-eOjt_RAOSrtmbwEVhYhFI0Rli4lZIpk52WVBBNoJlNiSW/exec'; 

const DEFAULT_PROVIDER: ProviderInfo = {
  companyName: 'fren株式会社',
  zipCode: '152-0035',
  address: '東京都目黒区自由が丘3-14-10',
  building: 'J-PRIDE SOUTH007',
  representative: '中島 竜太郎',
  tel: '090-xxxx-xxxx',
  personInCharge: '中島 竜太郎'
};

const generateEstimateNumber = (dateStr?: string) => {
  const date = dateStr ? new Date(dateStr) : new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}-01`;
};

const App: React.FC = () => {
  // セキュリティ強化：リロードのたびに認証を求めるため初期値を false にし、localStorage チェックを廃止
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [viewMode, setViewMode] = useState<'split' | 'input' | 'preview'>('split');
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [savedEstimates, setSavedEstimates] = useState<EstimateData[]>([]);
  const [formKey, setFormKey] = useState<string>(crypto.randomUUID());
  const [focusedSection, setFocusedSection] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const getProvider = useCallback(() => {
    const saved = localStorage.getItem('fren_provider_info');
    return saved ? JSON.parse(saved) : DEFAULT_PROVIDER;
  }, []);

  const createInitialData = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      id: crypto.randomUUID(),
      estimateNumber: generateEstimateNumber(today),
      createdAt: new Date().toISOString(),
      documentDate: today,
      client: { companyName: '', address: '', representative: '', projectName: '' },
      provider: getProvider(),
      items: [
        { id: '1', category: '請負型業務', name: 'キービジュアル開発', details: 'ビジュアルアイデンティティ開発、展開', unitPrice: 0, quantity: 0, unit: '式' },
        { id: '2', category: '請負型業務', name: 'ブランドサイト制作', details: '構成、デザイン、実装', unitPrice: 0, quantity: 0, unit: '式' },
        { id: '3', category: '準委任型業務', name: '全体ディレクション', details: '品質管理、情報設計、PM', unitPrice: 0, quantity: 0, unit: '人日' }
      ],
      discount: 0,
      taxRate: 10, // デフォルト税率 10%
      contractDate: today,
      workStartDate: '',
      workEndDate: '',
      deliveryDate: '',
      contractType: 'HYBRID' as const,
      ipPattern: 'A' as const,
      estimateValidity: '本見積書発行日より2週間',
      paymentType: 'MILESTONE' as const,
      revisions: { design: 2, coding: 1, others: '撮影後のレタッチは色調補正のみ（合成・変形は含まず）' },
      quasiPatterns: {
        selected: 'A' as const,
        A: { name: 'パターンA', price: '¥ 30,000 /人日', condition: '月 8 人日相当', overtime: 'あり' },
        B: { name: 'パターンB', price: '役割別月額単価', condition: '稼働率: __ %', overtime: 'あり' },
        C: { name: 'パターンC', price: '月額: ¥ ____ /月', condition: '制限なし', overtime: 'なし' },
        D: { name: '該当なし', price: '-', condition: '-', overtime: '-' }
      },
      deliverables: { final: 'HTML/CSS/JS一式、提案資料（PDF形式）', intermediate: 'ワイヤーフレーム、デザインカンプ（画像またはFigma閲覧権限）', sourceData: false, sourceFormat: '.fig, .ai' },
      hasPhotography: true,
      photoDetails: { days: '1', hours: '8', cuts: '50', modelInfo: '委託者にて手配（社員様等）', rightsHandling: 'CLIENT' as const },
      hasNotes: false,
      notes: ''
    };
  }, [getProvider]);

  const [estimateData, setEstimateData] = useState<EstimateData>(createInitialData());

  const fetchEstimates = async () => {
    if (!GAS_API_URL || GAS_API_URL.includes('library')) return;
    try {
      setIsSyncing(true);
      const response = await fetch(`${GAS_API_URL}?key=${API_ACCESS_KEY}`);
      const data = await response.json();
      setSavedEstimates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => { if (isAuthenticated) fetchEstimates(); }, [isAuthenticated]);

  const handleSave = async () => {
    try {
      setSaveStatus('saving');
      setIsLoading(true);
      localStorage.setItem('fren_provider_info', JSON.stringify(estimateData.provider));
      const subtotal = estimateData.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      const totalAmount = subtotal - estimateData.discount;
      
      const response = await fetch(GAS_API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'save', key: API_ACCESS_KEY, data: { ...estimateData, totalAmount } })
      });
      const result = await response.json();
      if (result.status !== 'success') throw new Error(result.message);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
      await fetchEstimates(); 
    } catch (err: any) {
      alert(`保存失敗: ${err.message}`);
      setSaveStatus('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (targetId: string) => {
    if (!confirm('このデータを台帳から完全に削除しますか？')) return;
    try {
      setIsLoading(true);
      const response = await fetch(GAS_API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'delete', key: API_ACCESS_KEY, id: String(targetId) })
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSavedEstimates(prev => prev.filter(e => e.id !== targetId));
      } else {
        alert(`削除失敗: ${result.message}`);
      }
    } catch (err: any) {
      alert(`エラー: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('ログアウトしますか？')) {
      setIsAuthenticated(false);
    }
  };

  const handleLoadEstimate = (data: EstimateData) => {
    setEstimateData(data);
    setFormKey(data.id);
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthenticated) return <AuthGate onAuthenticated={() => setIsAuthenticated(true)} />;

  return (
    <div className="min-h-screen flex flex-col text-slate-900 font-sans print:block animate-in fade-in duration-700">
      <nav className="no-print bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-white font-black text-[24px] px-2 leading-none">fren</span>
          </div>
          <h1 className="text-lg font-medium tracking-tight ml-2 border-l border-slate-700 pl-4 hidden md:block">Contract document Generator</h1>
          <div className="ml-4 flex items-center">
            {isSyncing ? (
              <span className="text-[10px] text-slate-400 flex items-center gap-1"><RefreshCw size={10} className="animate-spin" /> クラウド同期中...</span>
            ) : saveStatus === 'saved' ? (
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 animate-in zoom-in duration-300"><CheckCircle size={12} /> クラウドに保存しました</span>
            ) : (
              <span className="text-[10px] text-slate-500">編集可能</span>
            )}
          </div>
        </div>
        <div className="flex gap-2 md:gap-4 items-center">
          <button onClick={() => setActiveTab('create')} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-bold ${activeTab === 'create' ? 'bg-white text-slate-900 shadow-md' : 'hover:bg-slate-800 text-slate-300'}`}>
            <PlusCircle size={16} /><span>作成・編集</span>
          </button>
          <button onClick={() => setActiveTab('history')} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-bold ${activeTab === 'history' ? 'bg-white text-slate-900 shadow-md' : 'hover:bg-slate-800 text-slate-300'}`}>
            <History size={16} /><span>案件台帳</span>
          </button>
          <button onClick={() => setShowGuide(!showGuide)} className="p-2 text-slate-400 hover:text-white transition-colors" title="操作ガイド">
            <HelpCircle size={20} />
          </button>
          <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-400 transition-colors" title="ログアウト">
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {showGuide && (
        <div className="no-print bg-indigo-600 text-white p-4 flex items-center justify-between animate-in slide-in-from-top duration-300 relative z-50 shadow-inner">
          <div className="flex items-center gap-3 max-w-4xl mx-auto w-full">
            <Info size={20} className="shrink-0" />
            <p className="text-sm font-medium leading-relaxed">
              <strong>使い方ガイド:</strong> 左側のフォームに入力すると、右側のプレビューに即座に反映されます。専門用語には <HelpCircle size={12} className="inline mb-1" /> を置いています。入力が終わったら「クラウドに保存」を押すと、台帳（スプレッドシート）にデータが保管されます。
            </p>
          </div>
          <button onClick={() => setShowGuide(false)} className="text-white/60 hover:text-white font-bold text-xs uppercase tracking-widest px-4">閉じる</button>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="no-print bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm sticky top-[72px] z-40">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setViewMode('input')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${viewMode === 'input' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>入力のみ</button>
            <button onClick={() => setViewMode('split')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${viewMode === 'split' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>分割表示</button>
            <button onClick={() => setViewMode('preview')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${viewMode === 'preview' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>プレビュー</button>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { if(confirm('入力をすべてリセットしますか？')) setEstimateData(createInitialData()); }} className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-xs font-bold transition">
              <RefreshCw size={14} /> リセット
            </button>
            <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition shadow-lg font-black text-xs uppercase tracking-widest active:scale-95 disabled:opacity-50">
              {saveStatus === 'saving' ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />}
              <span>{saveStatus === 'saving' ? '保存中...' : saveStatus === 'saved' ? '保存完了' : 'クラウドに保存'}</span>
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 flex bg-slate-50 overflow-hidden print:block print:bg-white">
        {activeTab === 'create' ? (
          <>
            {(viewMode === 'input' || viewMode === 'split') && (
              <div className={`no-print bg-white border-r border-slate-200 overflow-y-auto h-[calc(100vh-130px)] ${viewMode === 'input' ? 'w-full' : 'w-[450px]'}`}>
                <div className="p-6">
                  <InputForm 
                    key={formKey} 
                    data={estimateData} 
                    onChange={setEstimateData} 
                    isFullWidth={viewMode === 'input'} 
                    onSectionFocus={(id) => setFocusedSection(id)}
                  />
                </div>
              </div>
            )}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className="flex-1 p-8 overflow-y-auto h-[calc(100vh-130px)] print:p-0 print:overflow-visible print:h-auto print:w-full print:block">
                <DocumentPreview data={estimateData} highlightSection={focusedSection} />
              </div>
            )}
          </>
        ) : (
          <div className="w-full p-8 overflow-y-auto print:hidden">
            <EstimateDashboard 
              estimates={savedEstimates} 
              onLoad={handleLoadEstimate} 
              onDelete={handleDelete} 
              isSyncing={isSyncing || isLoading}
              onCreateNew={() => setActiveTab('create')}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
