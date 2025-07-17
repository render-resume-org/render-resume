"use client";

import { CreateResumeIcon, OptimizeResumeIcon } from "@/components/svg-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

// Static text constants
const PAGE_CONTENT = {
  title: "選擇最適合您的服務",
  backButton: "返回首頁",
  services: {
    create: {
      title: "從零打造新履歷",
      description: "還沒有履歷？上傳您的作品截圖、專案報告、技能證明等材料，AI 化身您的專業履歷建築師，從零開始打造令人印象深刻的履歷！",
      buttonText: "開始打造"
    },
    optimize: {
      title: "優化現有履歷",
      description: "已經有履歷但想更上一層樓？上傳您現有的履歷或 CV，AI 專業顧問將深度分析，提供量身定制的優化策略，讓您的履歷脫穎而出！",
      buttonText: "開始優化"
    }
  }
} as const;

export default function ServiceSelectionPage() {
  const router = useRouter();

  const handleServiceSelect = (serviceType: 'create' | 'optimize') => {
    router.push(`/upload-${serviceType}`);
  };

  return (
    <div className="bg-white dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-gray-500 dark:text-gray-300 mb-4">
            {PAGE_CONTENT.title}
          </h1>
        </div>

        {/* Service Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Create New Resume */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-cyan-300 dark:hover:border-cyan-600"
            onClick={() => handleServiceSelect('create')}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-48 h-48 mx-auto my-6">
                <CreateResumeIcon />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                {PAGE_CONTENT.services.create.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-gray-600 dark:text-gray-300 mb-6">
                {PAGE_CONTENT.services.create.description}
              </CardDescription>
              <Button 
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleServiceSelect('create');
                }}
              >
                {PAGE_CONTENT.services.create.buttonText}
              </Button>
            </CardContent>
          </Card>

          {/* Optimize Existing Resume */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-300 dark:hover:border-orange-600"
            onClick={() => handleServiceSelect('optimize')}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-48 h-48 mx-auto my-6">
                <OptimizeResumeIcon />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                {PAGE_CONTENT.services.optimize.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-gray-600 dark:text-gray-300 mb-6">
                {PAGE_CONTENT.services.optimize.description}
              </CardDescription>
              <Button 
                className="w-full bg-orange-300 hover:bg-orange-400 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleServiceSelect('optimize');
                }}
              >
                {PAGE_CONTENT.services.optimize.buttonText}
              </Button>
            </CardContent>
          </Card>
        </div>

       
      </div>
    </div>
  );
} 