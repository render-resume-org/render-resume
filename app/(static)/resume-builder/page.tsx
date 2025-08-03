"use client";


import {
  CheckCircle,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ResumeBuilderPage() {


  const faqs = [
    {
      question: "什麼是專業履歷？撰寫履歷的目的是什麼？",
      answer: "專業履歷是您過往經歷、技能與成就的摘要，能幫助您展現自身能力並說服招聘者錄用您。撰寫履歷的目的是吸引招聘者的注意，並從應聘候選人中脫穎而出。"
    },
    {
      question: "什麼是 AI 履歷編輯器？",
      answer: "AI 履歷編輯器是一款可以幫助您快速打造專業簡歷的工具。寫履歷有很多麻煩的地方，例如研究履歷撰寫原則、設計履歷格式、調整內容呈現形式、反覆修飾文句等，這些過程非常惱人且費時，但 AI 履歷編輯器能為您代勞，您不需要任何先備知識，透過 AI 履歷顧問的引導，就能快速創建極具競爭力的履歷。"
    },
    {
      question: "能使用 ChatGPT 創建履歷嗎？RenderResume 有何優勢？",
      answer: "如今大多數求職者都在求職過程中使用了 AI，但是並不建議單純使用 ChatGPT 創建簡歷。ChatGPT 是一款通用的 LLM，並不精通於為您量身定制專業履歷。RenderResume 的 AI 履歷編輯器使用 ChatGPT 的 AI 模型，並經過專業的履歷撰寫訓練，精通於為您量身定制專業履歷，並確保履歷寫法都遵循業界的最佳實踐。"
    },
    {
      question: "上傳的個人資料會被如何處理？",
      answer: "我們非常注重用戶隱私，您上傳的一切資料都僅用於分析產生針對您個人履歷的優化建議。我們不會將您的資料用於訓練我們的模型，也不會用於任何其他用途。所有資料的傳輸與儲存都會經過妥善加密保護。"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section - 根據附圖設計 */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        {/* 中心標題區域 */}
        <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              <span className="block">使用 RenderResume 的</span>
              <span className="block">
                <span className="text-cyan-600 underline decoration-cyan-400 decoration-2 underline-offset-4">AI 履歷編輯器</span>
                打造完美履歷
              </span>
            </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
            不需任何準備，經過專業訓練的 AI 會以問答的方式引導你，幫你快速打造最佳履歷！
          </p>
          <Link 
              href="/auth/sign-up"
              className="inline-flex items-center px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white text-lg font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              立即建立履歷 - 免費！
          </Link>
        </div>
      </section>

      {/* Section 1: 快速導入各式資訊 */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 左側內容 */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              快速導入各式資訊
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              不必從零開始。您可以直接上傳既有履歷、作品集、專案文件、設計稿等各種與經歷有關的素材，系統能精準識別並提取關鍵資訊。
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">支援 PDF、JPG、PNG 等多種檔案格式</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">智能識別</span>
              </div>
            </div>
          </div>

          {/* 右側圖示 */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-64 h-64 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
              <div className="text-white text-6xl">📄</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: 精準分析履歷優缺 */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 左側圖示 */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="w-64 h-64 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
              <div className="text-white text-6xl">🔍</div>
            </div>
          </div>

          {/* 右側內容 */}
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              精準分析履歷優缺
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              對比 Fortune 500 企業錄取者的履歷，客觀分析您履歷的競爭力。讓您清楚了解當前履歷的優劣勢，並掌握明確的改進方向。
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">Fortune 500 標準</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">競爭力分析</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: AI 問答輕鬆優化履歷 */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 左側內容 */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              AI 問答輕鬆優化履歷
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              RenderResume 的 AI 就像專業的履歷顧問，透過對話的方式引導你提供資訊，並將其轉化成精確且引人注目的文句。
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">智能問答</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">個性化建議</span>
              </div>
            </div>
          </div>

          {/* 右側圖示 */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-64 h-64 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
              <div className="text-white text-6xl">💬</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: 套用專業履歷模板 */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 左側圖示 */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="w-64 h-64 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <div className="text-white text-6xl">📋</div>
            </div>
          </div>

          {/* 右側內容 */}
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              套用專業履歷模板
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              不需操心樣式設計。提供業界主流的履歷模板，適配各種應徵追蹤系統 (ATS)，有效提升通過履歷初篩的機會。
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">專業模板</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">ATS 友善</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            常見問題
          </h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={`item-${index}`} className="border-none">
                  <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 dark:text-white px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg hover:no-underline [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-gray-500 [&>svg]:flex-shrink-0">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-gray-700 dark:text-gray-300 leading-relaxed px-6 pb-4">
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link 
            href="/faq"
            className="inline-flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            查看更多常見問題
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}