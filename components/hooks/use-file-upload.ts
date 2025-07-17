"use client";

import {
  UploadedFile,
  clearUploadSession,
  generateFileId,
  getFileType,
  processFilesForAnalysis,
  saveToSession
} from '@/lib/upload-utils';
import { pdfToImg } from 'pdftoimg-js/browser';
import { useCallback, useEffect, useState } from 'react';

export function useFileUpload(serviceType: 'create' | 'optimize' = 'create') {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [additionalText, setAdditionalText] = useState('');

  // Clear previous session data on mount
  useEffect(() => {
    clearUploadSession();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log('📁 [File Upload Hook] Files dropped:', {
      filesCount: acceptedFiles.length,
      fileNames: acceptedFiles.map(f => f.name),
      fileSizes: acceptedFiles.map(f => f.size),
      fileTypes: acceptedFiles.map(f => f.type),
      serviceType
    });

    // 先建立暫存物件，稍後補 preview
    const newFiles: UploadedFile[] = acceptedFiles.map(file => {
      const fileType = getFileType(file);
      return {
        id: generateFileId(),
        file,
        type: fileType,
        status: 'uploading',
        preview: undefined, // 稍後補
        serviceType
      };
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // 處理每個檔案
    for (const uploadFile of newFiles) {
      try {
        if (uploadFile.type === 'pdf') {
          // PDF file - always convert to images
          console.log(`🔄 [File Upload Hook] Converting PDF to images: ${uploadFile.file.name} (service type: ${serviceType})`);
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === uploadFile.id 
                ? { ...f, status: 'converting' }
                : f
            )
          );

          await processPDFToImages(uploadFile);
        } else if (uploadFile.file.type.startsWith('image/')) {
          // Image 檔案，轉 base64
          const base64 = await fileToBase64(uploadFile.file);
          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === uploadFile.id
                ? { ...f, status: 'completed', preview: base64 }
                : f
            )
          );
        } else {
          // 其他檔案
          setTimeout(() => {
            setUploadedFiles(prev => 
              prev.map(f => 
                f.id === uploadFile.id 
                  ? { ...f, status: 'completed' }
                  : f
              )
            );
          }, 1000);
        }
      } catch (error) {
        console.error('文件處理失敗:', error);
        setUploadedFiles(prev =>
          prev.map(f =>
            f.id === uploadFile.id
              ? { ...f, status: 'error' }
              : f
          )
        );
      }
    }
  }, [serviceType]);

  // 新增：file 轉 base64 helper
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const processPDFToImages = async (uploadFile: UploadedFile) => {
    const pdfUrl = URL.createObjectURL(uploadFile.file);
    
    try {
      console.log(`🖼️ [File Upload Hook] Converting PDF to images: ${uploadFile.file.name}`);
      const convertedImages = await pdfToImg(pdfUrl, {
        imgType: 'png',
        scale: 2,
        maxWidth: 4096,
        maxHeight: 4096,
        pages: 'all'
      });
      
      console.log(`✅ [File Upload Hook] PDF converted to ${convertedImages.length} images: ${uploadFile.file.name}`);
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'completed', convertedImages }
            : f
        )
      );
    } finally {
      URL.revokeObjectURL(pdfUrl);
    }
  };

  const removeFile = useCallback((id: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const prepareForAnalysis = useCallback(async () => {
    console.log('🚀 [File Upload Hook] Starting file preparation for analysis');
    console.log('📊 [File Upload Hook] Current state:', {
      uploadedFilesCount: uploadedFiles.length,
      additionalTextLength: additionalText.length,
      serviceType,
      canProceed: uploadedFiles.length > 0 && uploadedFiles.every(f => f.status === 'completed')
    });
    
    if (uploadedFiles.length === 0) {
      console.warn('⚠️ [File Upload Hook] No files to process');
      throw new Error('No files to process');
    }
    
    setIsProcessing(true);
    
    try {
      console.log('📋 [File Upload Hook] Preparing files data');
      
      const allFilesData = await processFilesForAnalysis(uploadedFiles);
      
      console.log('📄 [File Upload Hook] All files data prepared:', allFilesData.map(f => ({
        id: f.id,
        name: f.name,
        type: f.type,
        isFromPdf: f.isFromPdf || false
      })));

      saveToSession(allFilesData, additionalText, serviceType);
      
      console.log('🏁 [File Upload Hook] File preparation process completed');
      return allFilesData;
    } catch (error) {
      console.error('❌ [File Upload Hook] Error preparing files:', error);
      if (error instanceof Error) {
        console.error('❌ [File Upload Hook] Error message:', error.message);
        console.error('❌ [File Upload Hook] Error stack:', error.stack);
      }
      throw new Error('準備文件時發生錯誤，請重試');
    } finally {
      setIsProcessing(false);
    }
  }, [uploadedFiles, additionalText, serviceType]);

  const canProceed = uploadedFiles.length > 0 && uploadedFiles.every(f => f.status === 'completed');

  return {
    uploadedFiles,
    isProcessing,
    additionalText,
    setAdditionalText,
    onDrop,
    removeFile,
    prepareForAnalysis,
    canProceed
  };
} 