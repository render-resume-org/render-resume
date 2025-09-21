"use client";

import { ServiceCard } from "@/features/resume/components";
import { CreateResumeIcon } from "@/components/svg-icon/create-resume-icon";
import { OptimizeResumeIcon } from "@/components/svg-icon/optimize-resume-icon";
import { clearSessionData } from "@/services/storage";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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

  // 清除之前的智慧問答會話數據
  useEffect(() => {
    clearSessionData();
  }, []);

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
          <ServiceCard
            icon={<CreateResumeIcon />}
            title={PAGE_CONTENT.services.create.title}
            description={PAGE_CONTENT.services.create.description}
            buttonText={PAGE_CONTENT.services.create.buttonText}
            buttonColor="bg-cyan-500 hover:bg-cyan-600"
            className="hover:border-cyan-300 dark:hover:border-cyan-600 border-2"
            onClick={() => handleServiceSelect('create')}
          />
          <ServiceCard
            icon={<OptimizeResumeIcon />}
            title={PAGE_CONTENT.services.optimize.title}
            description={PAGE_CONTENT.services.optimize.description}
            buttonText={PAGE_CONTENT.services.optimize.buttonText}
            buttonColor="bg-orange-300 hover:bg-orange-400"
            className="hover:border-orange-300 dark:hover:border-orange-600 border-2"
            onClick={() => handleServiceSelect('optimize')}
          />
        </div>

       
      </div>
    </div>
  );
} 