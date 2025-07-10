'use client';

import { analyzeResume } from '@/lib/api/resume-analysis';
import type { ResumeAnalysisOptions, ResumeAnalysisResult } from '@/lib/types/resume-analysis';
import { useState } from 'react';

export default function ResumeAnalyzer() {
    const [resumeText, setResumeText] = useState('');
    const [additionalText, setAdditionalText] = useState('');
    const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!resumeText.trim()) {
            setError('請輸入履歷內容');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const options: ResumeAnalysisOptions = {
                resume: resumeText.trim(),
                text: additionalText.trim() || undefined
            };

            const response = await analyzeResume(options);

            if (response.success && response.data) {
                setAnalysisResult(response.data);
            } else {
                throw new Error(response.error || '分析失敗');
            }
        } catch (err) {
            console.error('Resume analysis error:', err);
            setError(err instanceof Error ? err.message : '履歷分析失敗');
        } finally {
            setIsLoading(false);
        }
    };

    const clearForm = () => {
        setResumeText('');
        setAdditionalText('');
        setAnalysisResult(null);
        setError(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">文字履歷分析器</h2>
                    {resumeText && (
                        <div className="text-sm text-gray-500">
                            {resumeText.length} 字元
                        </div>
                    )}
                </div>

                {/* 履歷內容輸入 */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="resumeText" className="block text-sm font-medium text-gray-700 mb-2">
                            履歷內容 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="resumeText"
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            disabled={isLoading}
                            placeholder="請貼上您的履歷內容，包括個人資訊、工作經驗、項目經歷、技能等..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            rows={12}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                            建議包含：個人資訊、工作經驗、項目經歷、技能、教育背景等
                        </div>
                    </div>

                    <div>
                        <label htmlFor="additionalText" className="block text-sm font-medium text-gray-700 mb-2">
                            額外資訊 (可選)
                        </label>
                        <textarea
                            id="additionalText"
                            value={additionalText}
                            onChange={(e) => setAdditionalText(e.target.value)}
                            disabled={isLoading}
                            placeholder="輸入任何額外的背景資訊、應徵職位、特殊要求等..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            rows={3}
                        />
                    </div>
                </div>

                {/* 操作按鈕 */}
                <div className="mt-6 flex space-x-4">
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || !resumeText.trim()}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
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
                    
                    <button
                        onClick={clearForm}
                        disabled={isLoading}
                        className="px-4 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 transition-colors"
                    >
                        清空
                    </button>
                </div>

                {/* 錯誤顯示 */}
                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex">
                            <div className="text-red-400 mr-2">⚠️</div>
                            <p className="text-red-800">{error}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* 分析結果 */}
            {analysisResult && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">分析結果</h3>
                        <div className="text-sm text-green-600 flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            分析完成
                        </div>
                    </div>
                    
                    {/* 個人資料 */}
                    {analysisResult.profile && (
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-gray-700 mb-3">個人資料</h4>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {analysisResult.profile.name && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">姓名: </span>
                                            <span className="text-sm text-gray-700">{analysisResult.profile.name}</span>
                                        </div>
                                    )}
                                    {analysisResult.profile.title && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">專業頭銜: </span>
                                            <span className="text-sm text-gray-700">{analysisResult.profile.title}</span>
                                        </div>
                                    )}
                                    {analysisResult.profile.email && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">電子郵件: </span>
                                            <span className="text-sm text-gray-700">{analysisResult.profile.email}</span>
                                        </div>
                                    )}
                                    {analysisResult.profile.phone && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">電話: </span>
                                            <span className="text-sm text-gray-700">{analysisResult.profile.phone}</span>
                                        </div>
                                    )}
                                    {analysisResult.profile.location && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">所在地: </span>
                                            <span className="text-sm text-gray-700">{analysisResult.profile.location}</span>
                                        </div>
                                    )}
                                    {analysisResult.profile.linkedin && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">LinkedIn: </span>
                                            <a href={analysisResult.profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 underline">
                                                {analysisResult.profile.linkedin}
                                            </a>
                                        </div>
                                    )}
                                    {analysisResult.profile.github && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">GitHub: </span>
                                            <a href={analysisResult.profile.github} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 underline">
                                                {analysisResult.profile.github}
                                            </a>
                                        </div>
                                    )}
                                    {analysisResult.profile.website && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">個人網站: </span>
                                            <a href={analysisResult.profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 underline">
                                                {analysisResult.profile.website}
                                            </a>
                                        </div>
                                    )}
                                    {analysisResult.profile.portfolio && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">作品集: </span>
                                            <a href={analysisResult.profile.portfolio} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 underline">
                                                {analysisResult.profile.portfolio}
                                            </a>
                                        </div>
                                    )}
                                </div>
                                {analysisResult.profile.brief_introduction && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <span className="text-sm font-medium text-gray-500">個人簡介: </span>
                                        <p className="text-sm text-gray-700 mt-1">{analysisResult.profile.brief_introduction}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* 項目分析 */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-700 mb-3">項目分析</h4>
                        <p className="text-gray-600 mb-4">{analysisResult.projects_summary}</p>
                        <div className="grid gap-4">
                            {analysisResult.projects.map((project, index) => (
                                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                                    <h5 className="font-medium text-gray-800">{project.name}</h5>
                                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                                    <div className="mt-2">
                                        <span className="text-xs font-medium text-gray-500">技術: </span>
                                        <span className="text-xs text-gray-700">{project.technologies.join(', ')}</span>
                                    </div>
                                    <div className="mt-1">
                                        <span className="text-xs font-medium text-gray-500">角色: </span>
                                        <span className="text-xs text-gray-700">{project.role}</span>
                                    </div>
                                    <div className="mt-1">
                                        <span className="text-xs font-medium text-gray-500">貢獻: </span>
                                        <span className="text-xs text-gray-700">{project.contribution}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 技能分析 */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-700 mb-3">技能分析</h4>
                        <p className="text-gray-600 mb-4">{analysisResult.expertise_summary}</p>
                        <div className="flex flex-wrap gap-2">
                            {analysisResult.expertise.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 工作經驗 */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-700 mb-3">工作經驗</h4>
                        <p className="text-gray-600 mb-4">{analysisResult.work_experiences_summary}</p>
                        <div className="space-y-3">
                            {analysisResult.work_experiences.map((exp, index) => (
                                <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h5 className="font-medium text-gray-800">{exp.position}</h5>
                                            <p className="text-sm text-gray-600">{exp.company}</p>
                                        </div>
                                        <span className="text-xs text-gray-500">{exp.duration}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-3">
                                        {exp.technologies && exp.technologies.length > 0 && (
                                            <div>
                                                <span className="font-medium text-gray-600">技術棧：</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {exp.technologies.map((tech, techIndex) => (
                                                        <span
                                                            key={techIndex}
                                                            className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {exp.contribution && (
                                            <div>
                                                <span className="font-medium text-gray-600">主要貢獻：</span>
                                                <p className="text-gray-800 mt-1 text-xs">{exp.contribution}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 成就 */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-3">成就</h4>
                        <p className="text-gray-600 mb-4">{analysisResult.achievements_summary}</p>
                        <ul className="list-disc list-inside space-y-1">
                            {analysisResult.achievements.map((achievement, index) => (
                                <li key={index} className="text-gray-700">{achievement}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
} 