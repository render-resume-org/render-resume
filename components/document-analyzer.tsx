'use client';

import { formatFileSize, getFileTypeCategory, getTotalFileSize, requiresVisionModel, validateFileType } from '@/lib/client/file-utils';
import Image from 'next/image';
import React, { useCallback, useRef, useState } from 'react';

interface FileWithPreview extends File {
    preview?: string;
    category?: 'PDF' | 'IMAGES' | 'DOCUMENTS' | null;
}

export default function DocumentAnalyzer() {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [additionalText, setAdditionalText] = useState('');
    const [useVision, setUseVision] = useState(true);
    const [analysisResultJson, setAnalysisResultJson] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 處理文件選擇
    const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
        if (!selectedFiles) return;

        const newFiles: FileWithPreview[] = [];
        const errors: string[] = [];

        Array.from(selectedFiles).forEach(file => {
            // 檢查是否已存在相同文件
            if (files.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)) {
                errors.push(`文件已存在: ${file.name}`);
                return;
            }

            if (!validateFileType(file.name)) {
                errors.push(`不支援的文件類型: ${file.name}`);
                return;
            }

            if (file.size > 10 * 1024 * 1024) { // 10MB 限制
                errors.push(`文件過大: ${file.name} (最大 10MB)`);
                return;
            }

            const fileWithPreview = file as FileWithPreview;
            fileWithPreview.category = getFileTypeCategory(file.name);

            // 為圖片文件創建預覽
            if (fileWithPreview.category === 'IMAGES') {
                fileWithPreview.preview = URL.createObjectURL(file);
            }

            newFiles.push(fileWithPreview);
        });

        if (errors.length > 0) {
            setError(errors.join('\n'));
        } else {
            setError(null);
        }

        setFiles(prev => [...prev, ...newFiles]);

        // 自動檢測是否需要 Vision 模型
        const allFiles = [...files, ...newFiles];
        if (requiresVisionModel(allFiles)) {
            setUseVision(true);
        }
    }, [files]);

    // 拖拽處理
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        handleFileSelect(e.dataTransfer.files);
    }, [handleFileSelect]);

    // 移除文件
    const removeFile = useCallback((index: number) => {
        setFiles(prev => {
            const newFiles = [...prev];
            const removedFile = newFiles[index];
            
            // 清理預覽 URL
            if (removedFile.preview) {
                URL.revokeObjectURL(removedFile.preview);
            }
            
            newFiles.splice(index, 1);
            
            // 重新檢查是否需要 Vision 模型
            if (!requiresVisionModel(newFiles)) {
                setUseVision(false);
            }
            
            return newFiles;
        });
    }, []);

    // 清空所有文件
    const clearFiles = useCallback(() => {
        files.forEach(file => {
            if (file.preview) {
                URL.revokeObjectURL(file.preview);
            }
        });
        setFiles([]);
        setUseVision(true);
        setError(null);
    }, [files]);

    // 執行分析
    const handleAnalyze = async () => {
        if (files.length === 0) {
            setError('請至少上傳一個文件');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResultJson('');
        setUploadProgress(0);

        try {
            const formData = new FormData();
            files.forEach(f => formData.append('files', f));
            if (additionalText) formData.append('additionalText', additionalText);
            formData.append('useVision', String(useVision));
            formData.append('serviceType', 'create');

            // 模擬上傳進度
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            const res = await fetch('/api/analyze/create', { method: 'POST', body: formData });

            clearInterval(progressInterval);
            setUploadProgress(100);

            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || `HTTP ${res.status}`);
            setAnalysisResultJson(JSON.stringify(data.data, null, 2));
            
            // 顯示成功訊息
            setTimeout(() => {
                setUploadProgress(0);
            }, 1000);
        } catch (err) {
            console.error('Document analysis error:', err);
            setError(err instanceof Error ? err.message : '文檔分析失敗');
            setUploadProgress(0);
        } finally {
            setIsLoading(false);
        }
    };

    // 計算統計資訊
    const totalSize = getTotalFileSize(files);
    const needsVision = requiresVisionModel(files);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">文檔履歷分析器</h2>
                    {files.length > 0 && (
                        <div className="text-sm text-gray-500">
                            {files.length} 個文件 • {formatFileSize(totalSize)}
                        </div>
                    )}
                </div>
                
                {/* 文件上傳區域 */}
                <div className="space-y-4">
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                            isDragOver 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="space-y-4">
                            <div className="text-4xl">📄</div>
                            <div>
                                <p className="text-lg font-medium text-gray-700">
                                    拖拽文件到此處或點擊選擇文件
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    支援 PDF、圖片 (JPG, PNG, WebP) 和文字文檔 (TXT, MD, JSON, CSV)
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    最大文件大小: 10MB • 建議一次上傳不超過 5 個文件
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                            >
                                選擇文件
                            </button>
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.txt,.md,.json,.csv"
                        onChange={(e) => handleFileSelect(e.target.files)}
                        className="hidden"
                    />
                </div>

                {/* 已選擇的文件列表 */}
                {files.length > 0 && (
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-700">
                                已選擇的文件 ({files.length})
                            </h3>
                            <button
                                onClick={clearFiles}
                                disabled={isLoading}
                                className="text-sm text-red-600 hover:text-red-800 disabled:text-gray-400"
                            >
                                清空所有
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {files.map((file, index) => (
                                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatFileSize(file.size)} • {file.category}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeFile(index)}
                                            disabled={isLoading}
                                            className="ml-2 text-red-500 hover:text-red-700 disabled:text-gray-400"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    
                                    {/* 圖片預覽 */}
                                    {file.preview && (
                                        <div className="mt-2">
                                            <Image
                                                src={file.preview || '/placeholder-image.png'}
                                                alt={`Preview of ${file.name}`}
                                                width={40}
                                                height={40}
                                                className="object-cover rounded"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 額外設定 */}
                <div className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="additionalText" className="block text-sm font-medium text-gray-700 mb-2">
                            額外資訊 (可選)
                        </label>
                        <textarea
                            id="additionalText"
                            value={additionalText}
                            onChange={(e) => setAdditionalText(e.target.value)}
                            disabled={isLoading}
                            placeholder="輸入任何額外的背景資訊或特殊要求..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            rows={3}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="useVision"
                                checked={useVision}
                                onChange={(e) => setUseVision(e.target.checked)}
                                disabled={isLoading || needsVision}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="useVision" className="ml-2 text-sm text-gray-700">
                                使用 Vision 模型處理 PDF 和圖片
                                {needsVision && <span className="text-blue-600 ml-1">(必需)</span>}
                            </label>
                        </div>
                        
                        {needsVision && (
                            <div className="text-xs text-blue-600">
                                檢測到 PDF/圖片文件，將自動使用 Vision 模型
                            </div>
                        )}
                    </div>
                </div>

                {/* 上傳進度 */}
                {isLoading && uploadProgress > 0 && (
                    <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>上傳進度</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* 分析按鈕 */}
                <div className="mt-6">
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || files.length === 0}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                分析中...
                            </div>
                        ) : (
                            '開始分析'
                        )}
                    </button>
                </div>

                {/* 錯誤顯示 */}
                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex">
                            <div className="text-red-400 mr-2">⚠️</div>
                            <p className="text-red-800 whitespace-pre-line">{error}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* 分析結果 */}
            {analysisResultJson && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">分析結果 (JSON)</h3>
                    <pre className="text-xs whitespace-pre-wrap bg-gray-50 p-3 rounded border border-gray-200">{analysisResultJson}</pre>
                </div>
            )}
        </div>
    );
} 