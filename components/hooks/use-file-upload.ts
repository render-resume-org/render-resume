"use client";

import { Education, Experience, Project, PersonalInfo, Links } from '@/lib/upload-utils';
import {
    UploadedFile,
    FileData,
    clearUploadSession,
    generateFileId,
    getFileType,
    processFilesForAnalysis,
    saveToSession
} from '@/lib/upload-utils';
import { pdfToImg } from 'pdftoimg-js/browser';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function useFileUpload(serviceType: 'create' | 'optimize' = 'create') {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [additionalText, setAdditionalText] = useState('');
  const [education, setEducation] = useState<Education[]>([
    { school: "", major: "", degree: "", gpa: "", startMonth: "", startYear: "", endMonth: "", endYear: "", isCurrent: false }
  ]);
  const [experience, setExperience] = useState<Experience[]>([
    { company: "", position: "", location: "", description: "", startMonth: "", startYear: "", endMonth: "", endYear: "", isCurrent: false }
  ]);
  const [projects, setProjects] = useState<Project[]>([
    { name: "", description: "", startMonth: "", startYear: "", endMonth: "", endYear: "", isCurrent: false }
  ]);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    address: "",
    phone: "",
    email: ""
  });
  const [skills, setSkills] = useState<string>("");
  const [links, setLinks] = useState<Links>({
    linkedin: "",
    github: "",
    portfolio: ""
  });

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

    const newFiles: UploadedFile[] = acceptedFiles.map(file => {
      const fileType = getFileType(file);

      return {
        id: generateFileId(),
        file,
        type: fileType,
        status: 'uploading',
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        serviceType
      };
    });

    console.log('📋 [File Upload Hook] Created upload file objects:', newFiles.map(f => ({
      id: f.id,
      name: f.file.name,
      type: f.type,
      status: f.status,
      serviceType: f.serviceType
    })));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Process file upload and PDF conversion
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
        } else {
          // Regular file - mark as completed
          setTimeout(() => {
            console.log(`✅ [File Upload Hook] File upload completed: ${uploadFile.file.name}`);
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
        console.error(`❌ [File Upload Hook] Error processing file ${uploadFile.file.name}:`, error);
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

  // 檢查是否有有效的經驗內容
  const hasValidExperience = useMemo(() => {
    return experience.some(exp => 
      exp.company.trim() !== '' && 
      exp.position.trim() !== '' && 
      exp.description.trim() !== ''
    );
  }, [experience]);

  // 檢查是否有有效的專案內容
  const hasValidProjects = useMemo(() => {
    return projects.some(proj => 
      proj.name.trim() !== '' && 
      proj.description.trim() !== ''
    );
  }, [projects]);

  const prepareForAnalysis = useCallback(async () => {
    console.log('🚀 [File Upload Hook] Starting file preparation for analysis');
    console.log('📊 [File Upload Hook] Current state:', {
      uploadedFilesCount: uploadedFiles.length,
      additionalTextLength: additionalText.length,
      educationCount: education.length,
      experienceCount: experience.length,
      projectsCount: projects.length,
      serviceType,
              canProceed: serviceType === 'optimize' 
        ? uploadedFiles.length > 0 && uploadedFiles.every(f => f.status === 'completed')
        : hasValidExperience || hasValidProjects
    });
    
    if (serviceType === 'optimize' && uploadedFiles.length === 0) {
      console.warn('⚠️ [File Upload Hook] No files to process for optimize service');
      throw new Error('請選擇要分析的文件');
    }
    
    if (serviceType === 'create' && !hasValidExperience && !hasValidProjects) {
      console.warn('⚠️ [File Upload Hook] No valid experience or projects for create service');
      throw new Error('請至少填寫一項工作經驗或專案經驗');
    }
    
    setIsProcessing(true);
    
    try {
      console.log('📋 [File Upload Hook] Preparing files data');
      
      let allFilesData: FileData[] = [];
      if (uploadedFiles.length > 0) {
        allFilesData = await processFilesForAnalysis(uploadedFiles);
        
        console.log('📄 [File Upload Hook] All files data prepared:', allFilesData.map(f => ({
          id: f.id,
          name: f.name,
          type: f.type,
          isFromPdf: f.isFromPdf || false
        })));
      } else {
        console.log('📄 [File Upload Hook] No files to process, using form data only');
      }

      saveToSession(allFilesData, additionalText, education, experience, projects, skills, personalInfo, links, serviceType);
      
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
  }, [uploadedFiles, additionalText, education, experience, projects, personalInfo, links, skills, serviceType, hasValidExperience, hasValidProjects]);

  const canProceed = useMemo(() => {
    return serviceType === 'optimize' 
      ? uploadedFiles.length > 0 && uploadedFiles.every(f => f.status === 'completed')
      : hasValidExperience || hasValidProjects;
  }, [serviceType, uploadedFiles, hasValidExperience, hasValidProjects]);

  return {
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
    skills,
    setSkills,
    personalInfo,
    setPersonalInfo,
    links,
    setLinks,
    onDrop,
    removeFile,
    prepareForAnalysis,
    canProceed
  };
} 