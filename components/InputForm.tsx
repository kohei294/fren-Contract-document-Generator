
import React, { useState, useMemo } from 'react';
import { 
  Plus, Trash2, Building2, User, FileText, Calendar, 
  Settings, Layers, CheckCircle2, ShieldCheck, 
  FileOutput, ChevronDown, ChevronRight, Edit3,
  ClipboardList, Camera
} from 'lucide-react';
import { EstimateData, EstimateItem, ContractType, ProviderInfo, QuasiPattern } from '../types';

interface InputFormProps {
  data: EstimateData;
  onChange: (data: EstimateData) => void;
  isFullWidth?: boolean;
}

const CATEGORY_PRESETS = [
  "ブランド構築費用",
  "ブランドサイト制作費用",
  "全体ディレクション費用",
  "撮影・編集費用",
  "実費・その他"
];

const InputForm: React.FC<InputFormProps> = ({ data, onChange, isFullWidth = false }) => {
  const [showAddCat, setShowAddCat] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('basic');

  // 項目をカテゴリーごとにグループ化
  const groupedItems = useMemo(() => {
    const groups: Record<string, EstimateItem[]> = {};
    data.items.forEach(item => {
      const cat = (item.category || "未分類").trim();
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [data.items]);

  const currentCategories = useMemo(() => Object.keys(groupedItems), [groupedItems]);

  const updateClient = (key: string, value: string) => {
    onChange({ ...data, client: { ...data.client, [key]: value } });
  };

  const updateProvider = (key: keyof ProviderInfo, value: string) => {
    onChange({ ...data, provider: { ...data.provider, [key]: value } });
  };

  const updateQuasiPattern = (type: 'A' | 'B' | 'C' | 'D', field: keyof QuasiPattern, value: string) => {
    onChange({
      ...data,
      quasiPatterns: {
        ...data.quasiPatterns,
        [type]: { ...data.quasiPatterns[type], [field]: value }
      }
    });
  };

  const addItemToCategory = (category: string) => {
    const newItem: EstimateItem = {
      id: Math.random().toString(36).substr(2, 9),
      category: category.trim(),
      subCategory: '',
      name: '',
      details: '',
      unitPrice: 0,
      quantity: 0,
      unit: '式'
    };
    onChange({ ...data, items: [...data.items, newItem] });
    setShowAddCat(false);
  };

  const removeItem = (id: string) => {
    onChange({ ...data, items: data.items.filter(item => item.id !== id) });
  };

  const removeCategory = (e: React.MouseEvent, categoryName: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`「${categoryName}」の全項目を削除しますか？`)) {
      const targetCat = categoryName.trim();
      onChange({ 
        ...data, 
        items: data.items.filter(item => (item.category || "未分類").trim() !== targetCat) 
      });
    }
  };

  const updateItem = (id: string, field: keyof EstimateItem, value: any) => {
    const updatedItems = data.items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, items: updatedItems });
  };

  const inputClasses = `w-full bg-white border border-slate-200 rounded-lg px-3 py-2 ${isFullWidth ? 'text-base' : 'text-sm'} text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-sm placeholder:text-slate-300`;
  const labelClasses = `block ${isFullWidth ? 'text-xs' : 'text-[10px]'} font-bold text-slate-400 uppercase mb-1 tracking-widest`;
  const cellInputClasses = `w-full border-b border-transparent hover:border-slate-200 focus:border-indigo-500 px-1 py-1.5 ${isFullWidth ? 'text-sm' : 'text-[12px]'} font-bold text-slate-900 bg-transparent outline-none transition`;
  const sectionHeaderClasses = "flex items-center justify-between w-full p-4 hover:bg-slate-50 transition border-b border-slate-100 cursor-pointer select-none group";

  return (
    <div className={`space-y-6 ${isFullWidth ? 'max-w-none' : 'max-w-4xl mx-auto'}`}>
      
      {/* 1. 基本設定 */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div onClick={() => setActiveSection(activeSection === 'basic' ? '' : 'basic')} className={sectionHeaderClasses}>
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg transition-colors ${activeSection === 'basic' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
              <Settings size={16} />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-slate-700">1. プロジェクト基本設定</h3>
          </div>
          {activeSection === 'basic' ? <ChevronDown size={16} className="text-slate-300" /> : <ChevronRight size={16} className="text-slate-300" />}
        </div>
        {activeSection === 'basic' && (
          <div className="p-6 space-y-8 animate-in slide-in-from-top-1 duration-200">
            <div className={`grid ${isFullWidth ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
              <div>
                <label className={labelClasses}>プロジェクト名</label>
                <input type="text" value={data.client.projectName} onChange={(e) => updateClient('projectName', e.target.value)} className={inputClasses} placeholder="案件名を入力" />
              </div>
              <div>
                <label className={labelClasses}>管理番号（見積・発注共通）</label>
                <input type="text" value={data.estimateNumber} onChange={(e) => onChange({...data, estimateNumber: e.target.value})} className={inputClasses} placeholder="YYYYMMDD-01" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClasses}>書類作成日</label>
                  <input type="date" value={data.documentDate} onChange={(e) => onChange({...data, documentDate: e.target.value})} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>見積有効期限</label>
                  <input type="text" value={data.estimateValidity} onChange={(e) => onChange({...data, estimateValidity: e.target.value})} className={inputClasses} placeholder="発行より2週間など" />
                </div>
              </div>
            </div>

            <div className={`grid ${isFullWidth ? 'grid-cols-2' : 'grid-cols-1'} gap-6 border-t border-slate-100 pt-8`}>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-4">
                <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  <Building2 size={12} /> 自社（受託者）情報
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className={labelClasses}>社名</label>
                    <input type="text" placeholder="fren株式会社" value={data.provider.companyName} onChange={(e) => updateProvider('companyName', e.target.value)} className={inputClasses} />
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <label className={labelClasses}>郵便番号</label>
                      <input type="text" placeholder="〒152-0035" value={data.provider.zipCode} onChange={(e) => updateProvider('zipCode', e.target.value)} className={inputClasses} />
                    </div>
                    <div className="col-span-8">
                      <label className={labelClasses}>住所</label>
                      <input type="text" placeholder="東京都目黒区..." value={data.provider.address} onChange={(e) => updateProvider('address', e.target.value)} className={inputClasses} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelClasses}>代表者名</label>
                      <input type="text" placeholder="中島 竜太郎" value={data.provider.representative} onChange={(e) => updateProvider('representative', e.target.value)} className={inputClasses} />
                    </div>
                    <div>
                      <label className={labelClasses}>担当者名</label>
                      <input type="text" placeholder="中島 竜太郎" value={data.provider.personInCharge} onChange={(e) => updateProvider('personInCharge', e.target.value)} className={inputClasses} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 md:pt-0">
                <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  <User size={12} /> クライアント情報
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className={labelClasses}>企業名</label>
                    <input type="text" placeholder="株式会社●●" value={data.client.companyName} onChange={(e) => updateClient('companyName', e.target.value)} className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>住所</label>
                    <input type="text" placeholder="東京都XX区XX 1-2-3" value={data.client.address} onChange={(e) => updateClient('address', e.target.value)} className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>代表者職名・氏名</label>
                    <input type="text" placeholder="代表取締役 ___________" value={data.client.representative} onChange={(e) => updateClient('representative', e.target.value)} className={inputClasses} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. 契約形態 */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div onClick={() => setActiveSection(activeSection === 'contract' ? '' : 'contract')} className={sectionHeaderClasses}>
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg transition-colors ${activeSection === 'contract' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
              <ShieldCheck size={16} />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-slate-700">2. 契約形態・パターン設定</h3>
          </div>
          {activeSection === 'contract' ? <ChevronDown size={16} className="text-slate-300" /> : <ChevronRight size={16} className="text-slate-300" />}
        </div>
        {activeSection === 'contract' && (
          <div className="p-6 space-y-6 animate-in slide-in-from-top-1 duration-200">
            <div className={isFullWidth ? 'max-w-md' : ''}>
              <label className={labelClasses}>業務区分</label>
              <select value={data.contractType} onChange={(e) => onChange({ ...data, contractType: e.target.value as ContractType })} className={inputClasses}>
                <option value="FIXED">請負型（成果物完成義務あり）</option>
                <option value="QUASI">準委任型（善管注意義務）</option>
                <option value="HYBRID">混合 (ハイブリッド型)</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className={labelClasses}>準委任パターンの詳細 (個別契約書第5条に反映)</label>
              <div className={`grid ${isFullWidth ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                {(['A', 'B', 'C', 'D'] as const).map((type) => (
                  <div key={type} className={`p-4 rounded-xl border-2 transition-all ${data.quasiPatterns.selected === type ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <input 
                        type="radio" 
                        name="quasi-select" 
                        checked={data.quasiPatterns.selected === type} 
                        onChange={() => onChange({ ...data, quasiPatterns: { ...data.quasiPatterns, selected: type } })}
                        className="w-5 h-5 text-indigo-600 accent-indigo-600"
                      />
                      <input 
                        type="text" 
                        value={data.quasiPatterns[type].name} 
                        onChange={(e) => updateQuasiPattern(type, 'name', e.target.value)}
                        className="bg-transparent border-b border-slate-300 font-bold text-sm outline-none focus:border-indigo-400 px-1 w-full"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 font-bold block">単価</span>
                        <input type="text" value={data.quasiPatterns[type].price} onChange={(e) => updateQuasiPattern(type, 'price', e.target.value)} className="text-[11px] p-2 rounded bg-white border border-slate-200 font-bold w-full" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 font-bold block">条件</span>
                        <input type="text" value={data.quasiPatterns[type].condition} onChange={(e) => updateQuasiPattern(type, 'condition', e.target.value)} className="text-[11px] p-2 rounded bg-white border border-slate-200 font-bold w-full" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 font-bold block">超過</span>
                        <input type="text" value={data.quasiPatterns[type].overtime} onChange={(e) => updateQuasiPattern(type, 'overtime', e.target.value)} className="text-[11px] p-2 rounded bg-white border border-slate-200 font-bold w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. 期間・支払 */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div onClick={() => setActiveSection(activeSection === 'terms' ? '' : 'terms')} className={sectionHeaderClasses}>
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg transition-colors ${activeSection === 'terms' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
              <Calendar size={16} />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-slate-700">3. 期間・支払・著作権</h3>
          </div>
          {activeSection === 'terms' ? <ChevronDown size={16} className="text-slate-300" /> : <ChevronRight size={16} className="text-slate-300" />}
        </div>
        {activeSection === 'terms' && (
          <div className="p-6 space-y-8 animate-in slide-in-from-top-1 duration-200">
            <div className={`grid ${isFullWidth ? 'grid-cols-4' : 'grid-cols-2'} gap-4`}>
              <div>
                <label className={labelClasses}>契約締結日</label>
                <input type="date" value={data.contractDate} onChange={(e) => onChange({...data, contractDate: e.target.value})} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>最終納期</label>
                <input type="date" value={data.deliveryDate} onChange={(e) => onChange({...data, deliveryDate: e.target.value})} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>作業開始日</label>
                <input type="date" value={data.workStartDate} onChange={(e) => onChange({...data, workStartDate: e.target.value})} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>作業終了日</label>
                <input type="date" value={data.workEndDate} onChange={(e) => onChange({...data, workEndDate: e.target.value})} className={inputClasses} />
              </div>
            </div>

            <div className={`grid ${isFullWidth ? 'grid-cols-2' : 'grid-cols-1'} gap-6 border-t border-slate-100 pt-8`}>
              <div>
                <label className={labelClasses}>支払方法</label>
                <select value={data.paymentType} onChange={(e) => onChange({...data, paymentType: e.target.value as any})} className={inputClasses}>
                  <option value="SINGLE">一括払い (納品翌月末)</option>
                  <option value="MILESTONE">分割払い (着手50% / 完了50%)</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>著作権の取扱い</label>
                <select value={data.ipPattern} onChange={(e) => onChange({...data, ipPattern: e.target.value as any})} className={inputClasses}>
                  <option value="A">移転型 (パターンA: クライアントに帰属)</option>
                  <option value="B">許諾型 (パターンB: 受託者に留保し利用許諾)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. 成果物・修正詳細 & 撮影条件 */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div onClick={() => setActiveSection(activeSection === 'details' ? '' : 'details')} className={sectionHeaderClasses}>
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg transition-colors ${activeSection === 'details' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
              <FileOutput size={16} />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-slate-700">4. 成果物定義・修正上限</h3>
          </div>
          {activeSection === 'details' ? <ChevronDown size={16} className="text-slate-300" /> : <ChevronRight size={16} className="text-slate-300" />}
        </div>
        {activeSection === 'details' && (
          <div className="p-6 space-y-8 animate-in slide-in-from-top-1 duration-200">
            <div className={`grid ${isFullWidth ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>最終成果物 (HTML/PDF等)</label>
                  <textarea value={data.deliverables.final} onChange={(e) => onChange({...data, deliverables: {...data.deliverables, final: e.target.value}})} className={`${inputClasses} h-24 resize-none font-medium p-3`} placeholder="納品対象の最終的な形式を記述" />
                </div>
                <div>
                  <label className={labelClasses}>中間成果物 (カンプ/Figma等)</label>
                  <textarea value={data.deliverables.intermediate} onChange={(e) => onChange({...data, deliverables: {...data.deliverables, intermediate: e.target.value}})} className={`${inputClasses} h-20 resize-none font-medium p-3`} placeholder="確認用資料等の形式を記述" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={labelClasses}>デザイン修正上限</label>
                    <div className="relative">
                      <input type="number" value={data.revisions.design} onChange={(e) => onChange({...data, revisions: {...data.revisions, design: parseInt(e.target.value) || 0}})} className={inputClasses} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">ラウンド</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>実装修正上限</label>
                    <div className="relative">
                      <input type="number" value={data.revisions.coding} onChange={(e) => onChange({...data, revisions: {...data.revisions, coding: parseInt(e.target.value) || 0}})} className={inputClasses} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">回</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                   <div className="flex items-center justify-between">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        デザイン元データの納品
                     </label>
                     <button 
                        type="button"
                        onClick={() => onChange({...data, deliverables: {...data.deliverables, sourceData: !data.deliverables.sourceData}})} 
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${data.deliverables.sourceData ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}
                      >
                        {data.deliverables.sourceData ? '納品する' : '納品しない'}
                      </button>
                   </div>
                   {data.deliverables.sourceData && (
                     <input type="text" placeholder="形式 (例: .fig, .ai)" value={data.deliverables.sourceFormat} onChange={(e) => onChange({...data, deliverables: {...data.deliverables, sourceFormat: e.target.value}})} className={`${inputClasses} mt-3`} />
                   )}
                </div>
              </div>
            </div>

            {/* 撮影条件の統合 */}
            <div className="border-t border-slate-100 pt-8 space-y-6">
               <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 <Camera size={12} /> 撮影条件のカスタマイズ
               </h4>
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                 <span className={`${isFullWidth ? 'text-base' : 'text-sm'} font-bold text-slate-700`}>撮影業務の有無</span>
                 <button 
                    type="button"
                    onClick={() => onChange({...data, hasPhotography: !data.hasPhotography})} 
                    className={`px-6 py-2 rounded-full text-xs font-black transition-all shadow-sm ${data.hasPhotography ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}
                  >
                    {data.hasPhotography ? '撮影あり' : '撮影なし'}
                  </button>
               </div>

               {data.hasPhotography && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
                    <div className="flex flex-col">
                      <div className="min-h-[32px] flex items-end">
                        <label className={labelClasses}>撮影日数</label>
                      </div>
                      <input 
                        type="text" 
                        value={data.photoDetails.days} 
                        onChange={(e) => onChange({...data, photoDetails: {...data.photoDetails, days: e.target.value}})} 
                        className={inputClasses} 
                        placeholder="例: 1" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="min-h-[32px] flex items-end">
                        <label className={labelClasses}>拘束時間 (日当たり)</label>
                      </div>
                      <input 
                        type="text" 
                        value={data.photoDetails.hours} 
                        onChange={(e) => onChange({...data, photoDetails: {...data.photoDetails, hours: e.target.value}})} 
                        className={inputClasses} 
                        placeholder="例: 8" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="min-h-[32px] flex items-end">
                        <label className={labelClasses}>納品カット数</label>
                      </div>
                      <input 
                        type="text" 
                        value={data.photoDetails.cuts} 
                        onChange={(e) => onChange({...data, photoDetails: {...data.photoDetails, cuts: e.target.value}})} 
                        className={inputClasses} 
                        placeholder="例: 50" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClasses}>モデル・手配情報</label>
                      <input 
                        type="text" 
                        value={data.photoDetails.modelInfo} 
                        onChange={(e) => onChange({...data, photoDetails: {...data.photoDetails, modelInfo: e.target.value}})} 
                        className={inputClasses} 
                        placeholder="例: 委託者にて手配（社員様等）" 
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>肖像権処理の責任</label>
                      <select 
                        value={data.photoDetails.rightsHandling} 
                        onChange={(e) => onChange({...data, photoDetails: {...data.photoDetails, rightsHandling: e.target.value as any}})} 
                        className={inputClasses}
                      >
                        <option value="CLIENT">委託者（クライアント）</option>
                        <option value="PROVIDER">受託者（fren）</option>
                      </select>
                    </div>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>

      {/* 5. 見積明細 */}
      <div className="pt-6 space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest italic">5. 見積明細エディタ</h3>
          </div>
          <div className="relative">
            <button 
              type="button"
              onClick={() => setShowAddCat(!showAddCat)}
              className="flex items-center gap-2 text-[11px] font-bold bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-slate-800 transition shadow-lg active:scale-95"
            >
              <Plus size={16} />
              <span>大項目を新規追加</span>
            </button>
            {showAddCat && (
              <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[100] p-2 animate-in zoom-in-95 duration-150 border-t-4 border-t-indigo-500">
                <p className="text-[10px] font-black text-slate-400 px-3 py-2 uppercase tracking-tighter">カテゴリー・プリセット</p>
                {CATEGORY_PRESETS.map(preset => (
                  <button key={preset} type="button" onClick={() => addItemToCategory(preset)} className="w-full text-left px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition">{preset}</button>
                ))}
                <div className="border-t border-slate-100 mt-2 pt-2">
                   <button 
                    type="button"
                    onClick={() => {
                      const custom = prompt("カテゴリー名を入力してください");
                      if(custom) addItemToCategory(custom);
                    }}
                    className="w-full text-left px-3 py-2.5 text-xs font-black text-indigo-600 hover:bg-indigo-50 rounded-xl transition flex items-center gap-2"
                  >
                    <Edit3 size={14} /> 自由入力で追加
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {currentCategories.map((cat) => (
            <div key={cat} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
              <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-lg"><Layers size={16} className="text-white" /></div>
                  <h4 className="font-bold text-white text-sm tracking-tight">{cat}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => addItemToCategory(cat)} 
                    className="flex items-center gap-2 text-[10px] font-bold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    <Plus size={14} /> 行を追加
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => removeCategory(e, cat)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-tight border-b border-slate-200">
                      <th className="px-4 py-3 w-[180px]">契約区分</th>
                      <th className="px-4 py-3 w-[200px]">項目名</th>
                      <th className="px-4 py-3">仕様詳細 (自動改行)</th>
                      <th className="px-4 py-3 w-[140px] text-right">単価</th>
                      <th className="px-4 py-3 w-[100px] text-center">数量</th>
                      <th className="px-2 py-3 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {groupedItems[cat].map(item => (
                      <tr key={item.id} className="hover:bg-indigo-50/30 group/row transition-colors align-top">
                        <td className="p-1">
                          <select 
                            value={item.subCategory} 
                            onChange={(e) => updateItem(item.id, 'subCategory', e.target.value)} 
                            className={`${cellInputClasses} text-indigo-600 font-black`}
                          >
                            <option value="">未選択</option>
                            <option value="請負型業務">請負型 (成果物)</option>
                            <option value="準委任型業務">準委任型 (稼働)</option>
                          </select>
                        </td>
                        <td className="p-1">
                          <input 
                            type="text" 
                            value={item.name} 
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)} 
                            className={cellInputClasses} 
                            placeholder="名称を入力" 
                          />
                        </td>
                        <td className="p-1">
                          <textarea 
                            value={item.details} 
                            onChange={(e) => updateItem(item.id, 'details', e.target.value)} 
                            className={`${cellInputClasses} min-h-[40px] resize-none overflow-hidden h-auto leading-relaxed font-normal text-slate-600`} 
                            placeholder="仕様詳細"
                            rows={1}
                            onInput={(e) => {
                              const target = e.target as HTMLTextAreaElement;
                              target.style.height = 'auto';
                              target.style.height = target.scrollHeight + 'px';
                            }}
                          />
                        </td>
                        <td className="p-1">
                          <input 
                            type="number" 
                            value={item.unitPrice} 
                            onChange={(e) => updateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)} 
                            className={`${cellInputClasses} text-right font-mono`} 
                          />
                        </td>
                        <td className="p-1">
                          <input 
                            type="number" 
                            step="0.1" 
                            value={item.quantity} 
                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} 
                            className={`${cellInputClasses} text-center font-mono`} 
                          />
                        </td>
                        <td className="p-1 text-center">
                          <button 
                            type="button"
                            onClick={() => removeItem(item.id)} 
                            className="text-slate-200 hover:text-red-500 transition-all opacity-0 group-hover/row:opacity-100 mt-2"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* 6. お値引き・備考 */}
        <div className={`mt-10 grid ${isFullWidth ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
          <div className="bg-slate-900 p-6 rounded-2xl flex flex-col justify-center shadow-xl border border-slate-800">
            <div className="flex items-center gap-4 mb-4">
               <div className="bg-red-500/20 text-red-500 p-3 rounded-xl shadow-inner"><CheckCircle2 size={24} /></div>
               <div>
                 <span className="text-white font-black text-xs uppercase tracking-widest block opacity-70">DISCOUNT ADJUSTMENT</span>
                 <span className="text-white text-lg font-black">出精お値引き（税別）</span>
               </div>
            </div>
            <div className="relative">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 font-black text-2xl italic">¥</span>
               <input type="number" value={data.discount} onChange={(e) => onChange({ ...data, discount: parseInt(e.target.value) || 0 })} className="w-full bg-white/10 border-2 border-white/20 rounded-xl pl-12 pr-4 py-4 text-3xl text-right font-black text-white focus:ring-4 focus:ring-red-500/40 outline-none transition-all" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <Edit3 size={14} /> 特記事項 / 個別備考
               </label>
               <button 
                  type="button"
                  onClick={() => onChange({...data, hasNotes: !data.hasNotes})} 
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all shadow-sm ${data.hasNotes ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                >
                  {data.hasNotes ? '書類に表示中' : '非表示'}
                </button>
             </div>
             {data.hasNotes && (
               <textarea 
                value={data.notes} 
                onChange={(e) => onChange({...data, notes: e.target.value})} 
                className={`${inputClasses} h-32 resize-none font-medium leading-relaxed p-4`} 
                placeholder="基本契約書や見積書の末尾に記載する追加の条件や特約事項を入力してください。"
              />
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;
