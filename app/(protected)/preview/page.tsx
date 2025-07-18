"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import { cn } from "@/lib/utils";
import {
  Award,
  Briefcase,
  Calendar,
  Code,
  Copy,
  Edit,
  FileText,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Printer,
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeData, setResumeData] = useState<OptimizedResume | null>(null);
  const [originalAnalysis, setOriginalAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);

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
  }, [originalAnalysis, selectedSuggestions]);

  // 當原始分析和建議都準備好，且還沒有優化履歷時自動生成
  useEffect(() => {
    if (originalAnalysis && selectedSuggestions.length > 0 && !resumeData) {
      generateOptimizedResume();
    }
  }, [originalAnalysis, selectedSuggestions, resumeData, generateOptimizedResume]);

  const copyResumeText = useCallback(async () => {
    if (!resumeData) return;

    try {
      // 構建履歷文字內容
      let resumeText = `${resumeData.personalInfo.fullName}\n`;
      resumeText += `${resumeData.personalInfo.title}\n\n`;
      
      // 聯絡資訊
      if (resumeData.personalInfo.email) resumeText += `Email: ${resumeData.personalInfo.email}\n`;
      if (resumeData.personalInfo.phone) resumeText += `Phone: ${resumeData.personalInfo.phone}\n`;
      if (resumeData.personalInfo.location) resumeText += `Location: ${resumeData.personalInfo.location}\n`;
      if (resumeData.personalInfo.website) resumeText += `Website: ${resumeData.personalInfo.website}\n`;
      if (resumeData.personalInfo.linkedin) resumeText += `LinkedIn: ${resumeData.personalInfo.linkedin}\n`;
      if (resumeData.personalInfo.github) resumeText += `GitHub: ${resumeData.personalInfo.github}\n`;
      
      resumeText += `\n專業摘要\n${resumeData.summary}\n\n`;
      
      // 技能
      resumeText += `技術技能\n`;
      resumeData.skills.forEach(skillGroup => {
        resumeText += `${skillGroup.category}: ${skillGroup.items.join(', ')}\n`;
      });
      resumeText += '\n';
      
      // 工作經驗
      resumeText += `工作經驗\n`;
      resumeData.experience.forEach(exp => {
        resumeText += `${exp.title} - ${exp.company} (${exp.period})\n`;
        exp.achievements.forEach(achievement => {
          resumeText += `• ${achievement}\n`;
        });
        resumeText += '\n';
      });
      
      // 專案經驗
      if (resumeData.projects.length > 0) {
        resumeText += `專案經驗\n`;
        resumeData.projects.forEach(project => {
          resumeText += `${project.name}\n`;
          resumeText += `${project.description}\n`;
          resumeText += `技術: ${project.technologies.join(', ')}\n`;
          project.achievements.forEach(achievement => {
            resumeText += `• ${achievement}\n`;
          });
          resumeText += '\n';
        });
      }
      
      // 教育背景
      resumeText += `教育背景\n`;
      resumeData.education.forEach(edu => {
        resumeText += `${edu.degree} - ${edu.school} (${edu.period})\n`;
        if (edu.details) {
          edu.details.forEach(detail => {
            resumeText += `• ${detail}\n`;
          });
        }
        resumeText += '\n';
      });

      // 複製到剪貼簿
      await navigator.clipboard.writeText(resumeText);
      setCopySuccess(true);
      
      // 3秒後重置狀態
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (error) {
      console.error('複製失敗:', error);
      alert('複製失敗，請手動選擇文字複製');
    }
  }, [resumeData]);

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
      <div className="min-h-screen py-8 flex items-center justify-center">
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
              onClick={() => router.push('/service-selection')}
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
    <div className="min-h-screen py-8">
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
            
            {/* Download Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">列印/下載</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => window.print()}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  列印/下載 PDF
                </Button>
              </CardContent>
            </Card>

            {/* Copy Resume Text */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">複製文字</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={copyResumeText}
                  variant={copySuccess ? "default" : "outline"}
                  className={cn(
                    "w-full",
                    copySuccess 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                  disabled={copySuccess}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copySuccess ? "已複製！" : "複製履歷文字"}
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  複製純文字格式的履歷內容到剪貼簿
                </p>
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
            <Card className="shadow-lg p-0">
              <CardContent className="p-0">
                {/* Resume Document */}
                <div className="bg-white dark:bg-gray-800 p-8 min-h-[1000px] h-fit" id="resume-content">
                  {/* Header */}
                  <div className="border-b-2 border-cyan-600 pb-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {resumeData.personalInfo.fullName}
                    </h1>
                    <h2 className="text-xl text-cyan-600 mb-4">
                      {resumeData.personalInfo.title}
                    </h2>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                      {resumeData.personalInfo.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {resumeData.personalInfo.email}
                        </div>
                      )}
                      {resumeData.personalInfo.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {resumeData.personalInfo.phone}
                        </div>
                      )}
                      {resumeData.personalInfo.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {resumeData.personalInfo.location}
                        </div>
                      )}
                      {resumeData.personalInfo.website && (
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-1" />
                          {resumeData.personalInfo.website}
                        </div>
                      )}
                      {resumeData.personalInfo.linkedin && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
                          {resumeData.personalInfo.linkedin}
                        </div>
                      )}
                      {resumeData.personalInfo.github && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.415-4.042-1.415-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576 4.765-1.588 8.199-6.084 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                          {resumeData.personalInfo.github}
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
                  {/* Footer - Made with RenderResume */}
                  <div className="flex w-full items-center justify-center gap-1 mt-12 text-xs text-gray-400 dark:text-gray-500 text-center select-none print:mt-8" style={{ letterSpacing: '0.04em' }}>
                    <p>
                      made with
                    </p>
                    <p className="font-semibold text-cyan-600 dark:text-cyan-400">
                      RenderResume
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 w-full text-center">
                    www.render-resume.com
                  </div>
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