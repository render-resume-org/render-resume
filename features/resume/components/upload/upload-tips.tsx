"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UploadTips() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg">上傳建議</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <span className="text-lg mt-1">📄</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">項目文檔</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                包含項目描述、技術棧、成果的文檔或PDF
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-lg mt-1">🖼️</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">截圖展示</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                產品界面、代碼截圖、設計作品等
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-lg mt-1">📋</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">PDF 文件</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                履歷、作品集、報告等，將自動轉換為圖片傳送給AI分析
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 