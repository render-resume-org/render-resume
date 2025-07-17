"use client";

import { useFileUpload } from "@/components/hooks/use-file-upload";
import { UploadIllustration } from "@/components/svg-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdditionalTextInput } from "@/components/upload/additional-text-input";
import { UploadDropzone } from "@/components/upload/upload-dropzone";
import { UploadedFilesList } from "@/components/upload/uploaded-files-list";
import { ArrowRight } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UploadOptimizePage() {
  const router = useRouter();
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
  } = useFileUpload('optimize');

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleNext = async () => {
    try {
      await prepareForAnalysis();
      console.log('🧑‍💻 [Upload Optimize Page] Navigating to analyze page');
      router.push('/analyze');
    } catch (error) {
      console.error('❌ [Upload Optimize Page] Error in handleNext:', error);
      alert(error instanceof Error ? error.message : '準備文件時發生錯誤，請重試');
    }
  };

  // Dynamic content based on service type
  const getPageContent = () => {
    return {
      title: '上傳您的履歷文件',
      subtitle: '專業優化現有履歷',
      description: '上傳您現有的履歷或 CV 文件，AI 將分析內容並提供專業的優化建議和改進方案。',
      color: {
        border: 'border-orange-300 dark:border-orange-600',
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        text: 'text-orange-600 dark:text-orange-400',
        button: 'bg-orange-500 hover:bg-orange-600'
      }
    };
  };

  const pageContent = getPageContent();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Upload Card */}
        <Card className={`mb-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } $`}>
          <CardHeader className="text-center">
            <div className={`w-48 h-48 mx-auto mb-4 flex items-center justify-center transition-all duration-500 delay-300`}>
              <UploadIllustration mainColor={'#fb923c'} width={256} height={256} />
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
              borderActiveClass={'border-orange-500'}
              bgActiveClass={'bg-orange-50 dark:bg-orange-950'}
              borderHoverClass={'hover:border-orange-400'}
              iconClass={'text-orange-400'}
              textActiveClass={'text-orange-600 dark:text-orange-400'}
            />
            <UploadedFilesList 
              uploadedFiles={uploadedFiles} 
              onRemoveFile={removeFile} 
            />
          </CardContent>
        </Card>

        {/* Additional Text Section */}
        <AdditionalTextInput 
          value={additionalText}
          onChange={setAdditionalText}
        />

        {/* Action Buttons */}
        <div className={`flex justify-between items-center transition-all duration-700 delay-900 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
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
            className={`${pageContent.color.button} text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
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