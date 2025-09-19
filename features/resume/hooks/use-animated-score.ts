"use client";

import { useEffect, useState } from "react";
import { ANIMATION_CONFIG, GRADE_MAPPING } from "../lib/results-config";
import { LetterGrade } from "../types/grade";

export function useAnimatedScores(grade: LetterGrade) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // 從 GRADE_MAPPING 獲取對應的數值
    const targetScore = GRADE_MAPPING[grade]?.value || 0;

    // 動畫整體分數
    const overallTimer = setTimeout(() => {
      let currentScore = 0;
      const increment = targetScore / ANIMATION_CONFIG.OVERALL_STEPS;
      const overallInterval = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
          setAnimatedScore(targetScore);
          clearInterval(overallInterval);
        } else {
          setAnimatedScore(Math.round(currentScore));
        }
      }, ANIMATION_CONFIG.OVERALL_INTERVAL);

      return () => clearInterval(overallInterval);
    }, ANIMATION_CONFIG.OVERALL_DELAY);

    return () => {
      clearTimeout(overallTimer);
    };
  }, [grade]);

  return { animatedScore, isVisible };
} 