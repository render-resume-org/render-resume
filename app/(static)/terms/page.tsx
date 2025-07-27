import Link from "next/link";

export default function TermsPage() {
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
      <main className="container mx-auto px-4 pb-12 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                服務條款
            </h1>
            最後更新日期：{new Date().toLocaleDateString('zh-TW')}
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. 服務條款的接受
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                歡迎使用 RenderResume 懶得履歷・AI 履歷生成器（以下簡稱「本服務」）。本服務條款（以下簡稱「本條款」）是您與我們之間具有法律約束力的協議。
                當您註冊帳戶、使用本服務或存取我們的網站時，即表示您同意受本條款約束。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. 服務說明
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                本服務提供基於人工智慧技術的履歷生成和優化功能，包括但不限於：
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>AI 驅動的履歷內容建議和優化</li>
                <li>多種履歷範本和格式選擇</li>
                <li>個人化的職涯建議</li>
                <li>履歷分析和改進建議</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. 使用者帳戶
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                為了使用本服務，您需要建立一個帳戶。您同意：
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>提供準確、完整且最新的註冊資訊</li>
                <li>保護您的帳戶密碼和登入憑證</li>
                <li>對您帳戶下的所有活動負責</li>
                <li>立即通知我們任何未授權的帳戶使用</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. 使用限制
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                您同意不會：
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>違反任何適用的法律或法規</li>
                <li>上傳虛假、誤導或不當的內容</li>
                <li>嘗試破壞或干擾本服務的正常運作</li>
                <li>未經授權存取他人的帳戶或資料</li>
                <li>將本服務用於任何商業用途，除非另有書面同意</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. 知識產權
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                本服務及其所有相關內容（包括但不限於軟體、設計、文字、圖像）均受著作權法和其他知識產權法保護。
                您被授予有限的、非排他性的、不可轉讓的使用許可。您保留對您上傳內容的所有權，但同意我們可以使用這些內容來提供服務。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. 隱私保護
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                我們重視您的隱私。有關我們如何收集、使用和保護您的個人資料的詳細資訊，請參閱我們的
                <Link href="/privacy" className="text-cyan-600 hover:text-cyan-700 underline underline-offset-4 mx-1">
                  隱私權政策
                </Link>
                。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. 服務變更與終止
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                我們保留隨時修改、暫停或終止本服務的權利，恕不另行通知。我們也可能因違反本條款而終止您的帳戶。
                帳戶終止後，您將失去存取服務和相關資料的權限。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. 免責聲明
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                本服務按「現狀」提供，不提供任何明示或暗示的保證。我們不保證服務的準確性、可靠性或適用性。
                您使用本服務的風險由您自行承擔。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. 責任限制
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                在法律允許的最大範圍內，我們對因使用或無法使用本服務而產生的任何直接、間接、偶然或後果性損害不承擔責任。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. 條款變更
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                我們可能會不時更新本條款。重大變更將通過電子郵件或網站通知您。繼續使用本服務即表示您接受修訂後的條款。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                11. 聯絡資訊
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                如果您對本服務條款有任何疑問，請透過以下方式聯絡我們：
              </p>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  電子郵件：info@render-resume.com<br />
                  服務時間：週一至週五 09:00-18:00
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row gap-4 text-center">
              <Link
                href="/privacy"
                className="text-cyan-600 hover:text-cyan-700 underline underline-offset-4"
              >
                隱私權政策
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