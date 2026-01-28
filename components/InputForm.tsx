
import React, { useState, useMemo } from 'react';
import { 
  Plus, Trash2, Building2, User, FileText, Calendar, 
  Settings, Layers, CheckCircle2, ShieldCheck, 
  FileOutput, ChevronDown, ChevronRight, Edit3,
  HelpCircle, Camera, MousePointer2
} from 'lucide-react';
import { EstimateData, EstimateItem, ContractType, ProviderInfo, QuasiPattern } from '../types';

interface InputFormProps {
  data: EstimateData;
  onChange: (data: EstimateData) => void;
  isFullWidth?: boolean;
  onSectionFocus?: (sectionId: string | null) => void;
}

const CATEGORY_PRESETS = [
  "ブランド構築費用",
  "ブランドサイト制作費用",
  "全体ディレクション費用",
  "撮影・編集費用",
  "実費・その他"
];

const InputForm: React.FC<InputFormProps> = ({ data, onChange, isFullWidth = false, onSectionFocus }) => {
  const [showAddCat, setShowAddCat] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('basic');

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
      quasiPatterns: { ...data.quasiPatterns, [type]: { ...data.quasiPatterns[type], [field]: value } }
    });
  };

  const updateRevisions = (key: keyof typeof data.revisions, value: any) => {
    onChange({ ...data, revisions: { ...data.revisions, [key]: value } });
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
    e.preventDefault(); e.stopPropagation();
    if (window.confirm(`「${categoryName}」の全項目を削除しますか？`)) {
      const targetCat = categoryName.trim();
      onChange({ ...data, items: data.items.filter(item => (item.category || "未分類").trim() !== targetCat) });
    }
  };

  const updateItem = (id: string, field: keyof EstimateItem, value: any) => {
    const updatedItems = data.items.map(item => item.id === id ? { ...item, [field]: value } : item);
    onChange({ ...data, items: updatedItems });
  };

  const Tooltip = ({ text }: { text: string }) => (
    <div className="group relative inline-block ml-1 cursor-help align-middle">
      <HelpCircle size={12} className="text-slate-300 hover:text-indigo-500 transition-colors" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 leading-relaxed font-normal normal-case tracking-normal">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
      </div>
    </div>
  );

  const inputClasses = `w-full bg-white border border-slate-200 rounded-lg px-3 py-2 ${isFullWidth ? 'text-base' : 'text-sm'} text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-sm placeholder:text-slate-300`;
  const labelClasses = `flex items-center ${isFullWidth ? 'text-xs' : 'text-[10px]'} font-bold text-slate-400 uppercase mb-1 tracking-widest`;
  const cellInputClasses = `w-full border-b border-transparent hover:border-slate-200 focus:border-indigo-500 px-1 py-1.5 ${isFullWidth ? 'text-sm' : 'text-[12px]'} font-bold text-slate-900 bg-transparent outline-none transition`;
  const sectionHeaderClasses = "flex items-center justify-between w-full p-4 hover:bg-slate-50 transition border-b border-slate-100 cursor-pointer select-none group";

  return (
    <div className={`space-y-6 ${isFullWidth ? 'max-w-none' : 'max-w-4xl mx-auto'}`}>
      
      {/* 1. 基本設定 */}
      <div className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${activeSection === 'basic' ? 'ring-2 ring-slate-900 border-transparent' : 'border-slate-200'}`}>
        <div onClick={() => setActiveSection(activeSection === 'basic' ? '' : 'basic')} className={sectionHeaderClasses}>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black bg-slate-100 text-slate-400 w-5 h-5 flex items-center justify-center rounded-full">1</span>
            <div className={`p-1.5 rounded-lg transition-colors ${activeSection === 'basic' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
              <Settings size={16} />
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-700">STEP 1: プロジェクト基本設定</h3>
              <p className="text-[9px] text-slate-400 font-medium tracking-normal mt-0.5">宛先や自社情報、書類の基本情報を入力します。</p>
            </div>
          </div>
          {activeSection === 'basic' ? <ChevronDown size={16} className="text-slate-300" /> : <ChevronRight size={16} className="text-slate-300" />}
        </div>
        {activeSection === 'basic' && (
          <div className="p-6 space-y-8 animate-in slide-in-from-top-1 duration-200">
            <div className={`grid ${isFullWidth ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
              <div onFocus={() => onSectionFocus?.('header')}>
                <label className={labelClasses}>プロジェクト名</label>
                <input type="text" value={data.client.projectName} onChange={(e) => updateClient('projectName', e.target.value)} className={inputClasses} placeholder="例: ブランドサイト制作・運用" />
              </div>
              <div onFocus={() => onSectionFocus?.('header')}>
                <label className={labelClasses}>管理番号<Tooltip text="見積書と個別契約書の共通管理番号として使われます。日付ベースを推奨しています。" /></label>
                <input type="text" value={data.estimateNumber} onChange={(e) => onChange({...data, estimateNumber: e.target.value})} className={inputClasses} placeholder="20250401-01" />
              </div>
              <div className="grid grid-cols-2 gap-3" onFocus={() => onSectionFocus?.('header')}>
                <div>
                  <label className={labelClasses}>書類作成日</label>
                  <input type="date" value={data.documentDate} onChange={(e) => onChange({...data, documentDate: e.target.value})} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>見積有効期限</label>
                  <input type="text" value={data.estimateValidity} onChange={(e) => onChange({...data, estimateValidity: e.target.value})} className={inputClasses} placeholder="例: 発行より2週間" />
                </div>
              </div>
            </div>

            <div className={`grid ${isFullWidth ? 'grid-cols-2' : 'grid-cols-1'} gap-6 border-t border-slate-100 pt-8`}>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-4" onFocus={() => onSectionFocus?.('signature')}>
                <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  <Building2 size={12} /> 受託者（自社）情報
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className={labelClasses}>社名</label>
                    <input type="text" value={data.provider.companyName} onChange={(e) => updateProvider('companyName', e.target.value)} className={inputClasses} />
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <label className={labelClasses}>郵便番号</label>
                      <input type="text" value={data.provider.zipCode} onChange={(e) => updateProvider('zipCode', e.target.value)} className={inputClasses} />
                    </div>
                    <div className="col-span-8">
                      <label className={labelClasses}>住所</label>
                      <input type="text" value={data.provider.address} onChange={(e) => updateProvider('address', e.target.value)} className={inputClasses} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className={labelClasses}>代表者名</label><input type="text" value={data.provider.representative} onChange={(e) => updateProvider('representative', e.target.value)} className={inputClasses} /></div>
                    <div><label className={labelClasses}>担当者名</label><input type="text" value={data.provider.personInCharge} onChange={(e) => updateProvider('personInCharge', e.target.value)} className={inputClasses} /></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 md:pt-0" onFocus={() => onSectionFocus?.('signature')}>
                <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  <User size={12} /> 委託者（クライアント）情報
                </h4>
                <div className="space-y-3">
                  <div><label className={labelClasses}>企業名</label><input type="text" placeholder="株式会社サンプル" value={data.client.companyName} onChange={(e) => updateClient('companyName', e.target.value)} className={inputClasses} /></div>
                  <div><label className={labelClasses}>住所</label><input type="text" placeholder="東京都港区赤坂..." value={data.client.address} onChange={(e) => updateClient('address', e.target.value)} className={inputClasses} /></div>
                  <div><label className={labelClasses}>代表者名・役職</label><input type="text" placeholder="代表取締役 鈴木一郎 様" value={data.client.representative} onChange={(e) => updateClient('representative', e.target.value)} className={inputClasses} /></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. 契約形態 */}
      <div className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${activeSection === 'contract' ? 'ring-2 ring-indigo-600 border-transparent' : 'border-slate-200'}`}>
        <div onClick={() => setActiveSection(activeSection === 'contract' ? '' : 'contract')} className={sectionHeaderClasses}>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black bg-slate-100 text-slate-400 w-5 h-5 flex items-center justify-center rounded-full">2</span>
            <div className={`p-1.5 rounded-lg transition-colors ${activeSection === 'contract' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
              <ShieldCheck size={16} />
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-700">STEP 2: 契約形態・パターン設定</h3>
              <p className="text-[9px] text-slate-400 font-medium tracking-normal mt-0.5">請負・準委任の区分や、稼働のルールを選択します。</p>
            </div>
          </div>
          {activeSection === 'contract' ? <ChevronDown size={16} className="text-slate-300" /> : <ChevronRight size={16} className="text-slate-300" />}
        </div>
        {activeSection === 'contract' && (
          <div className="p-6 space-y-6 animate-in slide-in-from-top-1 duration-200">
            <div className={isFullWidth ? 'max-w-md' : ''} onFocus={() => onSectionFocus?.('type')}>
              <label className={labelClasses}>業務区分<Tooltip text="成果物の完成に責任を負う場合は『請負』、稼働時間に責任を負う場合は『準委任』を選択します。" /></label>
              <select value={data.contractType} onChange={(e) => onChange({ ...data, contractType: e.target.value as ContractType })} className={inputClasses}>
                <option value="FIXED">請負型（成果物の納品を目的とする）</option>
                <option value="QUASI">準委任型（善管注意義務をもって事務を処理する）</option>
                <option value="HYBRID">混合 (請負と準委任の両方を含む)</option>
              </select>
            </div>

            <div className="space-y-4" onFocus={() => onSectionFocus?.('quasi')}>
              <label className={labelClasses}>準委任の詳細設定<Tooltip text="個別契約書の第5条に反映されます。案件の稼働スタイルに合わせて調整してください。" /></label>
              <div className={`grid ${isFullWidth ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                {(['A', 'B', 'C', 'D'] as const).map((type) => (
                  <div key={type} className={`p-4 rounded-xl border-2 transition-all ${data.quasiPatterns.selected === type ? 'border-indigo-600 bg-indigo-50/30 shadow-md' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <input type="radio" name="quasi-select" checked={data.quasiPatterns.selected === type} onChange={() => onChange({ ...data, quasiPatterns: { ...data.quasiPatterns, selected: type } })} className="w-5 h-5 accent-indigo-600" />
                      <input type="text" value={data.quasiPatterns[type].name} onChange={(e) => updateQuasiPattern(type, 'name', e.target.value)} className="bg-transparent border-b border-slate-300 font-bold text-sm outline-none focus:border-indigo-400 px-1 w-full" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1"><span className="text-[9px] text-slate-400 font-bold block">単価</span><input type="text" value={data.quasiPatterns[type].price} onChange={(e) => updateQuasiPattern(type, 'price', e.target.value)} className="text-[11px] p-2 rounded bg-white border border-slate-200 font-bold w-full" /></div>
                      <div className="space-y-1"><span className="text-[9px] text-slate-400 font-bold block">条件</span><input type="text" value={data.quasiPatterns[type].condition} onChange={(e) => updateQuasiPattern(type, 'condition', e.target.value)} className="text-[11px] p-2 rounded bg-white border border-slate-200 font-bold w-full" /></div>
                      <div className="space-y-1"><span className="text-[9px] text-slate-400 font-bold block">超過精算</span><input type="text" value={data.quasiPatterns[type].overtime} onChange={(e) => updateQuasiPattern(type, 'overtime', e.target.value)} className="text-[11px] p-2 rounded bg-white border border-slate-200 font-bold w-full" /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. 期間・支払 */}
      <div className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${activeSection === 'terms' ? 'ring-2 ring-blue-600 border-transparent' : 'border-slate-200'}`}>
        <div onClick={() => setActiveSection(activeSection === 'terms' ? '' : 'terms')} className={sectionHeaderClasses}>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black bg-slate-100 text-slate-400 w-5 h-5 flex items-center justify-center rounded-full">3</span>
            <div className={`p-1.5 rounded-lg transition-colors ${activeSection === 'terms' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
              <Calendar size={16} />
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-700">STEP 3: 期間・支払・著作権</h3>
              <p className="text-[9px] text-slate-400 font-medium tracking-normal mt-0.5">納期や支払方法、著作権の扱いを決定します。</p>
            </div>
          </div>
          {activeSection === 'terms' ? <ChevronDown size={16} className="text-slate-300" /> : <ChevronRight size={16} className="text-slate-300" />}
        </div>
        {activeSection === 'terms' && (
          <div className="p-6 space-y-8 animate-in slide-in-from-top-1 duration-200">
            <div className={`grid ${isFullWidth ? 'grid-cols-4' : 'grid-cols-2'} gap-4`} onFocus={() => onSectionFocus?.('schedule')}>
              <div><label className={labelClasses}>契約締結日</label><input type="date" value={data.contractDate} onChange={(e) => onChange({...data, contractDate: e.target.value})} className={inputClasses} /></div>
              <div><label className={labelClasses}>最終納期</label><input type="date" value={data.deliveryDate} onChange={(e) => onChange({...data, deliveryDate: e.target.value})} className={inputClasses} /></div>
              <div><label className={labelClasses}>作業開始日</label><input type="date" value={data.workStartDate} onChange={(e) => onChange({...data, workStartDate: e.target.value})} className={inputClasses} /></div>
              <div><label className={labelClasses}>作業終了日</label><input type="date" value={data.workEndDate} onChange={(e) => onChange({...data, workEndDate: e.target.value})} className={inputClasses} /></div>
            </div>

            <div className={`grid ${isFullWidth ? 'grid-cols-3' : 'grid-cols-1'} gap-6 border-t border-slate-100 pt-8`}>
              <div onFocus={() => onSectionFocus?.('payment')}>
                <label className={labelClasses}>支払方法<Tooltip text="『分割』を選択すると、着手時と完了時に分けて請求する条項に自動で切り替わります。" /></label>
                <select value={data.paymentType} onChange={(e) => onChange({...data, paymentType: e.target.value as any})} className={inputClasses}>
                  <option value="SINGLE">一括払い (納品翌月末)</option>
                  <option value="MILESTONE">分割払い (着手50% / 完了50%)</option>
                </select>
              </div>
              <div onFocus={() => onSectionFocus?.('payment')}>
                <label className={labelClasses}>税率 (%) <Tooltip text="消費税率を指定します。デフォルトは10%です。" /></label>
                <div className="relative">
                  <input type="number" value={data.taxRate} onChange={(e) => onChange({...data, taxRate: parseInt(e.target.value) || 0})} className={inputClasses} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">%</span>
                </div>
              </div>
              <div onFocus={() => onSectionFocus?.('rights')}>
                <label className={labelClasses}>著作権の取扱い<Tooltip text="通常は『移転型』を選びます。『許諾型』は権利を受託者が持ち、利用のみ認める形式です。" /></label>
                <select value={data.ipPattern} onChange={(e) => onChange({...data, ipPattern: e.target.value as any})} className={inputClasses}>
                  <option value="A">移転型 (パターンA: 権利をクライアントへ譲渡)</option>
                  <option value="B">許諾型 (パターンB: 権利を受託者が保持し、利用を許諾)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. 成果物・修正詳細 & 撮影条件 */}
      <div className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${activeSection === 'details' ? 'ring-2 ring-emerald-600 border-transparent' : 'border-slate-200'}`}>
        <div onClick={() => setActiveSection(activeSection === 'details' ? '' : 'details')} className={sectionHeaderClasses}>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black bg-slate-100 text-slate-400 w-5 h-5 flex items-center justify-center rounded-full">4</span>
            <div className={`p-1.5 rounded-lg transition-colors ${activeSection === 'details' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
              <FileOutput size={16} />
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-700">STEP 4: 成果物定義・修正上限</h3>
              <p className="text-[9px] text-slate-400 font-medium tracking-normal mt-0.5">何を納品し、何回まで修正を無償で受けるかを定義します。</p>
            </div>
          </div>
          {activeSection === 'details' ? <ChevronDown size={16} className="text-slate-300" /> : <ChevronRight size={16} className="text-slate-300" />}
        </div>
        {activeSection === 'details' && (
          <div className="p-6 space-y-8 animate-in slide-in-from-top-1 duration-200">
            <div className={`grid ${isFullWidth ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
              <div className="space-y-4" onFocus={() => onSectionFocus?.('deliverables')}>
                <div><label className={labelClasses}>最終成果物 (納品形式)</label><textarea value={data.deliverables.final} onChange={(e) => onChange({...data, deliverables: {...data.deliverables, final: e.target.value}})} className={`${inputClasses} h-24 resize-none p-3`} placeholder="例: HTML/CSS/JS一式、PDF形式の提案資料" /></div>
                <div><label className={labelClasses}>中間成果物 (確認資料)</label><textarea value={data.deliverables.intermediate} onChange={(e) => onChange({...data, deliverables: {...data.deliverables, intermediate: e.target.value}})} className={`${inputClasses} h-20 resize-none p-3`} placeholder="例: ワイヤーフレーム、デザインカンプ（画像）" /></div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4" onFocus={() => onSectionFocus?.('revisions')}>
                  <div className="space-y-1"><label className={labelClasses}>デザイン修正上限</label><div className="relative"><input type="number" value={data.revisions.design} onChange={(e) => updateRevisions('design', parseInt(e.target.value) || 0)} className={inputClasses} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">回</span></div></div>
                  <div className="space-y-1"><label className={labelClasses}>実装修正上限</label><div className="relative"><input type="number" value={data.revisions.coding} onChange={(e) => updateRevisions('coding', parseInt(e.target.value) || 0)} className={inputClasses} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">回</span></div></div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl" onFocus={() => onSectionFocus?.('deliverables')}>
                   <div className="flex items-center justify-between"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">デザイン元データの納品</label><button type="button" onClick={() => onChange({...data, deliverables: {...data.deliverables, sourceData: !data.deliverables.sourceData}})} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${data.deliverables.sourceData ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{data.deliverables.sourceData ? '納品する' : '納品しない'}</button></div>
                   {data.deliverables.sourceData && <input type="text" placeholder="形式 (例: .fig, .ai)" value={data.deliverables.sourceFormat} onChange={(e) => onChange({...data, deliverables: {...data.deliverables, sourceFormat: e.target.value}})} className={`${inputClasses} mt-3`} />}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-8 space-y-6" onFocus={() => onSectionFocus?.('photography')}>
               <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><Camera size={12} /> 撮影条件のオプション</h4>
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"><span className={`${isFullWidth ? 'text-base' : 'text-sm'} font-bold text-slate-700`}>撮影業務の有無</span><button type="button" onClick={() => onChange({...data, hasPhotography: !data.hasPhotography})} className={`px-6 py-2 rounded-full text-xs font-black transition-all shadow-sm ${data.hasPhotography ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-500'}`}>{data.hasPhotography ? '撮影あり' : '撮影なし'}</button></div>
               {data.hasPhotography && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
                    <div><label className={labelClasses}>撮影日数</label><input type="text" value={data.photoDetails.days} onChange={(e) => onChange({...data, photoDetails: {...data.photoDetails, days: e.target.value}})} className={inputClasses} placeholder="1" /></div>
                    <div><label className={labelClasses}>1日あたりの拘束時間</label><input type="text" value={data.photoDetails.hours} onChange={(e) => onChange({...data, photoDetails: {...data.photoDetails, hours: e.target.value}})} className={inputClasses} placeholder="8" /></div>
                    <div><label className={labelClasses}>納品予定カット数</label><input type="text" value={data.photoDetails.cuts} onChange={(e) => onChange({...data, photoDetails: {...data.photoDetails, cuts: e.target.value}})} className={inputClasses} placeholder="50" /></div>
                    <div className="md:col-span-2"><label className={labelClasses}>モデル・手配に関する詳細</label><input type="text" value={data.photoDetails.modelInfo} onChange={(e) => onChange({...data, photoDetails: {...data.photoDetails, modelInfo: e.target.value}})} className={inputClasses} placeholder="例: クライアントにて手配" /></div>
                    <div><label className={labelClasses}>肖像権処理の責任</label><select value={data.photoDetails.rightsHandling} onChange={(e) => onChange({...data, photoDetails: {...data.photoDetails, rightsHandling: e.target.value as any}})} className={inputClasses}><option value="CLIENT">クライアント責任</option><option value="PROVIDER">受託者 (fren) 責任</option></select></div>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>

      {/* 5. 見積明細 */}
      <div className="pt-6 space-y-6" onFocus={() => onSectionFocus?.('items')}>
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black bg-slate-900 text-white w-5 h-5 flex items-center justify-center rounded-full">5</span>
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest italic">STEP 5: 見積明細エディタ</h3>
          </div>
          <div className="relative">
            <button type="button" onClick={() => setShowAddCat(!showAddCat)} className="flex items-center gap-2 text-[11px] font-bold bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-slate-800 transition shadow-lg active:scale-95"><Plus size={16} /><span>カテゴリーを追加</span></button>
            {showAddCat && (
              <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[100] p-2 animate-in zoom-in-95 duration-150 border-t-4 border-t-indigo-500">
                <p className="text-[10px] font-black text-slate-400 px-3 py-2 uppercase tracking-tighter">おすすめのカテゴリー</p>
                {CATEGORY_PRESETS.map(preset => <button key={preset} type="button" onClick={() => addItemToCategory(preset)} className="w-full text-left px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition">{preset}</button>)}
                <button type="button" onClick={() => { const custom = prompt("カテゴリー名を入力してください"); if(custom) addItemToCategory(custom); }} className="w-full text-left px-3 py-2.5 text-xs font-black text-indigo-600 hover:bg-indigo-50 rounded-xl transition mt-2 pt-2 border-t border-slate-100 flex items-center gap-2"><Edit3 size={14} /> 自由な名前で追加</button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {currentCategories.map((cat) => (
            <div key={cat} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="bg-slate-900 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3"><Layers size={16} className="text-white" /><h4 className="font-bold text-white text-sm">{cat}</h4></div>
                <div className="flex items-center gap-2"><button type="button" onClick={() => addItemToCategory(cat)} className="flex items-center gap-2 text-[10px] font-bold bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition"><Plus size={14} /> 項目を追加</button><button type="button" onClick={(e) => removeCategory(e, cat)} className="p-2 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button></div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead><tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200"><th className="px-4 py-3 w-[180px]">区分<Tooltip text="契約書の第1条（請負か準委任か）に連動して反映されます。" /></th><th className="px-4 py-3 w-[200px]">項目名</th><th className="px-4 py-3">仕様詳細</th><th className="px-4 py-3 w-[140px] text-right">単価</th><th className="px-4 py-3 w-[100px] text-center">数量</th><th className="px-2 py-3 w-12"></th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {groupedItems[cat].map(item => (
                      <tr key={item.id} className="hover:bg-indigo-50/30 group/row align-top">
                        <td className="p-1"><select value={item.subCategory} onChange={(e) => updateItem(item.id, 'subCategory', e.target.value)} className={`${cellInputClasses} text-indigo-600 font-black`}><option value="">未選択</option><option value="請負型業務">請負型 (制作)</option><option value="準委任型業務">準委任型 (PM等)</option></select></td>
                        <td className="p-1"><input type="text" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} className={cellInputClasses} placeholder="名称を入力" /></td>
                        <td className="p-1"><textarea value={item.details} onChange={(e) => updateItem(item.id, 'details', e.target.value)} className={`${cellInputClasses} min-h-[40px] leading-relaxed font-normal text-slate-600`} placeholder="仕様・前提条件など" rows={1} /></td>
                        <td className="p-1"><input type="number" value={item.unitPrice} onChange={(e) => updateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)} className={`${cellInputClasses} text-right font-mono`} /></td>
                        <td className="p-1"><input type="number" step="0.1" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} className={`${cellInputClasses} text-center font-mono`} /></td>
                        <td className="p-1 text-center"><button type="button" onClick={() => removeItem(item.id)} className="text-slate-200 hover:text-red-500 transition-all opacity-0 group-hover/row:opacity-100 mt-2"><Trash2 size={14} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-10 grid ${isFullWidth ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
          <div className="bg-slate-900 p-6 rounded-2xl flex flex-col justify-center shadow-xl border border-slate-800" onFocus={() => onSectionFocus?.('discount')}>
            <div className="flex items-center gap-4 mb-4"><div className="bg-red-500/20 text-red-500 p-3 rounded-xl"><CheckCircle2 size={24} /></div><div><span className="text-white font-black text-xs uppercase tracking-widest block opacity-70">ADJUSTMENT</span><span className="text-white text-lg font-black">出精お値引き（税別）</span></div></div>
            <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 font-black text-2xl italic">¥</span><input type="number" value={data.discount} onChange={(e) => onChange({ ...data, discount: parseInt(e.target.value) || 0 })} className="w-full bg-white/10 border-2 border-white/20 rounded-xl pl-12 pr-4 py-4 text-3xl text-right font-black text-white focus:ring-4 focus:ring-red-500/40 outline-none transition-all" /></div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" onFocus={() => onSectionFocus?.('notes')}>
             <div className="flex items-center justify-between mb-4"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Edit3 size={14} /> 特記事項 / 個別備考</label><button type="button" onClick={() => onChange({...data, hasNotes: !data.hasNotes})} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all shadow-sm ${data.hasNotes ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>{data.hasNotes ? '表示中' : '非表示'}</button></div>
             {data.hasNotes && <textarea value={data.notes} onChange={(e) => onChange({...data, notes: e.target.value})} className={`${inputClasses} h-32 resize-none font-medium leading-relaxed p-4`} placeholder="特別な契約条件や備考があれば入力してください。" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;
