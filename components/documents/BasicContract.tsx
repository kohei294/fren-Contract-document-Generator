
import React from 'react';
import { EstimateData } from '../../types';

interface BasicContractProps {
  data: EstimateData;
  highlightSection?: string | null;
}

const BasicContract: React.FC<BasicContractProps> = ({ data, highlightSection }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '202X年  月  日';
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };
  
  const pageClass = "a4-container shadow-lg print:shadow-none mb-10 print:mb-0 text-slate-900 relative min-h-[297mm] flex flex-col";
  const headerClass = "text-[9pt] text-slate-400 absolute top-4 left-0 right-0 text-center no-print";
  const footerClass = "text-[9pt] text-slate-400 absolute bottom-4 left-0 right-0 text-center footer-page-number";
  const articleTitleClass = "font-bold border-b border-slate-900 mb-1 font-sans text-[11px] pt-3";
  const textClass = "text-[10px] leading-relaxed text-justify mb-1.5";
  const listClass = "list-none pl-4 space-y-0.5 mb-1.5 text-[10px]";

  return (
    <div className="serif-font">
      {/* ページ1: 第1条〜第3条 */}
      <div className={pageClass}>
        <div className="absolute top-8 right-8 text-[9pt] font-sans text-slate-400">管理番号：{data.estimateNumber}</div>
        <div className={headerClass}>業務委託基本契約書</div>
        <h1 className="text-2xl text-center mt-8 mb-12 font-sans font-bold tracking-[0.3em]">業務委託基本契約書</h1>
        <p className="text-[11px] leading-relaxed mb-6">
          <span className="font-bold underline decoration-slate-900 underline-offset-4">{data.client.companyName || '株式会社●●'}</span>（以下「委託者」という。）と<span className="font-bold underline decoration-slate-900 underline-offset-4">{data.provider.companyName}</span>（以下「受託者」という。）とは, 以下のとおり, 業務委託契約（以下「本契約」という。）を締結する。
        </p>
        
        <section className={`section-highlight ${highlightSection === 'header' ? 'active' : ''}`}>
          <h2 className={articleTitleClass}>第1条 （委託業務）</h2>
          <div className={textClass}>
            1. 委託者は, 受託者に対し, {data.client.projectName || 'コーポレートリブランディング業務、ブランドサイトの企画、設計、制作及びリニューアル業務、並びにこれらに付随関連するプロジェクトマネジメント業務等'}（以下「委託業務」という。）を委託し, 受託者はこれを受託する。<br/>
            2. 委託業務は, 個別契約の定めに従い, 次の各号に掲げる類型のいずれか, または双方を含むものとする。
            <ul className={listClass}>
              <li>(1) 請負型業務：デザイン制作, コーディング, 撮影, 編集その他仕様に基づき特定の成果物を完成させ, 納入することを目的とする業務。</li>
              <li>(2) 準委任型業務：ディレクション, プロジェクトマネジメント, 進行管理, 要件整理, 会議運営その他一定期間, 専門的知識に基づき善管注意義務をもって事務を処理することを目的とする業務。</li>
            </ul>
            3. 受託者は, 個別契約に定める内容に従い, 請負型業務については成果物の完成義務を負い, 準委任型業務については善良な管理者の注意をもって業務を遂行するものとする。<br/>
            4. 委託者及び受託者は, 委託業務の内容, 範囲を変更する場合, 双方協議のうえ書面を作成し, 記名押印により合意することでこれを行わなければならないものとする。<br/>
            5. 委託者及び受託者は, 追加業務を要する場合には, 第4条及び個別契約의 定めに従い, 追加業務の内容, 委託料の金額その他必要な事項を定めるものとする。
          </div>

          <h2 className={articleTitleClass}>第2条 （個別契約等）</h2>
          <div className={textClass}>
            1. 委託者及び受託者は別途個別契約において, 次の各号に掲げる事項を定めるものとする。
            <ul className={listClass}>
              <li>(1) 業務の区分（請負型業務か準委任型業務か, またはその混合か）</li>
              <li>(2) 発注年月日及び発注内容に関する名称</li>
              <li>(3) 仕様書, 企画書その他の資料により特定される品番・仕様等, 成果物が有すべき内容</li>
              <li>(4) 数量, 納期, 納入場所</li>
              <li>(5) 成果物の範囲（最終成果物, 中間成果物の区分, デザイン元データの納品可否等）</li>
              <li>(6) 修正回数・修正範囲（デザインラウンド, コーディング修正の回数・範囲等）</li>
              <li>(7) 準委任型業務における稼働条件（月額委託料に含まれる稼働時間の上限, 人日単価, 超過単価等）</li>
              <li>(8) 委託料・費用, 支払期日, 支払方法</li>
              <li>(9) 撮影を含む場合, 撮影に関する条件（撮影日数, カット数, モデル手配の責任範囲, 肖像権処理等）</li>
              <li>(10) その他, 特記事項</li>
            </ul>
            2. 本契約の定めは, 個別契約に対して共通に適用されるものとする。ただし, 個別契約においては, 本契約と異なる定めをすることができるものとし, その場合における個別契約の定めの内容が本契約の定めと矛盾する場合は, 個別契約の定めの効力が優先するものとする。
          </div>

          <h2 className={articleTitleClass}>第3条 （個別契約の成立）</h2>
          <div className={textClass}>
            1. 個別契約は, 委託者が受託者と協議の上決定した書式の注文書（電磁的方法を含む。以下同じ。）により発注し, 受託者がこれを承諾することによって成立する。<br/>
            2. 受託者は, 委託者の発注内容（委託業務の内容, 仕様, 納期その他個別契約に定める事項を含む。）に疑義又は異議がある場合, 注文書受領後３営業日以内に委託者にその旨通知する。当該期間内に, 何らの通知も委託者に到着しなかった場合, 当該期間が経過した時点で, 受託者が委託者の発注を承諾したものとみなす。
          </div>
        </section>
        <div className="flex-1"></div>
        <div className={footerClass}>- 1 -</div>
      </div>

      {/* ページ2: 第4条〜第8条 */}
      <div className={pageClass}>
        <div className={headerClass}>業務委託基本契約書</div>
        <section>
          <h2 className={articleTitleClass}>第4条 （仕様等及び追加費用）</h2>
          <div className={textClass}>
            1. 受託者は, 別途委託者が書面により指定した仕様等（仕様書, 企画書, ブランドコンセプト資料, サイト構成図, デザイン資料その他成果物の内容を特定する資料を含む。以下同じ。）に従い成果物を作成するものとする。<br/>
            2. 委託者は, 書面により通知することによって, 仕様等を変更することができる。この場合, 受託者は当該変更が委託業務に与える影響（納期, 作業量, 工数, 体制, 委託料等）を提示し, 当事者は協議のうえ合理的にこれらを変更するものとする。<br/>
            3. 前項にかかわらず, 次の各号のいずれかに該当する場合, 当該対応に要する追加作業は追加業務とみなし, 委託者は受託者に対し, 個別契約または追加合意に基づき, 追加委託料（請負型業務の増額または準委任型業務の稼働時間の追加）を支払うものとする。
            <ul className={listClass}>
              <li>(1) 仕様確定・承認後の変更, またはそれに準ずる差戻しが生じた場合</li>
              <li>(2) 委託者の確認遅延, 判断保留, 関係者追加に起因する再調整・再説明・再設計が生じた場合</li>
              <li>(3) 合意した修正回数・修正範囲を超える修正が生じた場合</li>
              <li>(4) その他, 当初合意した前提条件が充足されないことにより追加対応が必要となる場合</li>
            </ul>
            4. 受託者は, 仕様等に疑義を生じた場合又は誤りを発見した場合は, これを委託者に通知し, 委託者の指示に従うものとする。<br/>
            5. 委託者が作成する仕様書等に過誤がある場合であっても, 受託者が当該過誤を認識し, 又は合理的に認識し得たにもかかわらず, これを委託者に通知しなかった場合を除き, 受託者は, 当該過誤に起因する成果物の契約不適合に関する責任を負わないものとする。
          </div>

          <h2 className={articleTitleClass}>第5条 （スケジュール）</h2>
          <div className={`${textClass} section-highlight ${highlightSection === 'schedule' ? 'active' : ''}`}>
            1. 受託者は, 委託業務の遂行にあたり, 作業スケジュール, 作業工程表等, 委託業務の進捗管理の目安となる計画（企画, 設計, 制作, レビュー, 修正対応その他成果物完成までの工程を含む。）を作成するものとし, これを委託者に提出するものとする。<br/>
            2. 委託者は, 受託者から提出された確認事項（仕様確認, レビュー, 承認, 素材提供, アカウント提供等）について, 個別契約または別途合意する期限内に対応するものとする。<br/>
            3. 委託者の前項対応の遅延, 差戻し, 関係者追加その他委託者の事情により工程に影響が生じた場合, 納期・マイルストーンは当該影響に応じて当然に変更（延長）されるものとし, 受託者に追加作業が発生するときは, 第4条第3項に従い追加委託料を協議・合意するものとする。<br/>
            4. 受託者の責めに帰すべき事由により作業スケジュールに遅延が生じた場合, 受託者は, 当該遅延により委託者に生じた直接かつ通常の損害に限り, 賠償責任を負うものとする。
          </div>

          <h2 className={articleTitleClass}>第6条 （プロジェクトマネジメント義務）</h2>
          <div className={textClass}>
            受託者は, 納期までに成果物を完成することができるよう本契約及び個別契約並びに関係資料において提示した業務手順, 業務手法, 作業工程等に従って委託業務を進めるとともに, 常に進捗状況を管理し, 委託業務を阻害する要因の発見に務め, これに適切対処するものとする。
          </div>

          <h2 className={articleTitleClass}>第7条 （報告義務）</h2>
          <div className={textClass}>
            受託者は, 委託者から求められたときは, 委託業務の履行状況につき, すみやかに委託者に報告するものとする。
          </div>

          <h2 className={articleTitleClass}>第8条 （納入等）</h2>
          <div className={textClass}>
            1. 受託者は, 請負型業務における成果物を, 個別契約にて定める納期, 納入場所及び納入方法に従い納入するものとする。<br/>
            2. 委託者は, やむを得ない事由がある場合に限り, 受託者に書面により通知することにより, 納期, 納入場所及び納入方法を変更することができる。この場合, 変更に伴う費用の増減等については第4条の定めに従う。<br/>
            3. 受託者は, 納期までに成果物の納入を完了することができないとき若しくはそのおそれがあるとき, 又は委託業務の遂行が不能となった場合若しくはそのおそれがあるときには, 委託者に対して, 直ちに当該遅延又は不能にかかる具体的な状況をその理由とともに報告し, 委託者の指示を仰ぐものとする。
          </div>
        </section>
        <div className="flex-1"></div>
        <div className={footerClass}>- 2 -</div>
      </div>

      {/* ページ3: 第9条〜第14条 */}
      <div className={pageClass}>
        <div className={headerClass}>業務委託基本契約書</div>
        <section>
          <h2 className={articleTitleClass}>第9条 （検収）</h2>
          <div className={textClass}>
            1. 本条は, 請負型業務の成果物に限り適用され, 準委任型業務には適用されない。<br/>
            2. 委託者は, 成果物の納入を受けた後14日以内（以下「検査期間」という。）に, 自己の定める検査基準に従い検査を行うものとし, 検査に合格したときは, 受託者に対して書面により（電磁的方法による場合を含む。）検査合格の通知を行い, これをもって検収完了とする。<br/>
            3. 成果物の引渡しは, 検査合格の通知が受託者に到着した時に完了するものとする。成果物が電子データその他の無形物である場合においても, 本項に定める検査合格の通知をもって引渡しが完了したものとする。<br/>
            4. 検査の結果, 成果物が不合格となった場合, 委託者は, 受託者に対して遅滞なくその旨を通知するものとする。この場合, 受託者は, 別途委託者が定める期間内に, 不合格の原因となった種類・品質・数量に関する契約内容の不適合その他不具合等を無償で補修又は代替品を納入し, 再度検査を受けるものとする。<br/>
            5. 検査期間内に委託者が受託者に対して合格又は不合格の通知を行わない場合, 検査期間満了をもって当該成果物は検査に合格したものとみなす。
          </div>

          <h2 className={articleTitleClass}>第10条 （所有権移転）</h2>
          <div className={textClass}>
            成果物の引渡しと同時に, 成果物の所有権は受託者から委託者へ移転するものとする。成果物が電子データその他の無形物である場合には, 第9条に定める検収完了をもって, 本条に定める引渡し及び所有権移転がなされたものとする。
          </div>

          <h2 className={articleTitleClass}>第11条 （危険負担）</h2>
          <div className={textClass}>
            検収完了以前に生じた成果物の滅失, 損傷その他の損害は, 委託者の責めに帰すべきものを除き受託者が負担し, 検収完了後に生じた成果物の滅失, 損傷その他の損害は, 受託者の責めに帰すべきものを除き委託者が負担するものとする。
          </div>

          <h2 className={articleTitleClass}>第12条 （保証等）</h2>
          <div className={textClass}>
            受託者は, 成果物が, 本契約及び個別契約に基づき特定される仕様等, 品質基準及び成果物の利用目的に合理的に適合すること, 並びに一般的に通常期待される品質・性能を備えることを保証する。
          </div>

          <h2 className={articleTitleClass}>第13条 （契約不適合責任）</h2>
          <div className={textClass}>
            1. 本条は, 請負型業務の成果物に限り適用され, 準委任型業務には適用されない。<br/>
            2. 受託者は, 成果物の検収完了後1年以内に当該成果物について種類, 品質又は数量に関して契約の内容に適合しないもの（以下「契約不適合」という。）が発見された場合, 自己の責任と負担において当該成果物を修補するものとし, これによって委託者に生じた直接かつ通常の損害に限り賠償するものとする。なお, 当該損害賠償額の上限は, 当該個別契約に基づき受領した委託料の総額とする。<br/>
            3. 前項の契約不適合が, 委託者の指示, 支給物, 又は委託者が採用した第三者のサービス等に起因する場合, 受託者はその責任を負わないものとする。
          </div>

          <h2 className={articleTitleClass}>第14条 （委託料）</h2>
          <div className={`${textClass} section-highlight ${highlightSection === 'payment' ? 'active' : ''}`}>
            1. 委託者は, 受託者に対し, 個別契約で定める委託料を支払うものとする。<br/>
            2. 請負型業務の委託料については, 個別契約で定める固定金額（マイルストーン払い等を含む）とする。マイルストーン払いを採用する場合, 各マイルストーンの達成条件（成果物の納入, 中間検収の合格等）を個別契約で明確に定めるものとする。<br/>
            3. 準委任型業務の委託料については, 個別契約にて特段の定めのない限り, 次の各号の通りとする。<br/>
            (1) 月額委託料：個別契約に定める月額委託料を支払う. なお, 当該月額委託料には, 個別契約に定める上限時間までの稼働を含むものとする。<br/>
            (2) 超過委託料：前号の上限時間を超過して業務を行った場合, 委託者は, 個別契約に定める超過単価（時間単価または人日単価）に基づき計算した額を追加で支払う。人日単価の標準は, 個別契約で別途定めるものとし, 特段の定めがない場合は1人日あたり金50,000円とする。<br/>
            4. 前項の超過稼働が, 委託者の確認遅延, 差戻し, 関係者追加, 仕様変更等の事由に起因して生じた場合（待機時間, 再調整時間等を含む）であっても, 委託者は第3項第2号に基づき超過委託料を支払うものとする。<br/>
            5. 委託者は, 委託料を, 個別契約で定める支払期限までに, 受託者の別途指定する金融機関口座に振り込むものとする。なお, 振込手数料は委託者の負担とする。<br/>
            6. 委託者は, 委託料の支払を怠ったときは, 支払期限の翌日から完済まで年14.6%の割合による遅延損害金を受託者に対して支払うものとする。
          </div>
        </section>
        <div className="flex-1"></div>
        <div className={footerClass}>- 3 -</div>
      </div>

      {/* ページ4: 第15条〜第21条 */}
      <div className={pageClass}>
        <div className={headerClass}>業務委託基本契約書</div>
        <section>
          <h2 className={articleTitleClass}>第15条 （費用）</h2>
          <div className={textClass}>
            1. 委託者は, 個別契約において定めた費用及び別途書面をもって合意した費用（交通費, 素材購入費, サーバー利用料等を含むがこれらに限られない）に限り, 委託料とは別途負担するものとする。<br/>
            2. 費用の支払方法, 支払期限等については, 個別契約又は別途合意をもって定めるものとする。
          </div>

          <h2 className={articleTitleClass}>第16条 （貸与資料等）</h2>
          <div className={textClass}>
            1. 委託者は, 受託者に対し, 委託業務の遂行に必要な資料等（書面, データ, アカウント情報等）を無償で提供するものとする。<br/>
            2. 受託者による委託業務の履行遅滞, 不能又は成果物の契約不適合により委託者に損害が生じた場合であっても, その原因が委託者から貸与された資料等の提供の懈怠, 遅延若しくは欠陥, 又は委託者による指示の誤りに起因する場合には, 受託者は, 当該損害について責任を負わないものとする。
          </div>

          <h2 className={articleTitleClass}>第17条 （責任者）</h2>
          <div className={textClass}>
            1. 委託者及び受託者は, 委託業務に関する責任者をそれぞれ選任し, 連絡, 確認等に従事させるものとする。<br/>
            2. 委託者は, 意思決定の迅速化に努め, 受託者からの承認依頼に対しては, 合理的な期間内に回答を行うものとする。
          </div>

          <h2 className={articleTitleClass}>第18条 （業務従事者）</h2>
          <div className={textClass}>
            受託者は, 委託業務を遂行するに足る十分な能力をもつ者を, 業務従事者として選任するものとする。
          </div>

          <h2 className={articleTitleClass}>第19条 （連絡協議会）</h2>
          <div className={textClass}>
            業務遂行状況等の確認及び協議等のために委託者又は受託者が連絡協議会の開催を求めた場合, 相手方はこれに応じ, 連絡協議会を開催するものとする。
          </div>

          <h2 className={articleTitleClass}>第19条の2 （準委任型業務の稼働報告・受領）</h2>
          <div className={textClass}>
            1. 受託者は, 準委任型業務について, 個別契約で定める頻度（特段の定めがない場合は月次）で, 業務実施内容, 稼働時間等を記載した稼働報告書を委託者に提出するものとする。<br/>
            2. 委託者は, 前項の稼働報告書を受領後5営業日以内に異議を述べない場合, 当該報告書の内容を承認し, 当該期間における業務が適正に履行されたことを確認したものとみなす。
          </div>

          <h2 className={articleTitleClass}>第20条 （成果物にかかる権利の取扱い）</h2>
          <div className={`${textClass} section-highlight ${highlightSection === 'rights' ? 'active' : ''}`}>
            1. 成果物の著作権（著作権法第27条及び第28条の権利を含む。）は, 全て委託者に帰属するものとし, 権利の発生と同時に委託者に移転するものとする。<br/>
            2. 受託者は, 委託者及び委託者の指定する第三者に対し, 著作者人格権を行使しないものとする。<br/>
            3. 前二項にかかわらず, 受託者が従前より有していた著作権等の知的財産権（汎用的なプログラム, モジュール, デザインテンプレート, ノウハウ等を含む。）は受託者に留保されるものとし, 委託者は, 本契約の目的の範囲内においてこれらを非独占的に利用することができるものとする。<br/>
            4. 中間成果物（デザインカンプ, ワイヤーフレーム, デザイン元データ, 撮影未編集データ等）の納品可否及び利用条件については, 個別契約で定めるものとする。個別契約で特段の定めがない場合, 中間成果物の納品義務は負わず, その著作権は第1項の定めに従い委託者に帰属するが, デザイン元データ等の実データの引渡しは受託者の任意とする。<br/>
            5. 委託業務に撮影が含まれる場合, 撮影により取得した画像・動画の著作権は第1項の定めに従い委託者に帰属する。ただし, 撮影データの納品範囲（RAWデータ, 未編集データ, 選定済みデータ等）及び撮影対象者の肖像権処理（モデルリリース取得の責任範囲）については, 個別契約で明確に定めるものとする。
          </div>

          <h2 className={articleTitleClass}>第21条 （知的財産権等の取扱い）</h2>
          <div className={textClass}>
            1. 委託業務遂行の過程において生じた発明その他の知的財産権等は, 前条の定めに従い原則として委託者に帰属するものとする。<br/>
            2. ただし, 準委任型業務の遂行過程で受託者が作成した資料（議事録, WBS, 一般的な提案資料等）の知的財産権については, 受託者に留保される場合があるものとし, 詳細は個別契約にて定める。
          </div>
        </section>
        <div className="flex-1"></div>
        <div className={footerClass}>- 4 -</div>
      </div>

      {/* ページ5: 第22条〜第29条 */}
      <div className={pageClass}>
        <div className={headerClass}>業務委託基本契約書</div>
        <section>
          <h2 className={articleTitleClass}>第22条 （第三者の権利の利用等）</h2>
          <div className={textClass}>
            1. 受託者は, 委託業務に際して第三者の権利等（ストックフォト, フォント, OSS等）を利用する場合は, 事前に委託者の承諾を得た上で利用するものとする。当該利用にかかる費用は, 特段の定めがない限り委託者の負担とする。<br/>
            2. 受託者は, 成果物に第三者の権利を利用し又は含まれていた場合, 受託者の費用と責任により, 委託者が自由に成果物を利用するために必要な措置をとらなければならない。<br/>
            3. 委託業務に撮影が含まれる場合において, 撮影対象者の肖像権処理（モデルリリースの取得, 肖像権使用許諾の取得等）が必要となるときは, 当該処理の責任範囲を個別契約で定めるものとする。個別契約で特段の定めがない場合, 受託者は撮影の手配・実施を行うが, 肖像権処理については委託者の責任において行うものとする。
          </div>

          <h2 className={articleTitleClass}>第23条 （第三者の権利侵害等における対応）</h2>
          <div className={textClass}>
            1. 受託者は, 委託業務の遂行過程において, 第三者の知的財産権及び所有権その他一切の権利を侵害しないことを保証する。<br/>
            2. 委託業務に関連して第三者の権利を侵害することその他の理由により紛争が生じた場合, 受託者は, 自らの責任と費用により解決に努めるものとする。ただし, 当該侵害が委託者の指示又は委託者の提供した素材等に起因する場合はこの限りではない。
          </div>

          <h2 className={articleTitleClass}>第24条 （再委託）</h2>
          <div className={textClass}>
            受託者は, 書面により事前に委託者の承諾を得た場合に限り, 委託業務の全部又は一部を第三者に再委託することができるものとする。受託者は, 当該再委託先の行為について連帯して責任を負うものとする。
          </div>

          <h2 className={articleTitleClass}>第25条 （監査等）</h2>
          <div className={textClass}>
            委託者は, 秘密情報の漏えい等のおそれがあると合理的に判断した場合には, 受託者の管理体制等を調査・確認することができるものとする。
          </div>

          <h2 className={articleTitleClass}>第26条 （損害賠償）</h2>
          <div className={textClass}>
            本契約又は個別契約に関連して, 委託者又は受託者の責めに帰すべき事由により相手方に損害が生じた場合における損害賠償責任は, 当該損害が直接かつ通常の損害である場合に限られるものとする. なお, 本契約又は個別契約に関連して委託者又は受託者が負う損害賠償責任の総額は, 当該損害が発生した個別契約に基づく委託料の総額を上限とする。
          </div>

          <h2 className={articleTitleClass}>第27条 （秘密保持義務）</h2>
          <div className={textClass}>
            1. 委託者及び受託者は, 本契約に関連して知り得た相手方の秘密情報（営業上, 技術上その他一切の情報）を厳重に管理し, 相手方の事前の書面による承諾なく第三者に開示, 漏えいしてはならない。<br/>
            2. 前項の規定は, 次の各号の一に該当する情報については適用しない。<br/>
            (1) 開示を受ける前に公知であったもの / (2) 開示を受けた後に自己の責に帰すべき事由によることなく公知となったもの / (3) 開示を受ける前に既に自ら保有していたもの / (4) 正当な権限を有する第三者から秘密保持義務を負わずに入手したもの / (5) 独自の開発により取得したもの
          </div>

          <h2 className={articleTitleClass}>第28条 （個人情報の取扱い）</h2>
          <div className={textClass}>
            委託者及び受託者は, 委託業務の遂行にあたり相手方より提供を受けた個人情報について, 個人情報の保護に関する法律その他関連法令を遵守し, 適切に取り扱うものとする。
          </div>

          <h2 className={articleTitleClass}>第29条 （解除等）</h2>
          <div className={textClass}>
            1. 委託者又は受託者は, 相手方が本契約又は個別契約のいずれかの条項に違反し, 相当期間を定めて催告したにもかかわらず当該違反が正されないときは, 本契約及び個別契約の全部又は一部を解除することができる。<br/>
            2. 委託者又は受託者は, 相手方が支払停止, 仮差押え, 差押え, 競売, 破産, 民事再生, 会社更生手続開始の申立てがあったとき, 又は公租公課の滞納処分を受けたときは, 何らの催告を要せず直ちに本契約及び個別契約を解除することができる。
          </div>
        </section>
        <div className="flex-1"></div>
        <div className={footerClass}>- 5 -</div>
      </div>

      {/* ページ6: 第30条〜第38条 ＋ 署名 */}
      <div className={pageClass}>
        <div className={headerClass}>業務委託基本契約書</div>
        <section>
          <h2 className={articleTitleClass}>第30条 （中途解約）</h2>
          <div className={textClass}>
            1. 委託者は, 準委任型業務について, 受託者に対して1か月前までに書面で通知することにより, 個別契約を将来に向かって解約することができる。<br/>
            2. 前項の場合, 委託者は, 解約日までに受託者が遂行した業務の対価に加え, 当該解約に伴い受託者に生じた合理的な損害（既に手配済みのリソースの費用等）を支払うものとする。<br/>
            3. 請負型業務の中途解約については, 第31条の定めに従う。
          </div>

          <h2 className={articleTitleClass}>第31条 （中途成果物の取扱い）</h2>
          <div className={textClass}>
            請負型業務に係る個別契約が, 業務完了前に解除又は解約により終了した場合, 受託者は, 委託者の請求があるときは, 出来高部分（仕掛品を含む。）を委託者に引き渡すものとする。この場合, 委託者は, 当該出来高部分に相応する委託料を受託者に支払うものとする。
          </div>

          <h2 className={articleTitleClass}>第32条 （通知義務）</h2>
          <div className={textClass}>委託者及び受託者は, 商号, 代表者, 住所等に変更があったときは, 遅滞なく相手方に通知するものとする。</div>

          <h2 className={articleTitleClass}>第33条 （権利義務の移転禁止）</h2>
          <div className={textClass}>委託者及び受託者は, 相手方の書面による承諾なく, 本契約上の地位又は本契約に基づく権利義務を第三者に譲渡し, 又は担保に供してはならない。</div>

          <h2 className={articleTitleClass}>第34条 （反社会的勢力の排除）</h2>
          <div className={textClass}>委託者及び受託者は, 自己又は自己の役員が, 反社会的勢力に該当しないこと, 及び反社会的勢力と社会的に非難されるべき関係を有していないことを表明し, 保証する。違反した場合, 相手方は何らの催告を要せず本契約を解除することができる。</div>

          <h2 className={articleTitleClass}>第35条 （有効期間等）</h2>
          <div className={textClass}>本契約の有効期間は, 契約締結日から1年間とする。ただし, 期間満了の1か月前までに当事者の一方から書面による別段の申し出がない限り, 本契約は同一条件にてさらに1年間自動的に更新されるものとし, 以後も同様とする。</div>

          <h2 className={articleTitleClass}>第36条 （存続条項）</h2>
          <div className={textClass}>本契約終了後といえども, 第9条, 第10条, 第12条, 第13条, 第20条, 第21条, 第26条, 第27条, 第34条, 第37条及び本条の規定は, なお有効に存続するものとする。</div>

          <h2 className={articleTitleClass}>第37条 （準拠法及び管轄等）</h2>
          <div className={textClass}>本契約は日本法に準拠し, 解釈されるものとする。本契約に関する一切の紛争については, 東京地方裁判所を第一審の専属的合意管轄裁判所とする。</div>

          <h2 className={articleTitleClass}>第38条 （誠実義務）</h2>
          <div className={textClass}>本契約に定めのない事項又は本契約の条項の解釈について疑義が生じたときは, 委託者及び受託者は, 信義誠実の原則に従い協議の上, 円満に解決を図るものとする。</div>
        </section>

        <div className={`mt-12 space-y-10 signature-block section-highlight ${highlightSection === 'signature' ? 'active' : ''}`}>
          <p className="text-[11px]">{formatDate(data.documentDate)}</p>
          <div className="grid grid-cols-2 gap-10 text-[10px]">
            <div className="space-y-4">
              <p className="font-bold underline italic">（委託者）</p>
              <div className="pl-4 space-y-2">
                <p>住所：{data.client.address || '　'}</p>
                <p>社名：{data.client.companyName || '　'}</p>
                <p className="pt-2">代表：{data.client.representative || '　'}　印</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="font-bold underline italic">（受託者）</p>
              <div className="pl-4 space-y-2">
                <p>住所：〒{data.provider.zipCode} {data.provider.address}</p>
                {data.provider.building && <p>　　　{data.provider.building}</p>}
                <p>社名：{data.provider.companyName}</p>
                <p className="pt-2">代表：{data.provider.representative}　印</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1"></div>
        <div className={footerClass}>- 6 -</div>
      </div>
    </div>
  );
};

export default BasicContract;
