"use client";

import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileText,
  HelpCircle,
  Search,
  Shield,
  Users,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// JSON-LD structured data for FAQ
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "什麼是 RenderResume？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "RenderResume 是一個基於 AI 技術的履歷生成和優化平台，採用 Fortune 500 企業標準的六維度評估模型，幫助求職者創建專業履歷。"
      }
    },
    {
      "@type": "Question", 
      "name": "什麼是六維度評分系統？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "六維度評分系統包括：技術深度與廣度(25%)、項目複雜度與影響力(25%)、專業經驗完整度(20%)、教育背景匹配度(15%)、成果與驗證(10%)、整體專業形象(5%)。"
      }
    },
    {
      "@type": "Question",
      "name": "什麼是 STAR 原則？", 
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "STAR 原則是國際認可的履歷撰寫方法論，包括 Situation(情境描述)、Task(任務界定)、Action(行動策略)、Result(成果量化)四個部分。"
      }
    }
  ]
};

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      title: "基本使用",
      icon: HelpCircle,
      color: "blue",
      faqs: [
        {
          question: "如何開始使用 RenderResume？",
          answer: "非常簡單！只需要四個步驟：1) 註冊並登入帳戶後，在首頁點擊「開始創建」 2) 上傳您的履歷檔案（支援 PDF、圖片格式）或直接貼上履歷內容 3) 等待 AI 分析完成（通常 45-60 秒）4) 查看詳細的分析報告和改進建議。5) 在 AI 智慧問答中，補齊履歷中未提及的資訊，讓您的履歷更加完整。6) 輸出 PDF 履歷，或複製連結分享給雇主。"
        },
        {
          question: "支援哪些履歷格式？",
          answer: "我們支援多種格式：PDF、圖片（jpg/jpeg/png）、以及直接複製貼上文字內容。檔案大小限制為 10MB 以內，支援中英文履歷。"
        },
        {
          question: "分析需要多長時間？",
          answer: "大部分履歷在 45-60 秒內完成分析。複雜的履歷或系統繁忙時可能需要稍長時間，但通常不會超過 1.5 分鐘。您可以在分析頁面看到即時進度。"
        },
        {
          question: "可以分析英文履歷嗎？",
          answer: "當然可以！我們的 AI 系統支援多語言履歷分析！但中英文履歷分析結果較佳。"
        }
      ]
    },
    {
      title: "分析結果",
      icon: FileText,
      color: "green",
      faqs: [
        {
          question: "六維度評分是什麼意思？",
          answer: "我們採用基於 Fortune 500 企業標準的六維度評估模型：1) 技術深度與廣度（25%）2) 項目複雜度與影響力（25%）3) 專業經驗完整度（20%）4) 教育背景匹配度（15%）5) 成果與驗證（10%）6) 整體專業形象（5%）。每個維度都有詳細的評分標準和改進建議。"
        },
        {
          question: "等第制評分如何解讀？",
          answer: "我們使用 A+ 到 F 共 11 級的等第制評分：A+ (95-100%) 卓越表現、A (90-94%) 優秀表現、A- (85-89%) 良好表現、B+ (80-84%) 中上表現、B (75-79%) 中等表現、B- (70-74%) 中下表現、C+ (65-69%) 及格表現、C (60-64%) 勉強及格、C- (55-59%) 需要改進、D (50-54%) 嚴重不足、F (0-49%) 完全不合格。"
        },
        {
          question: "STAR 原則重組是什麼？",
          answer: "STAR 原則是國際認可的經驗描述方法，由 Amazon、Google 等頂級科技公司廣泛採用：Situation（情境）- 描述工作背景；Task（任務）- 說明具體任務；Action（行動）- 詳述採取的行動；Result（結果）- 量化成果與影響。此方法最初由行為面試專家開發，現已成為 Fortune 500 企業和頂級獵頭公司的標準評估框架。我們的 AI 會幫您將工作經驗重新組織成 STAR 格式，讓履歷更有說服力。"
        },
      ]
    },
    {
      title: "隱私安全",
      icon: Shield,
      color: "purple",
      faqs: [
        {
          question: "上傳的履歷會被保存嗎？",
          answer: "測試版：上傳的履歷僅用於分析目的，分析完成後會立即從我們的伺服器刪除，不會儲存、分享或用於其他目的。正式版：將提供履歷管理與分享功能，您的履歷將被安全儲存，方便您管理多個版本和與雇主分享。我們承諾採用業界最高標準保護您的隱私資料，所有數據都會經過加密處理。"
        },
        {
          question: "個人資料會如何處理？",
          answer: "我們嚴格遵循隱私權政策，僅收集必要的分析資料。所有數據傳輸都使用 SSL 加密，儲存採用業界標準加密技術。您可以隨時要求刪除帳戶和相關資料。"
        },
        {
          question: "AI 會學習我的履歷內容嗎？",
          answer: "我們的 AI 模型已經完成訓練，不會使用您的個人履歷內容進行學習或訓練。您的履歷內容僅用於生成個人化的分析報告，不會成為訓練資料的一部分。"
        }
      ]
    },
    {
      title: "技術問題",
      icon: Zap,
      color: "yellow",
      faqs: [
        {
          question: "上傳檔案失敗怎麼辦？",
          answer: "請檢查：1) 檔案格式是否為 PDF 或圖片 2) 檔案大小是否超過 10MB 3) 網路連線是否穩定 4) 瀏覽器是否支援檔案上傳。如果問題持續，請嘗試重新整理頁面或聯繫客服。"
        },
        {
          question: "分析卡在某個步驟怎麼辦？",
          answer: "如果分析進度停滯超過 3 分鐘，請嘗試：1) 重新整理頁面 2) 重新上傳履歷 3) 檢查網路連線 4) 嘗試使用不同瀏覽器。如果問題仍然存在，請聯繫我們的技術支援團隊。"
        },
        {
          question: "支援哪些瀏覽器？",
          answer: "我們支援所有現代瀏覽器：Chrome、Firefox、Safari、Edge 的最新版本。建議使用 Chrome 以獲得最佳體驗。不支援 Internet Explorer。"
        },
        {
          question: "手機可以使用嗎？",
          answer: "可以！我們的網站採用響應式設計，支援手機和平板電腦使用。不過，由於履歷檔案通常較複雜，建議在電腦上使用以獲得最佳體驗。"
        }
      ]
    },
    {
      title: "帳戶管理",
      icon: Users,
      color: "indigo",
      faqs: [
        {
          question: "如何註冊帳戶？",
          answer: "點擊「註冊」按鈕，使用 Google 帳號註冊，或填寫電子郵件地址並設定密碼即可。我們會發送驗證郵件到您的信箱，請點擊驗證連結完成註冊流程。"
        },
        {
          question: "忘記密碼怎麼辦？",
          answer: "在登入頁面點擊「忘記密碼」，輸入您的電子郵件地址，我們會發送重設密碼的連結到您的信箱。請檢查垃圾郵件資料夾。"
        },
        {
          question: "可以更改電子郵件地址嗎？",
          answer: "目前暫不支援更改電子郵件地址。如果需要更改，請聯繫客服協助處理，或註冊新帳戶。"
        },
        {
          question: "如何刪除帳戶？",
          answer: "如果您希望刪除帳戶，請透過客服信箱聯繫我們。我們會在確認身份後協助您刪除帳戶和所有相關資料。"
        }
      ]
    },
    {
      title: "費用相關",
      icon: CreditCard,
      color: "pink",
      faqs: [
        {
          question: "使用費用如何計算？",
          answer: "測試版將提供免費的 Waitlist 搶先體驗服務。正式版本將推出多種方案：免費方案、Pro 方案。具體方案內容將在正式上線後公布。"
        },
        {
          question: "有免費試用嗎？",
          answer: "是的！註冊即可免費體驗完整的履歷分析功能。測試期間享受完全免費的服務，讓您充分體驗我們的 AI 分析能力。"
        },
        {
          question: "支援哪些付款方式？",
          answer: "正式版將支援信用卡、金融卡、Apple Pay、Google Pay 等多種付款方式。我們使用安全的第三方支付服務，不會儲存您的金融資訊。"
        }
      ]
    }
  ];

  const allFaqs = faqCategories.flatMap((category, categoryIndex) => 
    category.faqs.map((faq, faqIndex) => ({
      ...faq,
      categoryIndex,
      faqIndex,
      category: category.title,
      globalIndex: categoryIndex * 1000 + faqIndex
    }))
  );

  const filteredFaqs = searchQuery 
    ? allFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
      green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
      purple: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
      yellow: "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400",
      indigo: "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400",
      pink: "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <>
      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto flex p-4 py-8">
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400"
          >
            返回首頁
          </Link>
        </div>

        <main className="container mx-auto px-4 pb-12 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              常見問題
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              快速找到您需要的答案，讓使用更加順暢
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜尋問題..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Search Results */}
          {filteredFaqs && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                搜尋結果 ({filteredFaqs.length} 個結果)
              </h2>
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div key={faq.globalIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => toggleItem(faq.globalIndex)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {faq.question}
                        </h3>
                        <span className="text-sm text-cyan-600 dark:text-cyan-400">
                          {faq.category}
                        </span>
                      </div>
                      {openItems.includes(faq.globalIndex) ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    
                    {openItems.includes(faq.globalIndex) && (
                      <div className="px-6 pb-4">
                        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Sections */}
          {!searchQuery && (
            <div className="space-y-8">
              {faqCategories.map((category, categoryIndex) => (
                <section key={categoryIndex}>
                  <div className="flex items-center mb-6">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center mr-4 ${getColorClasses(category.color)}`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {category.title}
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => {
                      const globalIndex = categoryIndex * 1000 + faqIndex;
                      return (
                        <div key={faqIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() => toggleItem(globalIndex)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
                          >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                              {faq.question}
                            </h3>
                            {openItems.includes(globalIndex) ? (
                              <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            )}
                          </button>
                          
                          {openItems.includes(globalIndex) && (
                            <div className="px-6 pb-4">
                              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* Contact Section */}
          <section className="mt-16 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              還有其他問題？
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              找不到您要的答案嗎？我們的客服團隊隨時為您提供協助
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:info@render-resume.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
              >
                聯絡客服
              </a>
              <a 
                href="https://forms.gle/XdYUd8wRrqS5WJw59"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-cyan-600 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950 rounded-lg transition-colors"
              >
                提交意見
              </a>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row gap-4 text-center">
              <Link
                href="/about"
                className="text-cyan-600 hover:text-cyan-700 underline underline-offset-4"
              >
                關於我們
              </Link>
              <Link
                href="/help"
                className="text-cyan-600 hover:text-cyan-700 underline underline-offset-4"
              >
                使用說明
              </Link>
              <Link
                href="/privacy"
                className="text-cyan-600 hover:text-cyan-700 underline underline-offset-4"
              >
                隱私權政策
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 