"use client";

import { Slider } from "@/components/ui/slider";
import {
  AlertCircle,
  CheckCircle,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HelpPage() {
  const [gradeValue, setGradeValue] = useState([7]); // 預設為 B+ (index 7)

  const gradeScale = [
    { grade: "F", label: "不合格", color: "text-red-800", bgColor: "bg-red-100 dark:bg-red-900/30", description: "履歷存在重大缺陷，需要全面重構內容結構與專業呈現" },
    { grade: "D", label: "嚴重不足", color: "text-red-700", bgColor: "bg-red-100 dark:bg-red-900/30", description: "基礎信息缺失嚴重，專業能力表達不清，急需改善" },
    { grade: "C-", label: "需大幅改進", color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-900/20", description: "內容組織混亂，缺乏重點突出，建議重新整理" },
    { grade: "C", label: "需改進", color: "text-red-500", bgColor: "bg-orange-50 dark:bg-orange-900/20", description: "基本信息完整但缺乏亮點，需要加強成果量化" },
    { grade: "C+", label: "待改進", color: "text-orange-600", bgColor: "bg-orange-50 dark:bg-orange-900/20", description: "結構尚可但內容平淡，建議增加具體案例與數據支撐" },
    { grade: "B-", label: "合格表現", color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-900/20", description: "滿足基本要求，但缺乏競爭優勢，可進一步優化" },
    { grade: "B", label: "尚可表現", color: "text-yellow-500", bgColor: "bg-yellow-50 dark:bg-yellow-900/20", description: "內容結構良好，專業能力清晰，但需要更多成就亮點" },
    { grade: "B+", label: "滿意表現", color: "text-lime-600", bgColor: "bg-lime-50 dark:bg-lime-900/20", description: "履歷內容豐富，專業形象佳，在多數職位中具備競爭力" },
    { grade: "A-", label: "良好表現", color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-900/20", description: "專業能力突出，成果量化清晰，易獲得面試機會" },
    { grade: "A", label: "優秀表現", color: "text-emerald-600", bgColor: "bg-emerald-50 dark:bg-emerald-900/20", description: "履歷結構完美，內容充實有力，在競爭中明顯領先" },
    { grade: "A+", label: "卓越表現", color: "text-emerald-700", bgColor: "bg-emerald-100 dark:bg-emerald-900/30", description: "頂級履歷水準，各維度表現優異，極具吸引力和說服力" }
  ];

  const currentGrade = gradeScale[gradeValue[0]];

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

          {/* Interactive Grade Scoring System */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              等第制評分系統預覽
            </h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  互動式評分預覽 (F 到 A+ 共 11 級)
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  拖拽滑塊或點擊等級，了解評級資訊
                </p>
              </div>
              
              {/* Interactive Grade Slider */}
              <div className="space-y-6">
                <div className="px-4">
                  <Slider
                    value={gradeValue}
                    onValueChange={setGradeValue}
                    max={10}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span>F (最低)</span>
                    <span>A+ (最高)</span>
                  </div>
                </div>

                {/* Current Grade Display */}
                <div className={`${currentGrade.bgColor} rounded-lg p-6 border-2 transition-all duration-300`}>
                  <div className="text-center space-y-3">
                    <div className={`text-4xl font-bold ${currentGrade.color}`}>
                      {currentGrade.grade}
                    </div>
                    <div className={`text-lg font-semibold ${currentGrade.color}`}>
                      {currentGrade.label}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                      {currentGrade.description}
                    </p>
                  </div>
                </div>

                {/* Grade Scale Reference */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-6">
                  {gradeScale.map((item, index) => (
                    <div 
                      key={index} 
                      className={`text-center p-2 rounded transition-all duration-200 cursor-pointer ${
                        index === gradeValue[0] 
                          ? `${item.bgColor} shadow-sm` 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setGradeValue([index])}
                    >
                      <div className={`text-sm font-bold ${
                        index === gradeValue[0] ? item.color : 'text-gray-500'
                      }`}>
                        {item.grade}
                      </div>
                      <div className={`text-xs ${
                        index === gradeValue[0] ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'
                      }`}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                  💡 拖拽滑塊或點擊等級查看不同評分的詳細說明
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">評分標準說明：</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• <strong>A+/A/A-</strong>：卓越至良好表現，符合頂級企業標準</li>
                  <li>• <strong>B+/B/B-</strong>：滿意至合格表現，具備基本競爭力</li>
                  <li>• <strong>C+/C/C-</strong>：待改進至需改進，建議優化內容</li>
                  <li>• <strong>D/F</strong>：不足至不合格，需要重大改善</li>
                </ul>
              </div>
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

          {/* Contact Support */}
          <section className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              需要協助？
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              如果您在使用過程中遇到任何問題，請隨時聯繫我們的客服團隊
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
                意見回饋
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
                href="/faq"
                className="text-cyan-600 hover:text-cyan-700 underline underline-offset-4"
              >
                常見問題
              </Link>
              <Link
                href="/privacy"
                className="text-cyan-600 hover:text-cyan-700 underline underline-offset-4"
              >
                隱私權政策
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 