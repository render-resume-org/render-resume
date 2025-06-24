import Link from "next/link";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">

          
          <div className="max-w-4xl mx-auto flex p-4 py-8">
              
    <Link
        href="/"
        className="text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400"
        >
        返回首頁
    </Link>
        </div>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                隱私權政策
            </h1>
            最後更新日期：{new Date().toLocaleDateString('zh-TW')}
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. 隱私權政策概述
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                我們非常重視您的隱私權。本隱私權政策說明當您使用 AI 履歷生成器時，我們如何收集、使用、儲存和保護您的個人資料。
                使用我們的服務即表示您同意本隱私權政策中描述的做法。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. 我們收集的資料
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                2.1 您主動提供的資料
              </h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mb-4">
                <li>註冊資訊（電子郵件地址、密碼）</li>
                <li>個人履歷資料（姓名、工作經歷、教育背景、技能等）</li>
                <li>聯絡資訊（電話號碼、地址等）</li>
                <li>與我們的客服溝通記錄</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                2.2 自動收集的資料
              </h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>使用數據（頁面瀏覽、功能使用情況、使用時間）</li>
                <li>裝置資訊（IP 地址、瀏覽器類型、作業系統）</li>
                <li>Cookies 和類似技術收集的資料</li>
                <li>錯誤報告和效能資料</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. 資料使用目的
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                我們基於以下目的使用您的個人資料：
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>提供、維護和改進我們的服務</li>
                <li>生成和優化您的履歷內容</li>
                <li>個人化您的使用體驗</li>
                <li>與您溝通服務相關事項</li>
                <li>提供客戶支援</li>
                <li>進行安全監控和詐騙防護</li>
                <li>遵守法律義務</li>
                <li>進行匿名化的統計分析</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. 資料分享與揭露
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                我們承諾不會出售您的個人資料。我們只會在以下情況下分享您的資料：
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>經您明確同意</li>
                <li>與可信賴的服務提供商（如雲端服務商）共享，並受嚴格的保密協議約束</li>
                <li>遵守法律要求或法院命令</li>
                <li>保護我們的權利、財產或安全</li>
                <li>在企業合併、收購或資產轉讓的情況下</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. 資料安全
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                我們採用業界標準的安全措施保護您的資料：
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>使用 SSL/TLS 加密傳輸</li>
                <li>資料庫加密儲存</li>
                <li>定期安全審查和漏洞掃描</li>
                <li>嚴格的存取控制和員工培訓</li>
                <li>定期備份和災害復原計劃</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. 資料保存期限
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                我們只在必要的期間內保存您的個人資料。具體保存期限取決於資料類型和使用目的：
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mt-4">
                <li>帳戶資料：直到您刪除帳戶後 30 天</li>
                <li>履歷資料：直到您刪除或帳戶終止後 90 天</li>
                <li>使用記錄：最多保存 2 年</li>
                <li>客服記錄：最多保存 3 年</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. 您的權利
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                根據適用的資料保護法律，您享有以下權利：
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>查閱權：要求查看我們持有的您的個人資料</li>
                <li>更正權：要求更正不準確或不完整的資料</li>
                <li>刪除權：要求刪除您的個人資料</li>
                <li>限制處理權：要求限制對您資料的處理</li>
                <li>可攜權：要求以結構化格式接收您的資料</li>
                <li>反對權：反對基於合法利益的資料處理</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. Cookies 使用
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                我們使用 Cookies 和類似技術來：
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>記住您的登入狀態和偏好設定</li>
                <li>分析網站使用情況</li>
                <li>提供個人化體驗</li>
                <li>確保安全性</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                您可以通過瀏覽器設定管理 Cookies，但這可能會影響某些功能的使用。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. 第三方服務
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                我們的服務可能包含指向第三方網站的連結，或整合第三方服務（如 Google 登入）。
                這些第三方有其自己的隱私權政策，我們不對其隱私慣例負責。我們建議您查閱這些第三方的隱私權政策。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. 兒童隱私
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                我們的服務不針對 13 歲以下的兒童。我們不會故意收集 13 歲以下兒童的個人資料。
                如果我們發現收集了此類資料，將立即刪除。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                11. 跨境資料傳輸
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                您的資料可能會被傳輸到台灣以外的國家或地區進行處理。我們會確保這些傳輸符合適用的資料保護法律，
                並採取適當的保護措施。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                12. 政策變更
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                我們可能會不時更新本隱私權政策。重大變更將通過電子郵件或網站公告通知您。
                建議您定期查閱本政策以了解最新資訊。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                13. 聯絡我們
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                如果您對本隱私權政策有任何疑問或要行使您的權利，請聯絡我們：
              </p>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  電子郵件：ruby0322@ntu.im<br />
                  服務時間：週一至週五 09:00-18:00<br />
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row gap-4 text-center">
              <Link
                href="/terms"
                className="text-cyan-600 hover:text-cyan-700 underline underline-offset-4"
              >
                服務條款
              </Link>
              <Link
                href="/auth/login"
                className="text-cyan-600 hover:text-cyan-700 underline underline-offset-4"
              >
                登入
              </Link>
              <Link
                href="/auth/sign-up"
                className="text-cyan-600 hover:text-cyan-700 underline underline-offset-4"
              >
                註冊
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 