import React from 'react';
import { EstimateData, EstimateItem } from '../../types';

interface EstimateSheetProps {
  data: EstimateData;
}

const EstimateSheet: React.FC<EstimateSheetProps> = ({ data }) => {
  const subtotal = data.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const totalTaxExclusive = subtotal - data.discount;
  const tax = Math.floor(totalTaxExclusive * 0.1);
  const totalTaxInclusive = totalTaxExclusive + tax;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const groupedItems = data.items.reduce((acc, item) => {
    const cat = item.category || 'その他';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, EstimateItem[]>);

  // 特記事項の動的生成
  const getDynamicNotes = () => {
    const notes = [];
    if (data.contractType === 'FIXED') notes.push({ title: "業務区分", content: "本件は「請負型業務」となります。" });
    else if (data.contractType === 'QUASI') notes.push({ title: "業務区分", content: "本件は「準委任型業務」となります。" });
    else notes.push({ title: "業務区分", content: "本件は「請負型業務」と「準委任型業務」を組み合わせたハイブリッド形式となります。" });

    notes.push({ title: "成果物", content: data.deliverables.sourceData ? "デザイン元データの納品を含みます。" : "デザイン元データの納品は含まず、最終成果物のみの納品となります。" });
    notes.push({ title: "支払条件", content: data.paymentType === 'MILESTONE' ? "着手時50% / 完了時50%の分割払いにてお願い申し上げます。" : "検収完了月の翌月末一括払いにてお願い申し上げます。" });
    
    if (data.hasNotes && data.notes) notes.push({ title: "その他", content: data.notes });
    return notes;
  };

  const dynamicNotes = getDynamicNotes();
  const pageClass = "a4-container serif-font shadow-lg print:shadow-none text-slate-900 min-h-[297mm] mb-10 print:mb-0 flex flex-col pt-[20mm] pb-[20mm] px-[25mm]";
  const tableThClass = "bg-slate-50 border border-slate-900 p-2 text-[9pt] font-bold text-center font-sans uppercase tracking-wider";
  const tableTdClass = "border border-slate-900 p-2 text-[9pt]";

  return (
    <div className="flex flex-col items-center">
      {/* ページ1: 御見積書サマリー */}
      <div className={pageClass}>
        <h1 className="text-3xl font-bold border-b-4 border-double border-slate-900 pb-2 text-center tracking-[0.5em] font-sans mb-12">御 見 積 書</h1>
        <div className="flex justify-between items-start mb-10">
          <div className="w-[60%]">
            <div className="border-b-2 border-slate-900 pb-2 mb-4">
              <span className="text-2xl font-bold">{data.client.companyName || '（企業名未入力）'} 御中</span>
            </div>
            <div className="space-y-1 text-sm">
              <p>案件名：<span className="font-bold underline">{data.client.projectName}</span></p>
              <p>見積番号：<span className="font-bold">{data.estimateNumber}</span></p>
              <p>御見積日：{formatDate(data.documentDate)}</p>
              <p>有効期限：{data.estimateValidity}</p>
            </div>
          </div>
          <div className="w-[35%] text-right text-xs relative space-y-1">
            <p className="text-lg font-bold font-sans">{data.provider.companyName}</p>
            <p>〒{data.provider.zipCode}</p>
            <p>{data.provider.address}</p>
            {data.provider.building && <p>{data.provider.building}</p>}
            <p>TEL：{data.provider.tel}</p>
            <p className="mt-2 font-bold">担当：{data.provider.personInCharge}</p>
            <div className="mt-4 flex justify-end">
              <div className="w-14 h-14 border border-slate-300 text-slate-200 flex items-center justify-center text-[10px] rounded pointer-events-none select-none">角印</div>
            </div>
          </div>
        </div>

        <div className="border-2 border-slate-900 p-6 mb-10 text-center bg-slate-50 flex items-center justify-center gap-12">
          <span className="text-lg font-bold tracking-widest text-slate-700">御見積合計金額（税込）</span>
          <span className="text-4xl font-bold font-sans">¥ {totalTaxInclusive.toLocaleString()} -</span>
        </div>

        <h3 className="font-bold border-l-4 border-slate-900 pl-2 mb-3 text-xs font-sans uppercase">■ 御見積概要</h3>
        <table className="w-full border-collapse mb-8 border border-slate-900">
          <thead>
            <tr>
              <th className={tableThClass} style={{ width: '40%' }}>大項目</th>
              <th className={tableThClass} style={{ width: '30%' }}>内訳</th>
              <th className={tableThClass} style={{ width: '10%' }}>数量</th>
              <th className={tableThClass} style={{ width: '20%' }}>金額（税別）</th>
            </tr>
          </thead>
          <tbody>
            {(Object.entries(groupedItems) as [string, EstimateItem[]][]).map(([cat, items]) => {
              const catTotal = items.reduce((s, i) => s + (i.unitPrice * i.quantity), 0);
              return (
                <tr key={cat}>
                  <td className={tableTdClass}><strong>{cat}</strong></td>
                  <td className={tableTdClass + " text-slate-500 font-sans"}>{items.length} 項目</td>
                  <td className={tableTdClass + " text-center font-sans"}>1式</td>
                  <td className={tableTdClass + " text-right font-sans"}>¥ {catTotal.toLocaleString()}</td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={3} className={tableTdClass + " text-right bg-slate-50 font-bold"}>小計（税別）</td>
              <td className={tableTdClass + " text-right font-bold font-sans"}>¥ {subtotal.toLocaleString()}</td>
            </tr>
            {data.discount > 0 && (
              <tr>
                <td colSpan={3} className={tableTdClass + " text-right bg-slate-50 text-red-600 font-bold"}>出精お値引き</td>
                <td className={tableTdClass + " text-right text-red-600 font-bold font-sans"}>- ¥ {data.discount.toLocaleString()}</td>
              </tr>
            )}
            <tr className="bg-slate-100 font-bold border-t-2 border-slate-900">
              <td colSpan={3} className={tableTdClass + " text-right text-[11pt]"}>合計（税込）</td>
              <td className={tableTdClass + " text-right text-[11pt] font-sans"}>¥ {totalTaxInclusive.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div className="border border-slate-900 p-4 text-[9pt] space-y-2 text-slate-700 font-sans mt-auto">
          <p className="font-bold border-b border-slate-900 pb-1 text-slate-900 text-[10pt] mb-2">【特記事項】</p>
          {dynamicNotes.map((note, index) => (
            <p key={index}>{index + 1}. <strong>{note.title}：</strong>{note.content}</p>
          ))}
        </div>
        <div className="text-center text-[8pt] text-slate-400 mt-4">- 1 -</div>
      </div>

      {/* ページ2: 詳細御見積明細書 */}
      <div className={pageClass}>
        <h2 className="text-[16pt] font-bold border-l-8 border-slate-900 pl-4 mb-8 font-sans">詳細御見積明細書</h2>
        {(Object.entries(groupedItems) as [string, EstimateItem[]][]).map(([cat, items], catIdx) => (
          <div key={cat} className="mb-10">
            <h3 className="text-[11pt] font-bold mb-3 border-b-2 border-slate-400 pb-1">{catIdx + 1}. {cat}</h3>
            <table className="w-full border-collapse border border-slate-900">
              <thead className="bg-slate-50 font-sans">
                <tr>
                  <th className={tableThClass} style={{ width: '25%' }}>項目</th>
                  <th className={tableThClass}>仕様詳細</th>
                  <th className={tableThClass} style={{ width: '15%' }}>単価</th>
                  <th className={tableThClass} style={{ width: '10%' }}>数量</th>
                  <th className={tableThClass} style={{ width: '15%' }}>金額</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className={tableTdClass}>
                      <strong>{item.name}</strong>
                      {item.subCategory && <div className="text-[7pt] text-slate-400 font-sans mt-0.5">{item.subCategory}</div>}
                    </td>
                    <td className={tableTdClass + " text-slate-600 leading-snug"}>{item.details}</td>
                    <td className={tableTdClass + " text-right font-sans"}>¥ {item.unitPrice.toLocaleString()}</td>
                    <td className={tableTdClass + " text-center font-sans"}>{item.quantity}{item.unit}</td>
                    <td className={tableTdClass + " text-right font-bold font-sans"}>¥ {(item.unitPrice * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold">
                  <td colSpan={4} className={tableTdClass + " text-right"}>{cat} 小計</td>
                  <td className={tableTdClass + " text-right font-sans"}>¥ {items.reduce((s, i) => s + (i.unitPrice * i.quantity), 0).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
        <div className="mt-auto text-center text-[8pt] text-slate-400">- 2 -</div>
      </div>
    </div>
  );
};

export default EstimateSheet;