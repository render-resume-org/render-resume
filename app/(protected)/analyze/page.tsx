"use client";

import { UploadIllustration } from "@/components/svg-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeDocuments } from "@/lib/api/resume-analysis";
import type { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import { Education, Experience, Links, PersonalInfo, Project } from "@/lib/upload-utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Bot,
  Briefcase,
  Code,
  FileText,
  GraduationCap
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface StoredFile {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: number;
  content: string; // base64
  preview?: string;
}

export default function AnalyzePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<StoredFile[]>([]);
  const [additionalText, setAdditionalText] = useState('');
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<string>('');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    address: '',
    phone: '',
    email: ''
  });
  const [links, setLinks] = useState<Links>({
    linkedin: '',
    github: '',
    portfolio: ''
  });
  const [serviceType, setServiceType] = useState<'create' | 'optimize'>('create');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStartTime, setAnalysisStartTime] = useState<number | null>(null);
  const [analysisElapsedTime, setAnalysisElapsedTime] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const steps: { id: string; title: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'content',
      title: '內容識別',
      description: 'AI正在讀取和理解您的作品內容...',
      icon: FileText,
    },
    {
      id: 'skills',
      title: '技能提取',
      description: '分析技術棧和專業技能...',
      icon: Code,
    },
    {
      id: 'achievements',
      title: '成就識別',
      description: '識別項目成果和個人成就...',
      icon: Award,
    },
    {
      id: 'experience',
      title: '經歷整理',
      description: '組織工作經驗和項目經歷...',
      icon: Briefcase,
    },
    {
      id: 'profile',
      title: '學習經歷',
      description: '提取學習經歷和學習成果...',
      icon: GraduationCap,
    },
    {
      id: 'recommendation',
      title: '評分與建議',
      description: '評分您的履歷，並提供建議...',
      icon: Bot,
    }
  ];

  // Helper function to check if an object has any non-empty values
  const hasNonEmptyValues = (obj: PersonalInfo | Links): boolean => {
    return Object.values(obj).some(value => value && value.toString().trim() !== '');
  };

  // Helper function to generate user-friendly error messages
  const getErrorMessage = (error: string): string => {
    const lowerError = error.toLowerCase();
    
    if (lowerError.includes('vision') || lowerError.includes('image') || lowerError.includes('photo')) {
      return `照片識別失敗：上傳的照片可能沒有足夠的文字內容可供AI識別。請確認照片中包含清晰的履歷文字內容，並且解析度足夠高。建議使用PDF或文字文件格式以獲得更好的識別效果。`;
    }
    
    if (lowerError.includes('resolution') || lowerError.includes('quality')) {
      return `圖片品質問題：上傳的圖片解析度過低或品質不佳，AI無法正確識別內容。請嘗試使用更高解析度的圖片，或直接上傳PDF/文字格式的履歷文件。`;
    }
    
    if (lowerError.includes('content') || lowerError.includes('text') || lowerError.includes('extract')) {
      return `內容提取失敗：AI無法從上傳的文件中提取有效內容。可能原因包括：文件格式不支援、內容過於模糊、或文件損壞。建議重新上傳清晰的履歷文件。`;
    }
    
    if (lowerError.includes('format') || lowerError.includes('type')) {
      return `文件格式錯誤：上傳的文件格式可能不受支援。建議使用PDF、Word文檔、或高解析度的圖片格式（PNG、JPG）。`;
    }
    
    if (lowerError.includes('size') || lowerError.includes('large')) {
      return `文件大小問題：上傳的文件過大或過小。請確認文件大小在合理範圍內，並包含完整的履歷內容。`;
    }
    
    if (lowerError.includes('network') || lowerError.includes('timeout') || lowerError.includes('connection')) {
      return `網路連線問題：分析過程中發生網路錯誤。請檢查網路連線狀態並重試。`;
    }
    
    // Default error message
    return `分析失敗：${error}。可能原因包括：文件內容無法識別、圖片解析度過低、文件格式不支援等。請檢查上傳的文件是否包含清晰的履歷內容，並考慮使用PDF或文字格式重新上傳。`;
  };

  const startAnalysis = useCallback(async (files: StoredFile[], additionalText: string, education: Education[], experience: Experience[], projects: Project[], skills: string, personalInfo: PersonalInfo, links: Links, serviceType: 'create' | 'optimize') => {
          console.log('🚀 [Analyze Page] Starting analysis with:', {
        filesCount: files.length,
        fileNames: files.map(f => f.name),
        additionalTextLength: additionalText.length,
        educationCount: education.length,
        experienceCount: experience.length,
        projectsCount: projects.length,
        skillsLength: skills.length,
        personalInfoKeys: Object.keys(personalInfo),
        linksKeys: Object.keys(links),
        serviceType
      });
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysisStartTime(Date.now());
    setAnalysisElapsedTime(0);
    
    try {
      console.log('🔄 [Analyze Page] Converting base64 back to File objects');
      // 將 base64 轉換回 File 對象
      const fileObjects = files.map(storedFile => {
        console.log(`📄 [Analyze Page] Converting file: ${storedFile.name}`);
        const base64Data = storedFile.content.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        
        const file = new File([byteArray], storedFile.name, {
          type: storedFile.type,
          lastModified: storedFile.lastModified
        });
        
        console.log(`✅ [Analyze Page] File converted: ${file.name} (${file.size} bytes)`);
        return file;
      });

      console.log('⏱️ [Analyze Page] Starting step animation');
      // 開始步驟動畫
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) {
            console.log(`📈 [Analyze Page] Step progress: ${prev + 1}/${steps.length}`);
            return prev + 1;
          } else {
            clearInterval(stepInterval);
            return prev;
          }
        });
      }, 4500);

      console.log('🤖 [Analyze Page] Calling analyzeDocuments API');
      // 執行實際的文檔分析
      const response = await analyzeDocuments({
        files: fileObjects,
        additionalText: additionalText || undefined,
        education: education.length > 0 ? education : undefined,
        experience: experience.length > 0 ? experience : undefined,
        projects: projects.length > 0 ? projects : undefined,
        skills: skills || undefined,
        personalInfo: hasNonEmptyValues(personalInfo) ? personalInfo : undefined,
        links: hasNonEmptyValues(links) ? links : undefined,
        useVision: true,
        serviceType: serviceType
      });

      console.log('📋 [Analyze Page] API response received:', {
        success: response.success,
        hasData: !!response.data,
        error: response.error
      });

      clearInterval(stepInterval);
      
      if (response.success && response.data) {
        console.log('✅ [Analyze Page] Analysis successful');
        console.log('📊 [Analyze Page] Result keys:', Object.keys(response.data));
        setAnalysisResult(response.data);
        setCurrentStep(steps.length - 1);
        setAnalysisComplete(true);
      } else {
        console.error('❌ [Analyze Page] Analysis failed:', response.error);
        const userFriendlyError = getErrorMessage(response.error || '分析失敗');
        throw new Error(userFriendlyError);
      }
    } catch (error) {
      console.error('❌ [Analyze Page] Analysis error:', error);
      if (error instanceof Error) {
        console.error('❌ [Analyze Page] Error message:', error.message);
        console.error('❌ [Analyze Page] Error stack:', error.stack);
      }
      const errorMessage = error instanceof Error ? error.message : '分析過程中發生錯誤';
      setError(getErrorMessage(errorMessage));
    } finally {
      setIsAnalyzing(false);
      setAnalysisStartTime(null);
      console.log('🏁 [Analyze Page] Analysis process completed');
    }
  }, [steps.length]);

  // Timer effect to update elapsed time
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    
    if (isAnalyzing && analysisStartTime) {
      intervalId = setInterval(() => {
        setAnalysisElapsedTime(Math.floor((Date.now() - analysisStartTime) / 1000));
      }, 1000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAnalyzing, analysisStartTime]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    console.log('🔍 [Analyze Page] Component mounted, checking for stored files');
    const storedFilesData = sessionStorage.getItem('uploadedFiles');
    const storedAdditionalText = sessionStorage.getItem('additionalText');
    const storedEducation = sessionStorage.getItem('education');
    const storedExperience = sessionStorage.getItem('experience');
    const storedProjects = sessionStorage.getItem('projects');
    const storedSkills = sessionStorage.getItem('skills');
    const storedPersonalInfo = sessionStorage.getItem('personalInfo');
    const storedLinks = sessionStorage.getItem('links');
    const storedServiceType = sessionStorage.getItem('serviceType');
    
    if (storedFilesData) {
      console.log('📦 [Analyze Page] Found stored files data');
      try {
        const files: StoredFile[] = JSON.parse(storedFilesData);
        const additionalText: string = storedAdditionalText || '';
        const education: Education[] = storedEducation ? JSON.parse(storedEducation) : [];
        const experience: Experience[] = storedExperience ? JSON.parse(storedExperience) : [];
        const projects: Project[] = storedProjects ? JSON.parse(storedProjects) : [];
        const skills: string = storedSkills || '';
        const personalInfo: PersonalInfo = storedPersonalInfo ? JSON.parse(storedPersonalInfo) : {
          address: '',
          phone: '',
          email: ''
        };
        const links: Links = storedLinks ? JSON.parse(storedLinks) : {
          linkedin: '',
          github: '',
          portfolio: ''
        };
        const serviceType: 'create' | 'optimize' = (storedServiceType as 'create' | 'optimize') || 'create';
        
        console.log('📄 [Analyze Page] Parsed files:', {
          count: files.length,
          names: files.map(f => f.name),
          sizes: files.map(f => f.size)
        });
        
        console.log('📝 [Analyze Page] Parsed additional text:', {
          length: additionalText.length,
          additionalTextData: additionalText
        });

        console.log('🎓 [Analyze Page] Parsed education:', {
          count: education.length,
          educationData: education
        });
        
        console.log('💼 [Analyze Page] Parsed experience:', {
          count: experience.length,
          experienceData: experience
        });
        
        console.log('🚀 [Analyze Page] Parsed projects:', {
          count: projects.length,
          projectsData: projects
        });
        
        console.log('⚡ [Analyze Page] Parsed skills:', {
          length: skills.length,
          skillsData: skills
        });
        
        console.log('👤 [Analyze Page] Parsed personal info:', {
          keys: Object.keys(personalInfo),
          personalInfoData: personalInfo
        });
        
        console.log('🔗 [Analyze Page] Parsed links:', {
          keys: Object.keys(links),
          linksData: links
        });
        
        setUploadedFiles(files);
        setAdditionalText(additionalText);
        setEducation(education);
        setExperience(experience);
        setProjects(projects);
        setSkills(skills);
        setPersonalInfo(personalInfo);
        setLinks(links);
        setServiceType(serviceType);
        
        // 自動開始分析
        startAnalysis(files, additionalText, education, experience, projects, skills, personalInfo, links, serviceType);
      } catch (error) {
        console.error('Error parsing stored files:', error);
        setError('讀取上傳文件時發生錯誤');
      }
    } else {
      // 如果沒有文件，返回上傳頁面
      router.push('/service-selection');
    }
    setTimeout(() => setIsVisible(true), 100);
  }, [router, startAnalysis]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [router]);

  const handleViewResults = () => {
    // 將分析結果存儲到 sessionStorage
    if (analysisResult) {
      sessionStorage.setItem('analysisResult', JSON.stringify(analysisResult));
      router.push('/results');
    }
  };

  const handleRetry = () => {
    if (uploadedFiles.length > 0) {
      setCurrentStep(0);
      setAnalysisComplete(false);
      setError(null);
      setAnalysisResult(null);
      startAnalysis(uploadedFiles, additionalText, education, experience, projects, skills, personalInfo, links, serviceType);
    }
  };

  return (
    <div className="min-h-screen py-2 md:py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Card with Illustration */}
        <Card className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}> 
          <CardHeader className="text-center">
            <div className="w-48 h-48 mx-auto mb-4 flex items-center justify-center transition-all duration-500 delay-300">
              <UploadIllustration mainColor="#06b6d4" width={192} height={192} />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              AI 智能解析
            </CardTitle>
            <div className="flex justify-center">
              <div className="w-fit text-center inline-block px-3 py-1 rounded-full text-sm font-medium bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 mb-3">
                深度分析您的作品內容
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center space-x-2 text-lg font-mono">
                <span className="text-gray-700 dark:text-gray-300">分析時間：</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                  {formatTime(analysisElapsedTime)}
                </span>
              </div>
              {isAnalyzing && <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                通常平均分析時長是 1.5 分鐘左右，請耐心稍候，可以離開此頁面，但不可關閉
              </p>}
            </div>

            {/* 步驟/結果內容區塊（seamless，無卡片感） */}
            <AnimatePresence mode="wait">
              {isAnalyzing && !analysisComplete && !error && (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="px-0 md:px-8 py-6 mt-6 bg-white/80 dark:bg-gray-900/80"
                >
                  {(() => {
                    const step = steps[currentStep];
                    const Icon = step.icon;
                    return (
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-cyan-100 dark:bg-cyan-900/50">
                          <Icon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {step.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {step.description}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-600"></div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {analysisComplete && analysisResult && !error && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="px-0 md:px-8 py-6 mt-6 bg-white dark:bg-gray-900 border-l-4 border-green-400"
                >
                  <div className="flex items-center mb-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 mr-3">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <span className="text-green-700 dark:text-green-400 font-semibold text-lg">AI 已成功分析您的履歷，識別出以下關鍵信息</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <p className="font-medium text-gray-900 dark:text-white mb-2">技能專長</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        識別了 {analysisResult.expertise.length} 項技術技能和軟技能
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <p className="font-medium text-gray-900 dark:text-white mb-2">項目經驗</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        整理了 {analysisResult.projects.length} 個主要項目的詳細信息
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <p className="font-medium text-gray-900 dark:text-white mb-2">成就亮點</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        提取了 {analysisResult.achievements.length} 項量化的工作成果
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <p className="font-medium text-gray-900 dark:text-white mb-2">工作經驗</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        分析了 {analysisResult.work_experiences.length} 段工作經歷
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </CardHeader>
        </Card>

        {error && !isAnalyzing && (
          <Card className="mb-8 border-red-200 dark:border-red-800 transition-all duration-700">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700 dark:text-red-400">
                <span className="text-2xl mr-2">⚠️</span>
                分析失敗
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-300">
                AI分析過程中遇到問題，請查看詳細原因並重試
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg p-4 border border-red-200 dark:border-red-700">
                <p className="text-red-800 dark:text-red-200 mb-4 leading-relaxed">
                  {error}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleRetry}
                    disabled={isAnalyzing}
                    className="bg-red-600 hover:bg-red-700 text-white flex-1 transition-all duration-300"
                  >
                    重新分析
                  </Button>
                  <Button
                    onClick={() => router.push('/service-selection')}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-950/30 flex-1 transition-all duration-300"
                  >
                    重新上傳文件
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className={`flex justify-between items-center transition-all duration-700 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Button 
            variant="outline" 
            onClick={() => router.push('/service-selection')}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-all duration-300"
          >
            返回上傳
          </Button>
          <Button 
            onClick={handleViewResults}
            disabled={!analysisComplete || !analysisResult}
            className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            查看詳細結果
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 