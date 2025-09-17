"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { formatFileSize, UploadedFile } from "@/lib/upload-utils";
import { cn } from "@/utils";
import { AlertCircle, FileText, X } from "lucide-react";
import Image from 'next/image';
import React, { useState } from "react";
import { createPortal } from "react-dom";

interface UploadedFilesListProps {
  uploadedFiles: UploadedFile[];
  onRemoveFile: (id: string) => void;
}

export function UploadedFilesList({ uploadedFiles, onRemoveFile }: UploadedFilesListProps) {
  const [preview, setPreview] = useState<{
    fileId: string;
    images: string[];
    index: number;
  } | null>(null);

  const handleOpenPreview = (fileId: string, images: string[], index: number) => {
    setPreview({ fileId, images, index });
  };

  const handleClosePreview = () => setPreview(null);

  const handlePrev = () => {
    if (preview && preview.index > 0) {
      setPreview({ ...preview, index: preview.index - 1 });
    }
  };
  const handleNext = () => {
    if (preview && preview.index < preview.images.length - 1) {
      setPreview({ ...preview, index: preview.index + 1 });
    }
  };

  if (uploadedFiles.length === 0) return null;

  return (
    <Card className="border-none mb-2 shadow-none">
      <CardHeader>
        <CardDescription>
          {uploadedFiles.length} 個文件已上傳
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {uploadedFiles.map((uploadFile) => (
            <div 
              key={uploadFile.id} 
              className={cn(`relative flex flex-col space-y-4 p-4 rounded-lg transition-all`,
                uploadFile.status === 'uploading' || uploadFile.status === 'converting'
                  ? 'border-2 border-cyan-200 dark:border-cyan-800' 
                  : 'border border-gray-200 dark:border-gray-700'
              )}
            >
              <div className="relative z-10 flex items-center space-x-4 w-full bg-white dark:bg-gray-800 rounded-lg">
                {/* File Icon/Preview */}
                <div className="flex-shrink-0">
                  {uploadFile.type === 'image' && uploadFile.preview ? (
                    <Image 
                      width={128}
                      height={128}
                      src={uploadFile.preview} 
                      alt="Preview" 
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                      <FileText className="h-6 w-6 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-grow">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {uploadFile.file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(uploadFile.file.size)} MB
                    {uploadFile.type === 'pdf' && uploadFile.convertedImages && (
                      <span className="ml-2 text-cyan-600">
                        → {uploadFile.convertedImages.length} 張圖片
                      </span>
                    )}
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center space-x-2">
                  {uploadFile.status === 'uploading' && (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-cyan-600 dark:text-cyan-400">上傳中</span>
                    </div>
                  )}
                  {uploadFile.status === 'converting' && (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-orange-600 dark:text-orange-400">轉換中</span>
                    </div>
                  )}
                  {uploadFile.status === 'completed' && (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">✅</span>
                      <span className="text-sm text-green-600">完成</span>
                    </div>
                  )}
                  {uploadFile.status === 'error' && (
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="text-sm text-red-600">錯誤</span>
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(uploadFile.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* PDF Converted Images Preview */}
              {uploadFile.type === 'pdf' && uploadFile.convertedImages && uploadFile.convertedImages.length > 0 && (
                <div className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {uploadFile.convertedImages.slice(0, 8).map((img, index) => (
                      <div key={index} className="relative cursor-pointer group" onClick={() => handleOpenPreview(uploadFile.id, uploadFile.convertedImages!, index)}>
                        <Image 
                          width={128}
                          height={128}
                          src={img}   
                          alt={`PDF頁面 ${index + 1}`}
                          className="w-full h-24 object-cover rounded border group-hover:opacity-80 transition"
                        />
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                    {uploadFile.convertedImages.length > 8 && (
                      <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 rounded border flex items-center justify-center">
                        <span className="text-sm text-gray-500">
                          +{uploadFile.convertedImages.length - 8} 更多
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      {/* Fullscreen Image Preview Modal */}
      {preview && (
        <FullscreenImagePreview
          images={preview.images}
          index={preview.index}
          onClose={handleClosePreview}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </Card>
  );
} 

// Compact single file card for Smart Chat and other usages
interface UploadedFileCardProps {
  file: UploadedFile;
  onRemove: (id: string) => void;
  onPreview?: (images: string[], index: number) => void;
  className?: string;
}

export function UploadedFileCard({ file, onRemove, onPreview, className }: UploadedFileCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 p-2 rounded border bg-white dark:bg-gray-800',
        file.status === 'uploading' || file.status === 'converting'
          ? 'border-cyan-200 dark:border-cyan-800'
          : 'border-gray-200 dark:border-gray-700',
        className
      )}
      style={{ minWidth: 0 }}
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 cursor-pointer" onClick={() => {
        if (file.type === 'image' && file.preview && onPreview) {
          onPreview([file.preview], 0);
        } else if (file.type === 'pdf' && file.convertedImages && file.convertedImages.length > 0 && onPreview) {
          onPreview(file.convertedImages, 0);
        }
      }}>
        {file.type === 'image' && file.preview ? (
          <Image width={40} height={40} src={file.preview} alt="Preview" className="w-10 h-10 object-cover rounded" />
        ) : file.type === 'pdf' && file.convertedImages && file.convertedImages.length > 0 ? (
          <Image width={40} height={40} src={file.convertedImages[0]} alt="PDF 預覽" className="w-10 h-10 object-cover rounded border" />
        ) : (
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
            <FileText className="h-5 w-5 text-gray-600" />
          </div>
        )}
      </div>
      {/* Info */}
      <div className="flex-grow min-w-0">
        <div className="truncate font-medium text-gray-900 dark:text-white text-sm">{file.file.name}</div>
        <div className="text-xs text-gray-500 truncate">{formatFileSize(file.file.size)} MB</div>
        {file.type === 'pdf' && file.convertedImages && (
          <div className="text-[10px] text-cyan-600 truncate">{file.convertedImages.length} 頁</div>
        )}
      </div>
      {/* Status */}
      <div className="flex items-center">
        {file.status === 'uploading' && (
          <div className="w-3 h-3 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin mr-1" />
        )}
        {file.status === 'converting' && (
          <div className="w-3 h-3 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mr-1" />
        )}
        {file.status === 'completed' && (
          <span className="text-green-600 text-xs mr-1">完成</span>
        )}
        {file.status === 'error' && (
          <AlertCircle className="w-4 h-4 text-red-600 mr-1" />
        )}
      </div>
      {/* Remove */}
      <Button variant="ghost" size="icon" onClick={() => onRemove(file.id)} className="text-gray-400 hover:text-red-600 ml-1">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

// FullscreenImagePreview component
interface FullscreenImagePreviewProps {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function FullscreenImagePreview({ images, index, onClose, onPrev, onNext }: FullscreenImagePreviewProps) {
  // Prevent SSR/React hydration mismatch
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  // Keyboard navigation
  React.useEffect(() => {
    if (!mounted) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mounted, onPrev, onNext, onClose]);
  if (!mounted || typeof window === 'undefined' || !document.body) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Mask (rounded, clickable to close) */}
      <div
        className="absolute inset-0 bg-black bg-opacity-80 transition-all"
        style={{ pointerEvents: 'auto' }}
        onClick={onClose}
      />
      {/* Modal content (stop propagation to prevent closing when clicking inside) */}
      <div
        className="relative z-10 max-w-3xl w-full flex flex-col items-center"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-white text-2xl p-2 hover:bg-black/30 rounded"
          onClick={onClose}
          aria-label="Close preview"
        >
          <X className="h-8 w-8" />
        </button>
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl p-2 hover:bg-black/30 rounded disabled:opacity-30"
          onClick={onPrev}
          disabled={index === 0}
          aria-label="Previous image"
        >
          &#8592;
        </button>
        <Image
          src={images[index]}
          alt={`PDF頁面 ${index + 1}`}
          width={800}
          height={1000}
          className="max-h-[80vh] w-auto rounded shadow-lg"
        />
        <div className="mt-2 text-white text-sm">
          {index + 1} / {images.length}
        </div>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl p-2 hover:bg-black/30 rounded disabled:opacity-30"
          onClick={onNext}
          disabled={index === images.length - 1}
          aria-label="Next image"
        >
          &#8594;
        </button>
      </div>
    </div>,
    document.body
  );
} 

export { FullscreenImagePreview };
