"use client";


import {
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/footer";

export default function ResumeBuilderPage() {

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

      <Footer />
    </div>
  );
}