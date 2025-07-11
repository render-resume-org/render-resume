"use client";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { DROPZONE_CONFIG } from "@/lib/upload-utils";
import { Upload } from "lucide-react";
import { useDropzone } from 'react-dropzone';

interface UploadDropzoneProps {
  onDrop: (files: File[]) => void;
  borderActiveClass?: string;
  bgActiveClass?: string;
  borderHoverClass?: string;
  iconClass?: string;
  textActiveClass?: string;
}

export function UploadDropzone({
  onDrop,
  borderActiveClass = '',
  bgActiveClass = '',
  borderHoverClass = '',
  iconClass = '',
  textActiveClass = '',
}: UploadDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    ...DROPZONE_CONFIG
  });

  return (
    <Card className="p-0 mb-2 border-none shadow-none">
      <CardHeader>
        <CardDescription className="text-center">
          支援圖片 (PNG, JPG, GIF, WebP) 和 PDF 文件，PDF 將自動轉換為圖片供AI分析，最大 10MB
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer
            ${isDragActive 
              ? `${borderActiveClass} ${bgActiveClass}`
              : 'border-gray-300 dark:border-gray-600'}
            ${borderHoverClass}
          `}
        >
          <input {...getInputProps()} />
          <Upload className={`h-12 w-12 mx-auto mb-4 ${iconClass}`} />
          {isDragActive ? (
            <p className={`text-lg ${textActiveClass}`}>
              鬆開以上傳文件
            </p>
          ) : (
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
                拖拽文件到這裡，或點擊選擇文件
              </p>
              <p className="text-sm text-gray-500">
                支持多個文件同時上傳
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 