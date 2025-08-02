"use client";


import {
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Check,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Search
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/footer";

export default function ResumeBuilderPage() {


  const faqs = [
    {
      question: "上傳的履歷會被保存嗎？",
      answer: "測試版：上傳的履歷僅用於分析目的，分析完成後即刻刪除，不會儲存在我們的伺服器上。正式版：將提供履歷管理與分享功能，您的履歷將被安全儲存，方便您管理多個版本和與雇主分享。我們承諾採用業界最高標準保護您的隱私資料。"
    },
    {
      question: "分析需要多長時間？",
      answer: "通常在 45 秒內完成分析。複雜的履歷可能需要稍長時間，但不會超過 1 分鐘。"
    },
    {
      question: "支援哪些檔案格式？",
      answer: "目前支援 PDF、圖片（jpg/jpeg/png）格式，也可以直接複製貼上履歷內容進行分析。"
    },
    {
      question: "分析結果準確嗎？",
      answer: "我們的 AI 模型基於大量真實履歷數據訓練，並參考 Fortune 500 企業標準。雖然無法保證 100% 準確，但能提供有價值的參考意見。"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section - 圖中的組件配置 */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 左側內容 */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                <span className="block">打造最佳履歷。</span>
                <span className="block">獲得更多機會。</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                使用 AI 技術打造量身定制的履歷，識別缺失的關鍵字，並獲得個人化的優化建議，一切只需幾個點擊。
              </p>
            </div>
            
            <div className="space-y-4">
              <Link 
                href="/auth/sign-up"
                className="inline-flex items-center px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white text-lg font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                立即建立履歷 - 免費！
              </Link>
            </div>
          </div>

          {/* 右側產品視覺展示 */}
          <div className="relative">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
              {/* 頂部功能標籤 */}
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">
                  <Check className="h-3 w-3 mr-1 text-green-600" />
                  量身定制履歷
                </div>
                <div className="flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">
                  <Check className="h-3 w-3 mr-1 text-green-600" />
                  識別缺失關鍵字
                </div>
                <div className="flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">
                  <Check className="h-3 w-3 mr-1 text-green-600" />
                  使用 AI 量身定制
                </div>
              </div>

              {/* 瀏覽器視窗 */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* 瀏覽器標題欄 */}
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                      <ArrowLeft className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                      <ArrowRight className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                      <RotateCcw className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center bg-white dark:bg-gray-700 rounded-lg px-3 py-1 border border-gray-200 dark:border-gray-600">
                      <Search className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">搜尋...</span>
                    </div>
                  </div>
                </div>

                {/* 瀏覽器內容區域 */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* 左側：職位資訊 */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                          <span className="text-white font-bold text-sm">A</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">airbnb</span>
                      </div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        軟體工程師
                      </div>
                      
                      {/* 進度條 */}
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{width: '85%'}}></div>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{width: '70%'}}></div>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{width: '90%'}}></div>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{width: '60%'}}></div>
                        </div>
                      </div>
                    </div>

                    {/* 右側：關鍵字匹配 */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">關鍵字匹配</span>
                        </div>
                        <button className="px-3 py-1 bg-cyan-500 text-white text-xs rounded-full">
                          <Check className="h-3 w-3" />
                        </button>
                      </div>
                      
                      {/* 進度條 */}
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{width: '95%'}}></div>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{width: '80%'}}></div>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{width: '75%'}}></div>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{width: '90%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              使用說明
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              簡單四步驟，讓 AI 為您打造專業履歷
            </p>
          </div>

          {/* Operation Guide */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              操作說明
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  步驟 1：上傳作品文件
                </h3>
                <div className="text-gray-700 dark:text-gray-300 space-y-2">
                  <p>支援的檔案格式：</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>PDF 格式文件（履歷、作品集、專案文件）</li>
                    <li>圖片格式（JPG、JPEG、PNG）- 截圖、設計稿等</li>
                    <li>直接輸入文字內容描述您的作品或專案</li>
                  </ul>
                  <p className="mt-3">
                    <strong>上傳方式：</strong>點擊選擇檔案、拖拽檔案至上傳區域，或直接貼上文字內容。
                  </p>
                  <p>
                    <strong>注意事項：</strong>確保文件清晰可讀，建議檔案大小不超過 10MB。
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  步驟 2：內容辨識與分析
                </h3>
                <div className="text-gray-700 dark:text-gray-300 space-y-2">
                  <p>系統將自動進行：</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>使用 AI 技術解析上傳的文件內容</li>
                    <li>提取關鍵信息：技術技能、專案經驗、成就等</li>
                    <li>識別專業背景和能力領域</li>
                    <li>分析內容的完整性和專業度</li>
                  </ul>
                  <p className="mt-3">
                    此階段通常需要 30-60 秒，系統會顯示分析進度。
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  步驟 3：專業評分
                </h3>
                <div className="text-gray-700 dark:text-gray-300 space-y-2">
                  <p>獲得詳細的評分報告：</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>總體評分：</strong>F 到 A+ 的等第制評分</li>
                    <li><strong>六大維度分析：</strong>技術深度、專案影響力、專業經驗、教育背景、成果驗證、整體形象</li>
                    <li><strong>詳細評語：</strong>針對每個維度的具體分析和建議</li>
                    <li><strong>改進建議：</strong>具體的優化方向和實用技巧</li>
                  </ul>
                  <p className="mt-3">
                    評分基於業界標準和大量真實案例數據分析。
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  步驟 4：智能問答對話
                </h3>
                <div className="text-gray-700 dark:text-gray-300 space-y-2">
                  <p>AI 會主動詢問補充資料：</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>AI 分析後發現的資訊缺漏或不明確之處</li>
                    <li>針對特定技能或專案經驗的進一步詳情</li>
                    <li>重要成就或數據的具體量化資訊</li>
                    <li>教育背景、工作經歷的完整性確認</li>
                  </ul>
                  <p className="mt-3">
                    透過問答互動，AI 能獲得更完整的資訊，提供更精準的評估和建議。
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  步驟 5：生成專業預覽
                </h3>
                <div className="text-gray-700 dark:text-gray-300 space-y-2">
                  <p>獲得完整的專業展示：</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>優化建議預覽：</strong>根據分析結果生成的改進版本</li>
                    <li><strong>專業排版：</strong>美觀且符合業界標準的格式</li>
                    <li><strong>可分享連結：</strong>生成專屬連結供雇主或合作夥伴查看</li>
                    <li><strong>下載功能：</strong>匯出 PDF 格式的完整報告</li>
                  </ul>
                  <p className="mt-3">
                    預覽版本可作為正式求職或專案展示的參考範本。
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💡 專業提示</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• 建議上傳多種類型的作品文件以獲得更全面的分析</li>
                <li>• 在步驟 4 的問答環節中積極提問，獲得更具針對性的建議</li>
                <li>• 可以多次使用服務來追蹤改進進度</li>
                <li>• 生成的預覽可作為與專業人士討論的基礎</li>
                <li>• 建議定期更新作品內容，保持與最新成就同步</li>
              </ul>
            </div>
          </section>



          {/* Tips & Best Practices */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              使用技巧
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    最佳實踐
                  </h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 dark:text-gray-300">確保履歷內容完整且最新</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 dark:text-gray-300">包含具體的數字和成果</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 dark:text-gray-300">使用清晰的格式和排版</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 dark:text-gray-300">重點突出核心技能和經驗</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    注意事項
                  </h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 dark:text-gray-300">避免使用模糊不清的描述</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 dark:text-gray-300">檢查是否有錯字或語法錯誤</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 dark:text-gray-300">確保個人資訊的隱私安全</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 dark:text-gray-300">定期更新履歷內容</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ Preview */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              常見問題
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
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
        </div>
      </main>

      <Footer />
    </div>
  );
} 