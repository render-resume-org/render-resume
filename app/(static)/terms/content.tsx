import Link from "next/link";
import type { LegalDoc } from "@/components/common/legal-types";

export const termsDoc: LegalDoc = {
  title: "服務條款",
  updatedAt: "2025/8/12",
  intro: [
    {
      type: "p",
      text:
        "「RenderResume」（以下簡稱「本服務」）是由 RenderResume 團隊（以下簡稱「我們」）所建置並提供的服務。為了保障使用者（以下簡稱「您」）的權益，您應詳細閱讀本服務條款（以下簡稱「本條款」）。一旦您註冊或使用本服務時，即視為您已閱讀、暸解、並同意接受本條款及網站其他條款之所有內容。",
    },
    {
      type: "p",
      text:
        "我們有權於任何時間變更本條款之內容，您若於變更後繼續使用本服務，即視為您已事先閱讀、瞭解、並同意與遵守該等變更後之內容。",
    },
  ],
  sections: [
    {
      title: "1. 服務內容",
      blocks: [
        { type: "p", text: "我們將透過 RenderResume 網站向用戶提供服務，包括：" },
        {
          type: "ul",
          items: [
            "履歷上傳分析",
            "AI 問答",
            "AI 驅動的履歷優化建議",
            "套用專業模板生成履歷",
          ],
        },
        {
          type: "p",
          text:
            "您了解並同意，我們可能會根據我們的判斷隨時更改本服務內容，亦可能不定時提供本服務更新，我們會將服務內容對應之本服務條款變更公告於本服務網站。",
        },
      ],
    },
    {
      title: "2. 用戶註冊",
      blocks: [
        {
          type: "p",
          text:
            "您需要註冊帳戶才能使用本服務。註冊帳戶時，請提供準確、完整的個人資料，並保持這些資料的更新。您應妥善保管帳戶密碼，不得將帳戶、密碼轉讓或出借給他人使用。您對使用其帳戶和密碼進行的一切活動負全部責任。",
        },
        {
          type: "p",
          text:
            "對於註冊帳號之申請，我們保留是否同意其註冊之權利。有以下任一情形者，我們得不予同意註冊帳號：",
        },
        {
          type: "ul",
          items: [
            "非真人行為或是不同人多重使用同一帳戶",
            "違反本服務條款或本服務其他政策",
          ],
        },
      ],
    },
    {
      title: "3. 不應為之行為",
      blocks: [
        {
          type: "p",
          text:
            "您不得利用本服務從事侵害他人合法權益或違反本服務條款之行為，包括但不限於：",
        },
        {
          type: "ul",
          items: [
            "違反任何適用的法律或法規",
            "上傳虛假、誤導或不當的內容",
            "冒用他人名義使用本服務",
            "將本服務用於任何商業用途",
            "嘗試破壞或干擾本服務的正常運作",
            "從事任何可能含有電腦病毒或是可能侵害本服務系統、資料之行為",
            "追蹤或干擾他人，或為非法目的收集其他用戶的個人資訊",
            "其他不當行為",
          ],
        },
        {
          type: "p",
          text:
            "如果發生上述任何情況，為保護我們和第三方的權利，避免損害或擴大爭議，我們可能會直接移除相關資訊，恕不另行通知，並限制違規者使用服務。我們可能會暫停、終止違規者的帳戶，或刪除帳戶中的所有相關資訊和檔案。",
        },
      ],
    },
    {
      title: "4. 隱私保護",
      blocks: [
        {
          type: "custom",
          render: () => (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              我們重視您的隱私。有關我們如何收集、使用和保護您的個人資料的詳細資訊，請參閱我們的
              <Link href="/privacy" className="text-cyan-600 hover:text-cyan-700 underline underline-offset-4">
                隱私政策
              </Link>
              。
            </p>
          ),
        },
      ],
    },
    {
      title: "5. 訂閱及付款",
      blocks: [
        {
          type: "p",
          text:
            "您了解並同意，本服務針對不同進階服務提供不同付費方案予付費之用戶，用戶得依其需求決定是否及使用何種付費方案。未付費之用戶仍得使用免費服務。",
        },
        {
          type: "p",
          text:
            "訂閱用戶會於每個訂閱週期根據訂閱方案被 RenderResume 自動收取訂閱服務款項。訂閱用戶將可以隨時選擇取消訂閱，並可以繼續使用訂閱服務至該訂閱週期結束。取消訂閱服務，需要登入您的 RenderResume 帳戶，並至您的帳戶設定頁面進行取消。",
        },
        {
          type: "p",
          text:
            "訂閱用戶在付款成功的七天內可申請退款，而在七天之後將不接受退款申請，此退費政策僅適用於首次訂閱。申請退款成功後，將不能繼續使用訂閱服務。每筆付款成功的款項，將會有信用卡與您酌收的手續費款項。此由信用卡酌收的手續費款項將不予退費。",
        },
        {
          type: "custom",
          render: () => (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              您了解並同意，收費方案、費率及機制可能依我們的業務及商業計劃有所變更。最新的收費方案請參閱我們的
              <Link href="/pricing" className="text-cyan-600 hover:text-cyan-700 underline underline-offset-4">
                價格方案
              </Link>
              。
            </p>
          ),
        },
      ],
    },
    {
      title: "6. 智慧財產權",
      blocks: [
        {
          type: "p",
          text:
            "本服務及其所有相關內容（包括但不限於軟體、設計、文字、圖像）均受著作權、商標權及其他相關法律的保護。您保留對您上傳內容的所有權，但同意我們可以使用這些內容來提供服務。",
        },
      ],
    },
    {
      title: "7. 免責聲明和責任限制",
      blocks: [
        {
          type: "p",
          text:
            "我們對本服務不提供任何明示或默示的擔保，包括但不限於本服務將不會中斷、AI 服務的準確性等。本服務僅依「現況」提供，您使用本服務時，須自行承擔相關風險。",
        },
      ],
    },
    {
      title: "8. 準據法及合意管轄",
      blocks: [
        {
          type: "p",
          text:
            "本服務條款、隱私政策及其相關使用規範、辦法、處理原則、政策、及相關服務說明等，以台灣法令為準據法。使用者與本公司因本服務、本服務條款、隱私政策或其相關使用規範、辦法、處理原則、政策、及相關服務說明所生之爭議，如因此而涉訟，以台灣台北地方法院為第一審管轄法院。",
        },
      ],
    },
    {
      title: "9. 聯絡我們",
      blocks: [
        {
          type: "custom",
          render: () => (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              如就 RenderResume 服務有任何疑問，請寄信至
              {" "}
              <a
                href="mailto:info@render-resume.com"
                className="text-cyan-600 hover:text-cyan-700 underline underline-offset-4"
              >
                info@render-resume.com
              </a>
              ，我們很樂意為您解答。
            </p>
          ),
        },
      ],
    },
  ],
};

export default termsDoc;


