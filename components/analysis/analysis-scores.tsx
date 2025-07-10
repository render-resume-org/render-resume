"use client";

import { useAuth } from "@/components/hooks/use-auth";
import { useRouter } from "next/navigation";
import { ActionSection } from "./action-section";
import { useAnimatedScores, useShareFunctionality } from "./hooks";
import { MainAnalysisCard } from "./main-analysis-card";
import { PreviewDialog } from "./preview-dialog";
import { ScoreTabsSection } from "./score-tabs-section";
import { ShareCard } from "./share-card";
import { AnalysisScoresProps } from "./types";
import { gradeToNumber, numberToGrade } from "./utils";

export function AnalysisScores({ scores }: AnalysisScoresProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  // 計算分數和等級
  const overallNumericalScore = Math.round(scores.reduce((sum, score) => sum + gradeToNumber(score.grade), 0) / scores.length);
  const overallGrade = numberToGrade(overallNumericalScore);
  const lowGrades = scores.filter(score => gradeToNumber(score.grade) < 80);
  const hasLowGrades = lowGrades.length > 0;

  // 使用自定義 Hooks
  const { animatedOverallScore, isVisible } = useAnimatedScores(scores, overallNumericalScore);
  const {
    shareCardRef,
    showPreviewDialog,
    previewImageUrl,
    setShowPreviewDialog,
    handleDownloadImage,
    handleShareImage
  } = useShareFunctionality(overallGrade, user);

  // 導航處理函數
  const handleStartChat = () => router.push('/smart-chat');

  return (
    <div className="space-y-6">
      {/* 主要分析卡片 - 包含評分和分享功能 */}
      <div className="flex flex-col md:flex-row gap-4">
        <MainAnalysisCard
          overallGrade={overallGrade}
          animatedOverallScore={animatedOverallScore}
          user={user}
          isVisible={isVisible}
          />

        {/* 詳細評分 Tabs */}
        <ScoreTabsSection
          scores={scores}
          isVisible={isVisible}
        />
      </div>
      <ActionSection 
        hasLowGrades={hasLowGrades}
        lowGrades={lowGrades}
        isVisible={isVisible}
        onStartChat={handleStartChat}
      />

      {/* 隱藏的分享卡片 */}
      <div ref={shareCardRef}>
        <ShareCard scores={scores} overallGrade={overallGrade} />
      </div>

      {/* 預覽對話框 */}
      <PreviewDialog 
        showPreviewDialog={showPreviewDialog}
        setShowPreviewDialog={setShowPreviewDialog}
        previewImageUrl={previewImageUrl}
        handleDownloadImage={handleDownloadImage}
        handleShareImage={handleShareImage}
      />
    </div>
  );
} 