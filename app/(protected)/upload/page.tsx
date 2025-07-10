"use client";

import { useFileUpload } from "@/components/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { AdditionalTextInput } from "@/components/upload/additional-text-input";
import { UploadDropzone } from "@/components/upload/upload-dropzone";
import { UploadTips } from "@/components/upload/upload-tips";
import { UploadedFilesList } from "@/components/upload/uploaded-files-list";
import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UploadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serviceType, setServiceType] = useState<'create' | 'optimize'>('create');
  
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
  }, [searchParams, router]);

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
        description: '上傳作品截圖、專案報告書、技能證明或任何能展示您能力的材料。AI將自動分析並提取重要信息來打造您的履歷。',
        tips: '建議上傳：作品截圖、專案文件、技能證書、作品集等展示材料'
      };
    } else {
      return {
        title: '上傳您的履歷文件',
        description: '上傳您現有的履歷或CV文件，AI將分析內容並提供專業的優化建議和改進方案。',
        tips: '請上傳：履歷PDF、CV文件等，建議避免包含過多圖片的文件以確保最佳分析效果'
      };
    }
  };

  const pageContent = getPageContent();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {pageContent.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {pageContent.description}
          </p>
          <p className="text-sm text-cyan-600 dark:text-cyan-400 max-w-2xl mx-auto mt-2">
            {pageContent.tips}
          </p>
        </div>

        {/* Upload Dropzone */}
        <UploadDropzone onDrop={onDrop} />

        {/* Uploaded Files List */}
        <UploadedFilesList 
          uploadedFiles={uploadedFiles} 
          onRemoveFile={removeFile} 
        />

        {/* Additional Text Input */}
        <AdditionalTextInput 
          value={additionalText}
          onChange={setAdditionalText}
        />

        {/* Upload Tips */}
        <UploadTips />

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => router.push('/service-selection')}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            返回選擇
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={!canProceed || isProcessing}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
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