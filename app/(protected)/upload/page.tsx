"use client";

import { useFileUpload } from "@/components/hooks/use-file-upload";
import { UploadIllustration } from "@/components/svg-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdditionalTextInput } from "@/components/upload/additional-text-input";
import { UploadDropzone } from "@/components/upload/upload-dropzone";
import { UploadedFilesList } from "@/components/upload/uploaded-files-list";
import { ArrowRight, FileUp, Zap } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UploadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serviceType, setServiceType] = useState<'create' | 'optimize'>('create');
  const [isVisible, setIsVisible] = useState(false);
  
  const {
    uploadedFiles,
    isProcessing,
    additionalText,
    setAdditionalText,
    onDrop,
    removeFile,
    prepareForAnalysis,
    canProceed
  } = useFileUpload(serviceType);

  useEffect(() => {
    const type = searchParams.get('type') as 'create' | 'optimize';
    if (type === 'create' || type === 'optimize') {
      setServiceType(type);
    } else {
      // If no valid type, redirect to service selection
      router.push('/service-selection');
    }
    
    // Trigger animation after component mounts
    setTimeout(() => setIsVisible(true), 100);
  }, [searchParams, router]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNext = async () => {
    try {
      await prepareForAnalysis();
      console.log('🧭 [Upload Page] Navigating to analyze page');
      router.push('/analyze');
    } catch (error) {
      console.error('❌ [Upload Page] Error in handleNext:', error);
      alert(error instanceof Error ? error.message : '準備文件時發生錯誤，請重試');
    }
  };

  // Dynamic content based on service type
  const getPageContent = () => {
    if (serviceType === 'create') {
      return {
        title: '上傳您的作品材料',
        subtitle: '從零打造專業履歷',
        description: '上傳作品截圖、專案報告書、技能證明或任何能展示您能力的材料。AI 將自動分析並提取重要信息來打造您的履歷。',
        tips: '建議上傳：作品截圖、專案文件、技能證書、作品集等展示材料',
        icon: <Zap className="w-6 h-6" />,
        color: {
          border: 'border-cyan-300 dark:border-cyan-600',
          bg: 'bg-cyan-50 dark:bg-cyan-900/20',
          text: 'text-cyan-600 dark:text-cyan-400',
          button: 'bg-cyan-600 hover:bg-cyan-700'
        }
      };
    } else {
      return {
        title: '上傳您的履歷文件',
        subtitle: '專業優化現有履歷',
        description: '上傳您現有的履歷或 CV 文件，AI 將分析內容並提供專業的優化建議和改進方案。',
        tips: '請上傳：履歷 PDF、CV 文件等，建議避免包含過多圖片的文件以確保最佳分析效果',
        icon: <FileUp className="w-6 h-6" />,
        color: {
          border: 'border-orange-300 dark:border-orange-600',
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          text: 'text-orange-600 dark:text-orange-400',
          button: 'bg-orange-500 hover:bg-orange-600'
        }
      };
    }
  };

  const pageContent = getPageContent();

  return (
    <div className="min-h-screen py-2 md:py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Card */}
        <Card className={`mb-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } $`}>
          <CardHeader className="text-center">
            <div className={`w-48 h-48 mx-auto mb-4 flex items-center justify-center transition-all duration-500 delay-300`}>
              <UploadIllustration mainColor={serviceType === 'create' ? '#06b6d4' : '#fb923c'} width={256} height={256} />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {pageContent.title}
            </CardTitle>
            <div className="flex justify-center">
              <div className={`w-fit text-center inline-block px-3 py-1 rounded-full text-sm font-medium ${pageContent.color.bg} ${pageContent.color.text} mb-3`}>
                {pageContent.subtitle}
              </div>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {pageContent.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <UploadDropzone
              onDrop={onDrop}
              borderActiveClass={serviceType === 'create' ? 'border-cyan-500' : 'border-orange-500'}
              bgActiveClass={serviceType === 'create' ? 'bg-cyan-50 dark:bg-cyan-950' : 'bg-orange-50 dark:bg-orange-950'}
              borderHoverClass={serviceType === 'create' ? 'hover:border-cyan-400' : 'hover:border-orange-400'}
              iconClass={serviceType === 'create' ? 'text-cyan-400' : 'text-orange-400'}
              textActiveClass={serviceType === 'create' ? 'text-cyan-600 dark:text-cyan-400' : 'text-orange-600 dark:text-orange-400'}
            />
            <UploadedFilesList 
              uploadedFiles={uploadedFiles} 
              onRemoveFile={removeFile} 
            />
          </CardContent>
        </Card>

        {/* Upload Section */}


        {/* Additional Text Section */}
          <AdditionalTextInput 
            value={additionalText}
            onChange={setAdditionalText}
          />

        {/* Tips Section
        <Card className={`mb-8 transition-all duration-700 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700`}>
          <CardContent className="pt-6">
            <UploadTips />
          </CardContent>
        </Card> */}

        {/* Action Buttons */}
        <div
          className={`flex w-full justify-between items-center gap-x-4 transition-all duration-700 delay-900 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Button
            variant="outline"
            onClick={() => router.push('/service-selection')}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-all duration-300"
          >
            返回選擇
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed || isProcessing}
            aria-busy={isProcessing}
            className={`${pageContent.color.button} text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]`}
          >
            {isProcessing ? (
              <>
                <span className="mr-2 flex items-center">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </span>
                準備中...
              </>
            ) : (
              <>
                開始分析
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 