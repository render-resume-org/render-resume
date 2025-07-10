"use client";

import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ANIMATION_CONFIG, GRADE_MAPPING, SHARE_CARD_CONFIG } from "./constants";
import { AnalysisScore, LetterGrade, User } from "./types";

export function useAnimatedScores(scores: AnalysisScore[], overallNumericalScore: number) {
  const [animatedOverallScore, setAnimatedOverallScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // 動畫整體分數
    const overallTimer = setTimeout(() => {
      let currentScore = 0;
      const increment = overallNumericalScore / ANIMATION_CONFIG.OVERALL_STEPS;
      const overallInterval = setInterval(() => {
        currentScore += increment;
        if (currentScore >= overallNumericalScore) {
          setAnimatedOverallScore(overallNumericalScore);
          clearInterval(overallInterval);
        } else {
          setAnimatedOverallScore(Math.round(currentScore));
        }
      }, ANIMATION_CONFIG.OVERALL_INTERVAL);

      return () => clearInterval(overallInterval);
    }, ANIMATION_CONFIG.OVERALL_DELAY);

    return () => {
      clearTimeout(overallTimer);
    };
  }, [overallNumericalScore, scores]);

  return { animatedOverallScore, isVisible };
}

export function useShareFunctionality(overallGrade: LetterGrade, user: User | null) {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const shareCardRef = useRef<HTMLDivElement>(null);

  const generateShareText = () => {
    const gradeEmoji = GRADE_MAPPING[overallGrade]?.emoji || '💪';
    const userName = user?.user_metadata?.full_name || 
                     user?.user_metadata?.name || 
                     user?.user_metadata?.display_name ||
                     (user?.email ? user.email.split('@')[0] : '我');
    
    return `${userName}的履歷在 RenderResume 上拿到 ${overallGrade} 評級！${gradeEmoji} 你能贏過我嗎？快來試試看吧！✨\n\n馬上測試你的履歷：\nhttps://www.render-resume.com`;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('複製成功', {
        description: '已複製到剪貼簿，快分享給你的朋友們吧！',
        duration: 2000,
        position: 'bottom-right',
        icon: '🔗'
      });
    } catch (err) {
      console.error('複製失敗:', err);
    }
  };

  const handleShareText = async () => {
    const shareText = generateShareText();
    
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        await handleCopyText();
      }
    } else {
      await handleCopyText();
    }
  };

  const handlePreviewImage = async () => {
    if (!shareCardRef.current) return;
    
    setIsGeneratingImage(true);
    try {
      const element = shareCardRef.current;
      const originalStyle = {
        position: element.style.position,
        top: element.style.top,
        left: element.style.left,
        zIndex: element.style.zIndex
      };
      
      // 移動到可見位置進行截圖
      element.style.position = 'fixed';
      element.style.top = '0px';
      element.style.left = '0px';
      element.style.zIndex = '9999';
      
      await new Promise(resolve => setTimeout(resolve, SHARE_CARD_CONFIG.POSITION_DELAY));
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: SHARE_CARD_CONFIG.CANVAS_SCALE,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: false,
        logging: false,
        width: SHARE_CARD_CONFIG.WIDTH,
        height: element.scrollHeight
      });
      
      // 恢復原始位置
      Object.assign(element.style, originalStyle);
      
      const imageUrl = canvas.toDataURL('image/png', 1.0);
      setPreviewImageUrl(imageUrl);
      setShowPreviewDialog(true);
      
    } catch {
      toast.error('圖片生成失敗', {
        description: '無法生成分享圖片，請稍後再試',
        duration: 3000,
        position: 'bottom-right',
        icon: '❌'
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadImage = () => {
    if (!previewImageUrl) return;
    
    const link = document.createElement('a');
    link.download = `RenderResume-${overallGrade}-evaluation.png`;
    link.href = previewImageUrl;
    link.click();
    
    toast.success('圖片已下載', {
      description: '分享圖片已成功下載到您的設備',
      duration: 3000,
      position: 'bottom-right',
      icon: '📸'
    });
    
    setShowPreviewDialog(false);
  };

  const handleShareImage = async () => {
    if (!previewImageUrl) return;
    
    try {
      const response = await fetch(previewImageUrl);
      const blob = await response.blob();
      const file = new File([blob], `RenderResume-${overallGrade}-evaluation.png`, { type: 'image/png' });
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'RenderResume 履歷評分結果',
          files: [file]
        });
        setShowPreviewDialog(false);
      } else {
        handleDownloadImage();
      }
    } catch (err) {
      console.error('分享圖片失敗:', err);
      handleDownloadImage();
    }
  };

  return {
    shareCardRef,
    isGeneratingImage,
    copied,
    showPreviewDialog,
    previewImageUrl,
    setShowPreviewDialog,
    handleShareText,
    handlePreviewImage,
    handleDownloadImage,
    handleShareImage
  };
} 