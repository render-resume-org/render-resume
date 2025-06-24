"use client";

// 關鍵！禁用靜態生成，因為包含 Supabase 相關組件
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useFileUpload } from "@/components/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { AdditionalTextInput } from "@/components/upload/additional-text-input";
import { UploadDropzone } from "@/components/upload/upload-dropzone";
import { UploadTips } from "@/components/upload/upload-tips";
import { UploadedFilesList } from "@/components/upload/uploaded-files-list";
import { ArrowRight } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  
  const {
    uploadedFiles,
    isProcessing,
    additionalText,
    setAdditionalText,
    onDrop,
    removeFile,
    prepareForAnalysis,
    canProceed
  } = useFileUpload();

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            上傳您的作品
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            上傳作品說明文件、截圖或任何能展示您能力的材料。AI將自動分析並提取重要信息。
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
            onClick={() => router.push('/')}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            返回首頁
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