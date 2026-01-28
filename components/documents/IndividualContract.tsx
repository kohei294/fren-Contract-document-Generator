
import React from 'react';
import { EstimateData } from '../../types';

interface IndividualContractProps {
  data: EstimateData;
  highlightSection?: string | null;
}

const IndividualContract: React.FC<IndividualContractProps> = ({ data, highlightSection }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '202X年  月  日';
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const subtotal = data.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const totalTaxExclusive = subtotal - data.discount;

  const fixedItems = data.items.filter(i => i.subCategory === '請負型業務' || i.category === '請負型業務');
  const quasiItems = data.items.filter(i => i.subCategory === '準委任型業務' || i.category === '準委任型業務');

  const fixedSubtotal = fixedItems.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
  const quasiSubtotal = quasiItems.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);

  const pageClass = "a4-container shadow-lg print:shadow-none mb-10 print:mb-0 text-slate-900 relative min-h-[297mm] flex flex-col pt-[20mm] pb-[20mm]";
  const articleTitleClass = "font-bold border-b border-slate-900 mb-2 font-sans text-[11pt] pb-0.5 mt-6 uppercase tracking-wider";
  const tableThClass = "bg-slate-100 border border-slate-900 p-1.5 text-[9.5pt] font-bold text-center font-sans";
  const tableTdClass = "border border-slate-900 p-1.5 text-[9.5pt] leading-relaxed";

  const CheckBox = ({ checked, label }: { checked: boolean, label: string | React.ReactNode }) => (
    <span className="flex items-center gap-2">
      <span className={`w-3.5 h-3.5 border border-slate-900 flex items-center justify-center text-[11px] leading-none ${checked ? 'bg-slate-900 text-white' : 'bg-white'}`}>
        {checked ? '✓' : ''}
      </span>
      <span className="text-[10px]">{label}</span>
    </span>
  );

  return (
    <div className="serif-font text-[10px]">
      {/* 1ページ目 */}
      <div className={pageClass}>
        <h1 className="text-[18pt] text-center mb-10 font-sans font-bold tracking-[0.2em] uppercase">個別契約書（発注書）</h1>

        <div className={`mb-6 leading-relaxed text-slate-900 section-highlight ${highlightSection === 'header' ? 'active' : ''}`}>
          <p>
            委託者 <span className="border-b border-slate-900 px-4 font-bold">{data.client.companyName || '（未入力）'}</span>（以下「委託者」という。）と、受託者 <span className="font-bold underline">{data.provider.companyName}</span>（以下「受託者」という。）は、両者間で締結された業務委託基本契約書（以下「基本契約」という。）に基づき、以下の通り個別契約（以下「本契約」という。）を締結する。
          </p>
        </div>

        <div className={`border border-slate-900 p-3 mb-6 bg-white space-y-2 section-highlight ${highlightSection === 'header' ? 'active' : ''}`}>
          <div>
            <strong>案件名：</strong>
            <span className="border-b border-slate-400 px-4 font-bold ml-2">{data.client.projectName}</span>
          </div>
          <div className="flex gap-8">
            <div>
              <strong>発注番号：</strong>
              <span className="border-b border-slate-400 px-4 ml-2 font-bold">{data.estimateNumber}</span>
            </div>
            <div>
              <strong>発注日：</strong>
              <span className="border-b border-slate-400 px-4 ml-2">{formatDate(data.contractDate)}</span>
            </div>
          </div>
        </div>

        <h2 className={articleTitleClass}>第1条 （業務の区分）</h2>
        <p className="mb-2">本契約における委託業務の性質は、以下の通りとする。</p>
        <div className={`flex gap-8 justify-center py-3 border border-slate-200 rounded mb-4 section-highlight ${highlightSection === 'type' ? 'active' : ''}`}>
          <CheckBox checked={data.contractType === 'FIXED'} label="請負型業務" />
          <CheckBox checked={data.contractType === 'QUASI'} label="準委任型業務" />
          <CheckBox checked={data.contractType === 'HYBRID'} label="混合（ハイブリッド型）" />
        </div>

        <h2 className={articleTitleClass}>第2条 （業務内容・仕様）</h2>
        <p className="mb-1.5">受託者は、委託者の指示に基づき、以下の業務を遂行する。</p>
        <div className={`border border-slate-900 p-3 min-h-[100px] space-y-1.5 mb-2 text-[10px] section-highlight ${highlightSection === 'items' ? 'active' : ''}`}>
          {data.items.length > 0 ? data.items.map((item, i) => (
            <p key={item.id}>{i + 1}. {item.name}（{item.details}）</p>
          )) : <p className="text-slate-300">（明細項目が未入力です）</p>}
          <p className="text-[8.5pt] text-slate-500 mt-2 italic">※詳細な仕様は、別途合意した見積書（番号:{data.estimateNumber}）または仕様書による。</p>
        </div>

        <h2 className={articleTitleClass}>第3条 （成果物の範囲）</h2>
        <p className="mb-1.5">本業務における納品対象となる成果物の範囲は以下の通りとする。</p>
        <table className={`w-full border-collapse border border-slate-900 mb-4 text-slate-900 section-highlight ${highlightSection === 'deliverables' ? 'active' : ''}`}>
          <thead>
            <tr>
              <th className={tableThClass} style={{ width: '30%' }}>区分</th>
              <th className={tableThClass}>内容・形式・納品可否</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tableTdClass}><strong>最終成果物</strong><br/><span className="text-[8pt]">（納品義務あり）</span></td>
              <td className={tableTdClass}>{data.deliverables.final}</td>
            </tr>
            <tr>
              <td className={tableTdClass}><strong>中間成果物</strong><br/><span className="text-[8pt]">（確認用資料）</span></td>
              <td className={tableTdClass}>{data.deliverables.intermediate}</td>
            </tr>
            <tr>
              <td className={tableTdClass}><strong>デザイン元データ</strong><br/><span className="text-[8pt]">（編集可能データ）</span></td>
              <td className={tableTdClass}>
                <div className="flex flex-col gap-1">
                  <CheckBox checked={data.deliverables.sourceData} label={`納品する（形式：${data.deliverables.sourceFormat}）`} />
                  <CheckBox checked={!data.deliverables.sourceData} label="納品しない" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className={articleTitleClass}>第4条 （修正回数・修正範囲）</h2>
        <p className="mb-1.5 leading-relaxed">委託料に含まれる修正対応の範囲は以下の通りとする。これを超える修正、または仕様確定後の大幅な変更については、第5条または第7条に基づき追加費用を請求する場合がある。</p>
        <ol className={`list-decimal pl-6 space-y-0.5 text-[10px] section-highlight ${highlightSection === 'revisions' ? 'active' : ''}`}>
          <li>デザイン修正： 初回提案後、<span className="font-bold border-b border-slate-900 px-3">{data.revisions.design}</span> ラウンドまで</li>
          <li>コーディング修正： 実装・検証完了後の軽微な修正 <span className="font-bold border-b border-slate-900 px-3">{data.revisions.coding}</span> 回まで</li>
          <li>その他： {data.revisions.others}</li>
        </ol>

        <div className="mt-auto text-center text-[9pt] text-slate-400">- 1 -</div>
      </div>

      {/* 2ページ目 */}
      <div className={pageClass}>
        <h2 className={articleTitleClass}>第5条 （準委任型業務の稼働条件）</h2>
        <p className="mb-2">準委任型業務（ディレクション、PM等）の委託料および稼働条件は、以下のいずれかのパターンを適用する。</p>

        <table className={`w-full border-collapse border border-slate-900 mb-6 text-slate-900 section-highlight ${highlightSection === 'quasi' ? 'active' : ''}`}>
          <thead>
            <tr>
              <th className={tableThClass} style={{ width: '15%' }}>項目</th>
              <th className={tableThClass}>パターンA<br/><span className="text-[8pt] font-normal">(人日ベース)</span></th>
              <th className={tableThClass}>パターンB<br/><span className="text-[8pt] font-normal">(月額ベース)</span></th>
              <th className={tableThClass}>パターンC<br/><span className="text-[8pt] font-normal">(固定月額)</span></th>
              <th className={tableThClass}>パターンD<br/><span className="text-[8pt] font-normal">(該当なし)</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`${tableTdClass} text-center font-bold bg-slate-50`}>選択</td>
              <td className={`${tableTdClass} text-center ${data.quasiPatterns.selected === 'A' ? 'bg-blue-50' : ''}`}><CheckBox checked={data.quasiPatterns.selected === 'A'} label="" /></td>
              <td className={`${tableTdClass} text-center ${data.quasiPatterns.selected === 'B' ? 'bg-blue-50' : ''}`}><CheckBox checked={data.quasiPatterns.selected === 'B'} label="" /></td>
              <td className={`${tableTdClass} text-center ${data.quasiPatterns.selected === 'C' ? 'bg-blue-50' : ''}`}><CheckBox checked={data.quasiPatterns.selected === 'C'} label="" /></td>
              <td className={`${tableTdClass} text-center ${data.quasiPatterns.selected === 'D' ? 'bg-blue-50' : ''}`}><CheckBox checked={data.quasiPatterns.selected === 'D'} label="" /></td>
            </tr>
            <tr>
              <td className={`${tableTdClass} font-bold bg-slate-50`}>単価/月額</td>
              <td className={`${tableTdClass} ${data.quasiPatterns.selected === 'A' ? 'bg-blue-50 font-bold' : ''}`}>{data.quasiPatterns.A.price}</td>
              <td className={`${tableTdClass} ${data.quasiPatterns.selected === 'B' ? 'bg-blue-50 font-bold' : ''}`}>{data.quasiPatterns.B.price}</td>
              <td className={`${tableTdClass} ${data.quasiPatterns.selected === 'C' ? 'bg-blue-50 font-bold' : ''}`}>{data.quasiPatterns.C.price}</td>
              <td className={`${tableTdClass} ${data.quasiPatterns.selected === 'D' ? 'bg-blue-50 font-bold' : ''}`}>{data.quasiPatterns.D.price}</td>
            </tr>
            <tr>
              <td className={`${tableTdClass} font-bold bg-slate-50`}>稼働条件</td>
              <td className={`${tableTdClass} ${data.quasiPatterns.selected === 'A' ? 'bg-blue-50' : ''}`}>{data.quasiPatterns.A.condition}</td>
              <td className={`${tableTdClass} ${data.quasiPatterns.selected === 'B' ? 'bg-blue-50' : ''}`}>{data.quasiPatterns.B.condition}</td>
              <td className={`${tableTdClass} ${data.quasiPatterns.selected === 'C' ? 'bg-blue-50' : ''}`}>{data.quasiPatterns.C.condition}</td>
              <td className={`${tableTdClass} ${data.quasiPatterns.selected === 'D' ? 'bg-blue-50' : ''}`}>{data.quasiPatterns.D.condition}</td>
            </tr>
            <tr>
              <td className={`${tableTdClass} font-bold bg-slate-50`}>超過精算</td>
              <td className={`${tableTdClass} ${data.quasiPatterns.selected === 'A' ? 'bg-blue-50' : ''}`}>{data.quasiPatterns.A.overtime}</td>
              <td className={`${tableTdClass} ${data.quasiPatterns.selected === 'B' ? 'bg-blue-50' : ''}`}>{data.quasiPatterns.B.overtime}</td>
              <td className={`${tableTdClass} ${data.quasiPatterns.selected === 'C' ? 'bg-blue-50' : ''}`}>{data.quasiPatterns.C.overtime}</td>
              <td className={`${tableTdClass} ${data.quasiPatterns.selected === 'D' ? 'bg-blue-50' : ''}`}>{data.quasiPatterns.D.overtime}</td>
            </tr>
          </tbody>
        </table>

        <div className="p-3 border border-slate-300 bg-slate-50 text-[8.5pt] mb-6 leading-relaxed text-slate-900">
          <p className="font-bold mb-1.5">【役割別単価表（参考値）】</p>
          <div className="grid grid-cols-2 gap-y-0.5">
            <p>Quality Manager: ¥ 2,500,000 〜</p>
            <p>Project Manager: ¥ 1,900,000 〜</p>
            <p>Design Strategist: ¥ 1,900,000 〜</p>
            <p>Art Director: ¥ 1,700,000 〜</p>
          </div>
        </div>

        <h2 className={articleTitleClass}>第6条 （スケジュール・納期）</h2>
        <ol className={`list-decimal pl-6 space-y-1.5 text-[10px] section-highlight ${highlightSection === 'schedule' ? 'active' : ''}`}>
          <li><strong>作業期間：</strong> <span className="font-bold border-b border-slate-900 px-4">{formatDate(data.workStartDate)}</span> 〜 <span className="font-bold border-b border-slate-900 px-4">{formatDate(data.workEndDate)}</span></li>
          <li><strong>最終納期：</strong> <span className="font-bold border-b border-slate-900 px-4">{formatDate(data.deliveryDate)}</span></li>
          <li><strong>納入場所：</strong> 委託者指定サーバー または 電磁的記録媒体</li>
        </ol>

        <div className="mt-auto text-center text-[9pt] text-slate-400">- 2 -</div>
      </div>

      {/* 3ページ目 */}
      <div className={pageClass}>
        <h2 className={articleTitleClass}>第7条 （委託料）</h2>
        <p className="mb-2">本契約の委託料総額および内訳は以下の通りとする。</p>

        <table className={`w-full border-collapse border border-slate-900 mb-6 text-slate-900 section-highlight ${highlightSection === 'items' ? 'active' : ''}`}>
          <thead>
            <tr>
              <th className={tableThClass} style={{ width: '25%' }}>業務区分</th>
              <th className={tableThClass}>内容</th>
              <th className={tableThClass} style={{ width: '20%' }}>金額（税別）</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-slate-50"><td className={`${tableTdClass} font-bold`} colSpan={3}>(1) 請負型業務 <span className="font-normal text-[8.5pt]">（成果物完成責任あり・検収対象）</span></td></tr>
            {fixedItems.map(item => (
              <tr key={item.id}>
                <td className={tableTdClass}>{item.name}</td>
                <td className={tableTdClass}>{item.details}</td>
                <td className={`${tableTdClass} text-right font-sans`}>¥ { (item.unitPrice * item.quantity).toLocaleString() }</td>
              </tr>
            ))}
            {fixedItems.length === 0 && <tr><td className={tableTdClass} colSpan={3}>-</td></tr>}
            <tr>
              <td className={`${tableTdClass} text-right bg-slate-50 font-bold`} colSpan={2}>請負小計</td>
              <td className={`${tableTdClass} text-right font-bold font-sans`}>¥ { fixedSubtotal.toLocaleString() }</td>
            </tr>

            <tr className="bg-slate-50"><td className={`${tableTdClass} font-bold`} colSpan={3}>(2) 準委任型業務 <span className="font-normal text-[8.5pt]">（善管注意義務・期間対応）</span></td></tr>
            {quasiItems.map(item => (
              <tr key={item.id}>
                <td className={tableTdClass}>{item.name}</td>
                <td className={tableTdClass}>{item.details}（{item.quantity}{item.unit}）</td>
                <td className={`${tableTdClass} text-right font-sans`}>¥ { (item.unitPrice * item.quantity).toLocaleString() }</td>
              </tr>
            ))}
            {quasiItems.length === 0 && <tr><td className={tableTdClass} colSpan={3}>-</td></tr>}
            <tr>
              <td className={`${tableTdClass} text-right bg-slate-50 font-bold`} colSpan={2}>準委任小計</td>
              <td className={`${tableTdClass} text-right font-bold font-sans`}>¥ { quasiSubtotal.toLocaleString() }</td>
            </tr>

            {data.discount > 0 && (
              <tr className={`section-highlight ${highlightSection === 'discount' ? 'active' : ''}`}>
                <td className={`${tableTdClass} bg-slate-50 font-bold`}>(3) その他</td>
                <td className={tableTdClass}>出精お値引き、端数調整</td>
                <td className={`${tableTdClass} text-right text-red-600 font-bold font-sans`}>- ¥ { data.discount.toLocaleString() }</td>
              </tr>
            )}
            <tr className="bg-slate-100 font-bold border-t-2 border-slate-900">
              <td className="p-2 text-center border border-slate-900 text-[10px]">合計委託料</td>
              <td className="p-2 text-center border border-slate-900 text-[8pt] font-normal italic">（消費税別途）</td>
              <td className="p-2 text-right border border-slate-900 text-[11pt] font-sans">¥ { totalTaxExclusive.toLocaleString() }</td>
            </tr>
          </tbody>
        </table>

        <h2 className={articleTitleClass}>第8条 （支払方法・支払期日）</h2>
        <div className={`flex gap-10 mb-4 text-[10px] section-highlight ${highlightSection === 'payment' ? 'active' : ''}`}>
          <CheckBox checked={data.paymentType === 'SINGLE'} label="一括払い（検収完了月の翌月末払い）" />
          <CheckBox checked={data.paymentType === 'MILESTONE'} label="分割払い（マイルストーン払い）" />
        </div>
        {data.paymentType === 'MILESTONE' && (
          <table className={`w-full border-collapse border border-slate-900 mb-6 text-slate-900 section-highlight ${highlightSection === 'payment' ? 'active' : ''}`}>
            <thead>
              <tr>
                <th className={tableThClass} style={{ width: '20%' }}>回数</th>
                <th className={tableThClass} style={{ width: '25%' }}>金額（税別）</th>
                <th className={tableThClass}>請求時期・条件</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`${tableTdClass} text-center font-bold`}>第1回（着手金）</td>
                <td className={`${tableTdClass} text-right font-bold`}>¥ { (totalTaxExclusive * 0.5).toLocaleString() }<br/><span className="text-[8pt] font-normal">(50%)</span></td>
                <td className={tableTdClass}>本契約締結後、7営業日以内に請求<br/>請求月の翌月末払い</td>
              </tr>
              <tr>
                <td className={`${tableTdClass} text-center font-bold`}>第2回（完了金）</td>
                <td className={`${tableTdClass} text-right font-bold`}>¥ { (totalTaxExclusive * 0.5).toLocaleString() }<br/><span className="text-[8pt] font-normal">(50%)</span></td>
                <td className={tableTdClass}>最終成果物の検収完了後、7営業日以内に請求<br/>請求月の翌月末払い</td>
              </tr>
            </tbody>
          </table>
        )}

        <div className="mt-auto text-center text-[9pt] text-slate-400">- 3 -</div>
      </div>

      {/* 4ページ目 */}
      <div className={pageClass}>
        <h2 className={articleTitleClass}>第9条 （費用負担）</h2>
        <ol className="list-decimal pl-6 space-y-1.5 text-[10px]">
          <li>委託業務の遂行に必要な交通費、宿泊費、素材購入費（ストックフォト、フォント等）、サーバー利用料等の実費は、委託料とは別に委託者が負担する。</li>
          <li>受託者は, 事前に費用の概算を提示し、委託者の承諾を得た上で支出するものとする。</li>
        </ol>

        <h2 className={articleTitleClass}>第10条 （撮影条件）</h2>
        <div className={`flex gap-10 mb-3 text-[10px] section-highlight ${highlightSection === 'photography' ? 'active' : ''}`}>
          <CheckBox checked={!data.hasPhotography} label="撮影なし" />
          <CheckBox checked={data.hasPhotography} label="撮影あり（以下の条件を適用）" />
        </div>
        {data.hasPhotography && (
          <table className={`w-full border-collapse border border-slate-900 mb-6 text-slate-900 section-highlight ${highlightSection === 'photography' ? 'active' : ''}`}>
            <tbody>
              <tr>
                <th className={tableThClass} style={{ width: '25%' }}>撮影日数・時間</th>
                <td className={tableTdClass}>{data.photoDetails.days}日間（拘束 {data.photoDetails.hours}時間/日）</td>
              </tr>
              <tr>
                <th className={tableThClass}>納品カット数</th>
                <td className={tableTdClass}>セレクト済み {data.photoDetails.cuts} カット（※全データ納品は含まない）</td>
              </tr>
              <tr>
                <th className={tableThClass}>モデル手配</th>
                <td className={tableTdClass}>{data.photoDetails.modelInfo}</td>
              </tr>
              <tr>
                <th className={tableThClass}>肖像権処理</th>
                <td className={tableTdClass}>
                  <div className="flex gap-6">
                    <CheckBox checked={data.photoDetails.rightsHandling === 'CLIENT'} label="委託者の責任にて処理" />
                    <CheckBox checked={data.photoDetails.rightsHandling === 'PROVIDER'} label="受託者にて代行（別途費用）" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        )}

        <h2 className={articleTitleClass}>第11条 （知的財産権の取扱い）</h2>
        <p className="mb-3 font-bold text-slate-700 text-[10px]">本業務に関する知的財産権の取扱いは、以下のいずれかを適用する。</p>
        
        <div className={`border p-4 mb-3 rounded section-highlight ${highlightSection === 'rights' ? 'active' : ''} ${data.ipPattern === 'A' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 opacity-60'}`}>
          <div className="mb-1 font-bold flex items-center gap-2 text-[10px]">
            <CheckBox checked={data.ipPattern === 'A'} label="パターンA：著作権移転型" />
          </div>
          <p className="text-[9px] leading-relaxed text-slate-600 pl-6">
            成果物の著作権（著作権法第27条及び第28条の権利を含む）は、全て委託者に帰属するものとし、権利の発生と同時に委託者に移転する。ただし、受託者が従前より有していた汎用的な知的財産権（プログラム、ノウハウ等）は受託者に留保される。
          </p>
        </div>

        <div className={`border p-4 mb-6 rounded section-highlight ${highlightSection === 'rights' ? 'active' : ''} ${data.ipPattern === 'B' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 opacity-60'}`}>
          <div className="mb-1 font-bold flex items-center gap-2 text-[10px]">
            <CheckBox checked={data.ipPattern === 'B'} label="パターンB：受託者保有 + 利用権許諾型" />
          </div>
          <p className="text-[9px] leading-relaxed text-slate-600 pl-6">
            本業務を通じて受託者が新たに創作した部分の知的財産権は受託者に留保される。ただし、委託者は成果物を期限・地域・目的の制限なく、自ら知的財産権を保有するのと同等に利用する権利を許諾される。
          </p>
        </div>

        <h2 className={articleTitleClass}>第12条 （特記事項）</h2>
        <div className={`border border-slate-900 p-4 min-h-[80px] text-slate-800 leading-relaxed text-slate-900 text-[10px] section-highlight ${highlightSection === 'notes' ? 'active' : ''}`}>
          <p>1. 中間成果物（デザイン元データ等）の納品は、第3条の定めに従う。</p>
          <p>2. 本契約に定めのない事項については、基本契約の定めに従うものとする。</p>
          {data.hasNotes && data.notes && (
            <p className="mt-1">3. {data.notes}</p>
          )}
        </div>

        <div className="mt-auto text-center text-[9pt] text-slate-400">- 4 -</div>
      </div>

      {/* 5ページ目：署名欄 */}
      <div className={pageClass}>
        <p className="mt-16 leading-relaxed text-center mb-12 text-[10px] text-slate-900">
          本契約の成立を証するため、本書2通を作成し、委託者及び受託者双方が記名押印の上、各1通を保有する。
        </p>

        <div className={`space-y-12 text-slate-900 section-highlight ${highlightSection === 'signature' ? 'active' : ''}`}>
          <div className="text-center mb-6">
            <p className="text-[14pt] font-bold border-b-2 border-slate-900 inline-block px-16 pb-1">
              {formatDate(data.documentDate)}
            </p>
          </div>

          <div className="flex flex-col gap-12 max-w-[500px] mx-auto">
            {/* 委託者（上） */}
            <div className="space-y-4">
              <p className="font-black text-[12pt] border-l-8 border-slate-900 pl-4">（委託者）</p>
              <div className="pl-4 space-y-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8.5pt] font-bold text-slate-400 uppercase tracking-tighter">住所</span>
                  <span className="border-b border-slate-400 min-h-[1.5em] block font-bold text-[10px]">{data.client.address || '　'}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8.5pt] font-bold text-slate-400 uppercase tracking-tighter">社名</span>
                  <span className="border-b border-slate-400 min-h-[1.5em] block font-bold text-[10px]">{data.client.companyName || '　'}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8.5pt] font-bold text-slate-400 uppercase tracking-tighter">代表者職名・氏名</span>
                  <div className="flex items-end justify-between border-b border-slate-400">
                    <span className="min-h-[1.5em] block font-bold text-[10px]">{data.client.representative || '　'}</span>
                    <span className="text-xs text-slate-300 font-sans border border-slate-200 rounded px-2 mb-1">印</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 受託者（下） */}
            <div className="space-y-4">
              <p className="font-black text-[12pt] border-l-8 border-slate-900 pl-4">（受託者）</p>
              <div className="pl-4 space-y-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8.5pt] font-bold text-slate-400 uppercase tracking-tighter">住所</span>
                  <span className="border-b border-slate-400 font-bold text-[10px]">〒{data.provider.zipCode} {data.provider.address}</span>
                  {data.provider.building && <span className="border-b border-slate-400 font-bold text-[10px]">{data.provider.building}</span>}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8.5pt] font-bold text-slate-400 uppercase tracking-tighter">社名</span>
                  <span className="border-b border-slate-400 font-bold text-[10px]">{data.provider.companyName}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8.5pt] font-bold text-slate-400 uppercase tracking-tighter">代表者職名・氏名</span>
                  <div className="flex items-end justify-between border-b border-slate-400">
                    <span className="font-bold text-[10px]">代表取締役　{data.provider.representative}</span>
                    <span className="text-xs text-slate-300 font-sans border border-slate-200 rounded px-2 mb-1">印</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto text-center text-[9pt] text-slate-400">- 5 -</div>
      </div>
    </div>
  );
};

export default IndividualContract;
