import type { LegalDoc } from "@/components/legal-types";

export const privacyDoc: LegalDoc = {
  title: "隱私政策",
  updatedAt: "2025/8/12",
  intro: [
    {
      type: "p",
      text:
        "「RenderResume」（以下簡稱「本服務」）是由 RenderResume 團隊（以下簡稱「我們」）所建置並提供的服務。我們非常重視使用者（以下簡稱「您」）的隱私權，因此制定本隱私政策（以下簡稱「本政策」），載明我們如何蒐集、使用、揭露、移轉及儲存您的個人資料及其他資訊。一旦您註冊或使用本服務時，即視為您同意我們蒐集、使用、揭露、移轉、儲存，與按照本政策所述方式處理您的個人資料及其他資訊。",
    },
    {
      type: "p",
      text:
        "我們有權於任何時間變更本政策之內容，您若於變更後繼續使用本服務，即表示您同意並接受修改後的隱私政策。",
    },
  ],
  sections: [
    {
      title: "1. 資料蒐集",
      blocks: [
        { type: "p", text: "若您註冊帳號並使用本服務，您會提供個人資料給我們，包括：" },
        {
          type: "ul",
          items: [
            "註冊資料（姓名、電子郵件地址等資料）",
            "個人檔案及履歷",
            "瀏覽器 Cookies 和類似技術收集的資料",
            "客服溝通記錄",
          ],
        },
      ],
    },
    {
      title: "2. 資料使用",
      blocks: [
        { type: "p", text: "於本服務營運期間或您使用本服務帳號之期間，我們基於以下目的使用您的個人資料：" },
        {
          type: "ul",
          items: [
            "提供、維護和改進我們的服務",
            "生成和優化您的履歷內容",
            "支援客服",
            "研究及統計",
            "遵守法律義務",
          ],
        },
        {
          type: "p",
          text:
            "使用本服務時，您上傳的一切資料都僅用於分析產生針對您個人履歷的優化建議。我們不會將您的資料用於訓練我們的模型，也不會用於任何其他用途。",
        },
      ],
    },
    {
      title: "3. 資料保護",
      blocks: [
        {
          type: "p",
          text:
            "本網站主機均設有防火牆、防毒系統等相關的各項資訊安全設備及必要的安全防護措施，嚴格保護網站及您的個人資料，並在傳輸資料時進行嚴格加密。",
        },
        {
          type: "p",
          text:
            "如因業務需要有必要委託其他單位提供服務時，本網站亦會嚴格要求其遵守保密義務，並且採取必要檢查程序以確定其將確實遵守。",
        },
      ],
    },
    {
      title: "4. 資料保存",
      blocks: [
        { type: "p", text: "只要您的帳號仍在使用中，或是在為您提供服務時所需要，我們會為不同目的將您的資料保存一定期間，詳細情形如下：" },
        {
          type: "ul",
          items: [
            "帳戶資料：保存至您刪除帳戶後 30 天內",
            "履歷資料：保存至您刪除帳戶後 30 天內",
            "使用記錄：保存 2 年",
            "客服記錄：保存 2 年",
          ],
        },
      ],
    },
    {
      title: "5. 第三方服務",
      blocks: [
        { type: "p", text: "在某些情況下，我們會向第三方披露個人資訊，使我們得提供服務、改善您對我們的體驗，包括：" },
        {
          type: "ul",
          items: [
            "付款使用應援科技的服務。",
            "AI 模型使用 OpenAI 的服務。",
            "資料儲存使用 Supabase 的服務。",
            "網站託管使用 Vercel 的服務。",
          ],
        },
      ],
    },
    {
      title: "6. 您的權利",
      blocks: [
        { type: "p", text: "對於我們擁有的關於您的個人資料，您擁有特定權利以處理您的個人資料，包括：" },
        {
          type: "ul",
          items: [
            "查詢或請求閱覽。",
            "請求補充或更正。",
            "請求停止蒐集、處理或利用。",
            "請求刪除。",
          ],
        },
      ],
    },
    {
      title: "7. 聯絡我們",
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

export default privacyDoc;


