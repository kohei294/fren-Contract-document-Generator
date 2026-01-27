
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
  LogOut
} from 'lucide-react';
import InputForm from './components/InputForm';
import DocumentPreview from './components/DocumentPreview';
import EstimateDashboard from './components/EstimateDashboard';
import AuthGate from './components/AuthGate';
import { EstimateData, ProviderInfo } from './types';

// 環境変数の紐付け（型エラー回避のため as any を使用）
const API_ACCESS_KEY = (process as any).env.VITE_GAS_API_KEY || 'fren-access'; 
const GAS_API_URL = (process as any).env.VITE_GAS_API_URL || 'https://script.google.com/macros/library/d/17TJcuf1jt5tTnavo8wKYMABobt10o9vt_kLiE5NOBCsU7OvJqe3dW9dC/2'; 

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [viewMode, setViewMode] = useState<'input' | 'split' | 'preview'>('split');
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [savedEstimates, setSavedEstimates] = useState<EstimateData[]>([]);
  const [formKey, setFormKey] = useState<string>(crypto.randomUUID());

  // 認証状態の初期チェック
  useEffect(() => {
    const authStatus = localStorage.getItem('fren_auth_status');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

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
      contractDate: today,
      workStartDate: '',
      workEndDate: '',
      deliveryDate: '',
      contractType: 'HYBRID' as const,
      ipPattern: 'A' as const,
      estimateValidity: '本見積書発行日より2週間',
      paymentType: 'MILESTONE' as const,
      revisions: {
        design: 2,
        coding: 1,
        others: '撮影後のレタッチは色調補正のみ（合成・変形は含まず）'
      },
      quasiPatterns: {
        selected: 'A' as const,
        A: { name: 'パターンA', price: '¥ 30,000 /人日', condition: '月 8 人日相当', overtime: 'あり' },
        B: { name: 'パターンB', price: '役割別月額単価', condition: '稼働率: __ %', overtime: 'あり' },
        C: { name: 'パターンC', price: '月額: ¥ ____ /月', condition: '制限なし', overtime: 'なし' },
        D: { name: '該当なし', price: '-', condition: '-', overtime: '-' }
      },
      deliverables: {
        final: 'HTML/CSS/JS一式、提案資料（PDF形式）',
        intermediate: 'ワイヤーフレーム、デザインカンプ（画像またはFigma閲覧権限）',
        sourceData: false,
        sourceFormat: '.fig, .ai'
      },
      hasPhotography: true,
      photoDetails: {
        days: '1',
        hours: '8',
        cuts: '50',
        modelInfo: '委託者にて手配（社員様等）',
        rightsHandling: 'CLIENT' as const
      },
      hasNotes: false,
      notes: ''
    };
  }, [getProvider]);

  const [estimateData, setEstimateData] = useState<EstimateData>(createInitialData());

  const fetchEstimates = async () => {
    if (!GAS_API_URL) return;
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

  useEffect(() => { 
    if (isAuthenticated) fetchEstimates(); 
  }, [isAuthenticated]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      localStorage.setItem('fren_provider_info', JSON.stringify(estimateData.provider));
      const subtotal = estimateData.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      const totalAmount = subtotal - estimateData.discount;
      
      const response = await fetch(GAS_API_URL, {
        method: 'POST',
        body: JSON.stringify({ 
          action: 'save', 
          key: API_ACCESS_KEY, 
          data: { ...estimateData, totalAmount } 
        })
      });
      const result = await response.json();
      if (result.status !== 'success') throw new Error(result.message);
      alert('スプレッドシートへの保存が完了しました。');
      await fetchEstimates(); 
    } catch (err: any) {
      alert(`保存失敗: ${err.message}`);
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
        body: JSON.stringify({ 
          action: 'delete', 
          key: API_ACCESS_KEY, 
          id: String(targetId) 
        })
      });
      const result = await response.json();
      if (result.status === 'success') {
        alert('削除が完了しました。');
        setSavedEstimates(prev => prev.filter(e => e.id !== targetId));
      } else {
        alert(`削除に失敗しました: ${result.message}`);
      }
    } catch (err: any) {
      alert(`エラー: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('ログアウトしますか？')) {
      localStorage.removeItem('fren_auth_status');
      setIsAuthenticated(false);
    }
  };

  const handleNew = () => {
    if (confirm('入力をすべて破棄して新規作成しますか？')) {
      setEstimateData(createInitialData());
      setFormKey(crypto.randomUUID()); 
      setActiveTab('create');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoadEstimate = (data: EstimateData) => {
    setEstimateData(data);
    setFormKey(data.id);
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthenticated) {
    return <AuthGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col text-slate-900 font-sans print:block print:h-auto print:bg-white animate-in fade-in duration-1000">
      <nav className="no-print bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded">
            <span className="text-slate-900 font-bold text-xl px-1">fren</span>
          </div>
          <h1 className="text-lg font-medium tracking-tight ml-2">Contract document Generator</h1>
          {(isSyncing || isLoading) && <RefreshCw size={14} className="animate-spin ml-4 text-slate-400" />}
        </div>
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('create')} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${activeTab === 'create' ? 'bg-white text-slate-900 shadow' : 'hover:bg-slate-800'}`}>
            <PlusCircle size={18} /><span>作成・編集</span>
          </button>
          <button onClick={() => setActiveTab('history')} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${activeTab === 'history' ? 'bg-white text-slate-900 shadow' : 'hover:bg-slate-800'}`}>
            <History size={18} /><span>案件管理台帳</span>
          </button>
          <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-white transition-colors" title="ログアウト">
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {activeTab === 'create' && (
        <div className="no-print bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm sticky top-[64px] z-40">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setViewMode('input')} className={`px-4 py-2 rounded-lg text-xs font-bold ${viewMode === 'input' ? 'bg-white shadow-sm' : ''}`}><ClipboardList size={14} className="inline mr-1" /> 入力</button>
            <button onClick={() => setViewMode('split')} className={`px-4 py-2 rounded-lg text-xs font-bold ${viewMode === 'split' ? 'bg-white shadow-sm' : ''}`}><Columns size={14} className="inline mr-1" /> 分割</button>
            <button onClick={() => setViewMode('preview')} className={`px-4 py-2 rounded-lg text-xs font-bold ${viewMode === 'preview' ? 'bg-white shadow-sm' : ''}`}><Maximize2 size={14} className="inline mr-1" /> プレビュー</button>
          </div>
          <div className="flex gap-2">
            <button onClick={handleNew} className="flex items-center gap-2 px-4 py-2 text-red-500 border border-slate-200 rounded-lg text-xs font-bold hover:bg-red-50 transition shadow-sm">
              <Trash2 size={16} /> 新規作成
            </button>
            <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 px-8 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition shadow-lg font-bold text-sm">
              {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />}
              <span>台帳に保存</span>
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 flex bg-slate-50 overflow-hidden print:block print:overflow-visible print:h-auto print:bg-white">
        {activeTab === 'create' ? (
          <>
            {(viewMode === 'input' || viewMode === 'split') && (
              <div className={`no-print bg-white border-r border-slate-200 overflow-y-auto h-[calc(100vh-120px)] ${viewMode === 'input' ? 'w-full' : 'w-[450px]'}`}>
                <div className="p-6">
                  <InputForm key={formKey} data={estimateData} onChange={setEstimateData} isFullWidth={viewMode === 'input'} />
                </div>
              </div>
            )}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className="flex-1 p-8 overflow-y-auto h-[calc(100vh-120px)] print:p-0 print:overflow-visible print:h-auto print:w-full print:block">
                <DocumentPreview data={estimateData} />
              </div>
            )}
          </>
        ) : (
          <div className="w-full p-8 overflow-y-auto print:hidden">
            <EstimateDashboard estimates={savedEstimates} onLoad={handleLoadEstimate} onDelete={handleDelete} isSyncing={isSyncing || isLoading} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
