"use client";

import { useFileUpload } from "@/hooks/use-file-upload";
import { NavigationButton } from "@/components/navigation-button";
import { UploadIllustration } from "@/components/svg-icon";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdditionalTextInput } from "@/components/upload/additional-text-input";
import { EducationInput } from "@/components/upload/education-input";
import { ExperienceInput } from "@/components/upload/experience-input";
import { LinksInput } from "@/components/upload/links-input";
import { PersonalInput } from "@/components/upload/personal-input";
import { ProjectInput } from "@/components/upload/project-input";
import { SkillsInput } from "@/components/upload/skills-input";
import { UploadDropzone } from "@/components/upload/upload-dropzone";
import { UploadedFilesList } from "@/components/upload/uploaded-files-list";
import { useEffect, useState } from 'react';

export default function UploadCreatePage() {
  const [isVisible, setIsVisible] = useState(false);
  
  const {
    uploadedFiles,
    isProcessing,
    additionalText,
    setAdditionalText,
    education,
    setEducation,
    experience,
    setExperience,
    projects,
    setProjects,
    personalInfo,
    setPersonalInfo,
    skills,
    setSkills,
    links,
    setLinks,
    onDrop,
    removeFile,
    prepareForAnalysis,
    canProceed
  } = useFileUpload('create');

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleBeforeNavigate = async () => {
    await prepareForAnalysis();
    console.log('🧑‍💻 [Upload Create Page] Preparing for analysis');
  };

  // Dynamic content based on service type
  const getPageContent = () => {
    return {
      title: '輸入您的履歷內容',
      subtitle: '從零打造專業履歷',
      description: '',
      color: {
        border: 'border-cyan-300 dark:border-cyan-600',
        bg: 'bg-cyan-50 dark:bg-cyan-900/20',
        text: 'text-cyan-600 dark:text-cyan-400',
        button: 'bg-cyan-600 hover:bg-cyan-700'
      }
    };
  };

  const pageContent = getPageContent();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Combined Header and Upload Section */}
        <Card className={`mb-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } $`}>
          <CardHeader className="text-center">
            <div className={`w-48 h-48 mx-auto mb-4 flex items-center justify-center transition-all duration-500 delay-300`}>
              <UploadIllustration mainColor={'#06b6d4'} width={256} height={256} />
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
              請在下方輸入您的履歷內容，包括教育背景、工作經驗、專案經歷等。您也可以上傳作品截圖、專案報告書或技能證明作為輔助材料。AI 將自動分析並整合所有資訊，為後續的履歷優化提供最佳建議。
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <UploadDropzone
              onDrop={onDrop}
              borderActiveClass={'border-cyan-500'}
              bgActiveClass={'bg-cyan-50 dark:bg-cyan-950'}
              borderHoverClass={'hover:border-cyan-400'}
              iconClass={'text-cyan-400'}
              textActiveClass={'text-cyan-600 dark:text-cyan-400'}
            />
            <UploadedFilesList 
              uploadedFiles={uploadedFiles} 
              onRemoveFile={removeFile} 
            />
          </CardContent>
        </Card>

        {/* Education Section */}
        <EducationInput value={education} onChange={setEducation} />

        {/* Experience Section */}
        <ExperienceInput value={experience} onChange={setExperience} />

        {/* Project Section */}
        <ProjectInput value={projects} onChange={setProjects} />

        {/* Personal Info Section */}
        <PersonalInput value={personalInfo} onChange={setPersonalInfo} />

        {/* Skills Section */}
        <SkillsInput value={skills} onChange={setSkills} />

        {/* Links Section */}
        <LinksInput value={links} onChange={setLinks} />

        {/* Additional Text Section */}
        <AdditionalTextInput 
          value={additionalText}
          onChange={setAdditionalText}
        />

        {/* Navigation */}
        <div className={`flex justify-between items-center transition-all duration-700 delay-900 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <NavigationButton
            direction="left"
            route="/service-selection"
            text="返回選擇"
            className="transition-all duration-300"
          />
          
          <NavigationButton
            direction="right"
            route="/analyze"
            text="開始分析"
            disabled={!canProceed || isProcessing}
            beforeNavigate={handleBeforeNavigate}
            className={`${pageContent.color.button} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
          />
        </div>
      </div>
    </div>
  );
} 