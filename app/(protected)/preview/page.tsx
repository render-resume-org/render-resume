"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import {
    Award,
    Briefcase,
    Calendar,
    Code,
    Download,
    Edit,
    FileText,
    Globe,
    GraduationCap,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Printer,
    RefreshCw,
    Save,
    Settings,
    Share2,
    Star,
    UserCircle
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  timestamp: string;
}

interface OptimizedResume {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  experience: Array<{
    title: string;
    company: string;
    period: string;
    achievements: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    achievements: string[];
    duration?: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    period: string;
    details?: string[];
  }>;
  achievements?: Array<{
    title: string;
    description: string;
    date?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }>;
}

export default function PreviewPage() {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeData, setResumeData] = useState<OptimizedResume | null>(null);
  const [originalAnalysis, setOriginalAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [targetRole, setTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // 載入原始分析結果
      const analysisResult = sessionStorage.getItem('analysisResult');
      if (analysisResult) {
        try {
          const analysis: ResumeAnalysisResult = JSON.parse(analysisResult);
          setOriginalAnalysis(analysis);
        } catch (error) {
          console.error('Error parsing analysis result:', error);
        }
      }

      // 載入選中的建議
      const suggestions = localStorage.getItem('selectedSuggestions');
      if (suggestions) {
        try {
          const suggestionData: OptimizationSuggestion[] = JSON.parse(suggestions);
          setSelectedSuggestions(suggestionData);
        } catch (error) {
          console.error('Error parsing selected suggestions:', error);
        }
      }

      // 檢查是否已有優化過的履歷
      const optimizedResume = sessionStorage.getItem('optimizedResume');
      if (optimizedResume) {
        try {
          const resume: OptimizedResume = JSON.parse(optimizedResume);
          setResumeData(resume);
        } catch (error) {
          console.error('Error parsing optimized resume:', error);
        }
      } else {
        // 如果沒有優化過的履歷，需要在依賴準備好後生成
        // 這個邏輯將在另一個 useEffect 中處理
      }
    };

    loadData();
  }, []);

  const generateOptimizedResume = useCallback(async () => {
    if (!originalAnalysis || selectedSuggestions.length === 0) {
      console.error('Missing required data for optimization');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('🚀 [Preview] Starting resume optimization');
      
      const response = await fetch('/api/optimize-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisResult: originalAnalysis,
          selectedSuggestions,
          targetRole: targetRole || undefined,
          targetCompany: targetCompany || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const optimizedResume = result.data.optimizedResume;
        setResumeData(optimizedResume);
        
        // 保存到 sessionStorage
        sessionStorage.setItem('optimizedResume', JSON.stringify(optimizedResume));
        
        console.log('✅ [Preview] Resume optimization completed');
      } else {
        console.error('❌ [Preview] Optimization failed:', result.error);
        alert('履歷優化失敗：' + result.error);
      }
    } catch (error) {
      console.error('❌ [Preview] Optimization error:', error);
      alert('履歷優化過程中發生錯誤');
    } finally {
      setIsGenerating(false);
    }
  }, [originalAnalysis, selectedSuggestions, targetRole, targetCompany]);

  // 當原始分析和建議都準備好，且還沒有優化履歷時自動生成
  useEffect(() => {
    if (originalAnalysis && selectedSuggestions.length > 0 && !resumeData) {
      generateOptimizedResume();
    }
  }, [originalAnalysis, selectedSuggestions, resumeData, generateOptimizedResume]);

  const handleRegenerate = async () => {
    // 清除現有的優化履歷
    sessionStorage.removeItem('optimizedResume');
    setResumeData(null);
    
    // 重新生成
    await generateOptimizedResume();
  };

  const saveResumeData = () => {
    if (resumeData) {
      sessionStorage.setItem('optimizedResume', JSON.stringify(resumeData));
      setIsEditing(false);
      alert('履歷已保存！');
    }
  };

  const handleDownload = async (format: 'pdf' | 'docx') => {
    if (!resumeData) {
      alert('履歷資料未準備好，請稍後再試');
      return;
    }

    setIsDownloading(true);
    // 模擬下載過程
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 這裡可以實現實際的PDF/DOCX生成和下載
    const link = document.createElement('a');
    link.href = '#'; // 實際應用中這裡會是生成的文件URL
    link.download = `resume_${resumeData.personalInfo.fullName}_${Date.now()}.${format}`;
    link.click();
    
    setIsDownloading(false);
  };

  const handleShare = () => {
    if (!resumeData) {
      alert('履歷資料未準備好，請稍後再試');
      return;
    }

    // 實現分享功能
    if (navigator.share) {
      navigator.share({
        title: `${resumeData.personalInfo.fullName}的履歷`,
        text: '查看我的專業履歷',
        url: window.location.href
      });
    } else {
      // 複製到剪貼板
      navigator.clipboard.writeText(window.location.href);
      alert('履歷連結已複製到剪貼板！');
    }
  };

  // 如果正在生成履歷，顯示加載畫面
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            AI 正在優化您的履歷...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            請稍候，這可能需要幾秒鐘時間
          </p>
        </div>
      </div>
    );
  }

  // 如果沒有履歷數據，顯示錯誤狀態
  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            履歷數據未找到
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            請返回上一步選擇優化建議，或重新開始流程。
          </p>
          <div className="space-y-2">
            <Button 
              onClick={() => router.push('/suggestions')}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
            >
              返回建議選擇
            </Button>
            <Button 
              onClick={() => router.push('/upload')}
              variant="outline"
              className="w-full"
            >
              重新開始
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <span className="text-5xl">✨</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI 優化履歷
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            基於 {selectedSuggestions.length} 個優化建議生成的專業履歷，您可以進一步編輯和下載。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Target Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  優化設定
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="targetRole">目標職位</Label>
                  <Input
                    id="targetRole"
                    placeholder="例：前端工程師"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="targetCompany">目標公司</Label>
                  <Input
                    id="targetCompany"
                    placeholder="例：Google"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  重新生成
                </Button>
              </CardContent>
            </Card>
            
            {/* Edit Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Edit className="w-5 h-5 mr-2" />
                  編輯履歷
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Sheet open={isEditing} onOpenChange={setIsEditing}>
                  <SheetTrigger asChild>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      編輯內容
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>編輯履歷內容</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-6 mt-6">
                      {/* Personal Info */}
                      <div>
                        <h4 className="font-medium mb-3">個人資訊</h4>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="fullName">姓名</Label>
                            <Input
                              id="fullName"
                              value={resumeData.personalInfo.fullName}
                              onChange={(e) => setResumeData({
                                ...resumeData,
                                personalInfo: { ...resumeData.personalInfo, fullName: e.target.value }
                              })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="title">職稱</Label>
                            <Input
                              id="title"
                              value={resumeData.personalInfo.title}
                              onChange={(e) => setResumeData({
                                ...resumeData,
                                personalInfo: { ...resumeData.personalInfo, title: e.target.value }
                              })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              value={resumeData.personalInfo.email}
                              onChange={(e) => setResumeData({
                                ...resumeData,
                                personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                              })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">電話</Label>
                            <Input
                              id="phone"
                              value={resumeData.personalInfo.phone}
                              onChange={(e) => setResumeData({
                                ...resumeData,
                                personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                              })}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div>
                        <h4 className="font-medium mb-3">專業摘要</h4>
                        <Textarea
                          value={resumeData.summary}
                          onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                          rows={4}
                        />
                      </div>

                      <Button onClick={saveResumeData} className="w-full">
                        <Save className="w-4 h-4 mr-2" />
                        保存變更
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </CardContent>
            </Card>

            {/* Download Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">下載選項</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => handleDownload('pdf')}
                  disabled={isDownloading}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                >
                  {isDownloading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  下載 PDF
                </Button>
                
                <Button 
                  onClick={() => handleDownload('docx')}
                  disabled={isDownloading}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  下載 Word
                </Button>

                <Button 
                  onClick={handleShare}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  分享履歷
                </Button>

                <Button 
                  onClick={() => window.print()}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  列印履歷
                </Button>
              </CardContent>
            </Card>

            {/* Applied Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">已套用建議</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedSuggestions.slice(0, 3).map((suggestion, index) => (
                    <div key={index} className="text-sm">
                      <Badge variant="secondary" className="text-xs mb-1">
                        {suggestion.category}
                      </Badge>
                      <p className="text-gray-600 dark:text-gray-300">{suggestion.title}</p>
                    </div>
                  ))}
                  {selectedSuggestions.length > 3 && (
                    <p className="text-xs text-gray-500">
                      和其他 {selectedSuggestions.length - 3} 個建議...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">快速操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => router.push('/suggestions')}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  返回建議
                </Button>
                
                <Button 
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <UserCircle className="w-4 h-4 mr-2" />
                  返回首頁
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Resume Preview */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardContent className="p-0">
                {/* Resume Document */}
                <div className="bg-white dark:bg-gray-800 p-8 min-h-[1000px]" id="resume-content">
                  {/* Header */}
                  <div className="border-b-2 border-cyan-600 pb-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {resumeData.personalInfo.fullName}
                    </h1>
                    <h2 className="text-xl text-cyan-600 mb-4">
                      {resumeData.personalInfo.title}
                    </h2>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {resumeData.personalInfo.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {resumeData.personalInfo.phone}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {resumeData.personalInfo.location}
                      </div>
                      {resumeData.personalInfo.website && (
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-1" />
                          {resumeData.personalInfo.website}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <UserCircle className="w-5 h-5 mr-2 text-cyan-600" />
                      專業摘要
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {resumeData.summary}
                    </p>
                  </section>

                  {/* Skills */}
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Code className="w-5 h-5 mr-2 text-cyan-600" />
                      技術技能
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {resumeData.skills.map((skillGroup, index) => (
                        <div key={index}>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            {skillGroup.category}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {skillGroup.items.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 text-xs rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Experience */}
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-cyan-600" />
                      工作經驗
                    </h3>
                    <div className="space-y-4">
                      {resumeData.experience.map((exp, index) => (
                        <div key={index} className="border-l-2 border-cyan-200 dark:border-cyan-800 pl-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {exp.title}
                              </h4>
                              <p className="text-cyan-600 font-medium">{exp.company}</p>
                            </div>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {exp.period}
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {exp.achievements.map((achievement, achIndex) => (
                              <li key={achIndex} className="text-gray-700 dark:text-gray-300 text-sm flex items-start">
                                <Star className="w-3 h-3 mr-2 mt-1 text-yellow-500 flex-shrink-0" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Projects */}
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-cyan-600" />
                      專案經驗
                    </h3>
                    <div className="space-y-4">
                      {resumeData.projects.map((project, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            {project.name}
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <ul className="space-y-1">
                            {project.achievements.map((achievement, achIndex) => (
                              <li key={achIndex} className="text-gray-700 dark:text-gray-300 text-sm flex items-start">
                                <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full mr-2 mt-2 flex-shrink-0" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Education */}
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-cyan-600" />
                      教育背景
                    </h3>
                    <div className="space-y-3">
                      {resumeData.education.map((edu, index) => (
                        <div key={index} className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {edu.degree}
                            </h4>
                            <p className="text-cyan-600">{edu.school}</p>
                            {edu.details && edu.details.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-1">
                                {edu.details.map((detail, detailIndex) => (
                                  <span key={detailIndex} className="text-gray-600 dark:text-gray-400 text-sm">
                                    {detail}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {edu.period}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={() => router.push('/dashboard')}
            size="lg"
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8"
          >
            返回儀表板
          </Button>
        </div>
      </div>
    </div>
  );
} 