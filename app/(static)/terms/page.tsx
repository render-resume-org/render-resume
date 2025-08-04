import Link from "next/link";
import Footer from "@/components/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12 max-w-4xl pt-8">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                服務條款
            </h1>
            最後更新日期：2025/8/3
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. 服務條款的接受
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                「RenderResume」（以下簡稱「本服務」）是由 RenderResume 團隊（以下簡稱「我們」）所建置並提供的服務。為了保障您的使用權益，所有使用本服務的使用者（包括用戶及會員，以下簡稱「您」或「使用者」），都應詳細閱讀本服務條款（以下簡稱「本條款」或「本合約」）。一旦使用者存取或使用本服務、或註冊時，即視為使用者已閱讀、暸解、並同意接受本服務條款及網站其他條款之所有內容。
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              我們有權因法律修訂、商業考量或服務內容變更隨時修訂本條款之內容，修訂後之條款，除另有說明者外，自公告時起生效。自生效日起，如您繼續使用本服務，即視為您已閱讀、瞭解、並同意修訂後條款所有內容。如您不同意修改後之內容，使用者應即刻停止使用本服務，我們亦得停止提供本服務，並不因此而對使用者負任何賠償或補償之責任。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. 服務說明
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                我們將透過 RenderResume 網站向用戶提供服務，包括：
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>AI 驅動的履歷內容建議和優化</li>
                <li>多種履歷範本和格式選擇</li>
                <li>個人化的職涯建議</li>
                <li>履歷分析和改進建議</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                用戶理解並同意，我們可能會根據我們的判斷隨時更改本服務內容（包括但不限於使用者介面、演算法），亦可能不定時提供本服務更新，我們會將服務內容對應之本服務條款變更公告於本服務網站。
              </p>
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
                <li>發布任何包含軟體病毒、蠕蟲或任何其他可能侵犯服務系統和資料的有害程式碼的內容</li>
                <li>追蹤或干擾他人，或為非法目的收集其他用戶的個人資訊</li>
                <li>其他不當行為</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                如果發生上述任何情況，為保護我們和第三方的權利和利益，或避免損害或擴大爭議，我們可能會直接移除相關資訊，恕不另行通知，限制違規者使用服務。如果違規者有會員帳戶，我們可能會暫停、終止會員帳戶，或刪除會員帳戶中的所有相關資訊、檔案和帳戶權利。
              </p>
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
                  隱私政策
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
                本服務按「現狀」提供，不提供任何明示或暗示的保證。我們不保證服務的準確性、可靠性或適用性。您使用本服務的風險由您自行承擔。
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 