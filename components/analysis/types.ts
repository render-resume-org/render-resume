import { AnalysisScore, LetterGrade } from "@/lib/types/resume-analysis";

export interface AnalysisScoresProps {
  scores: AnalysisScore[];
}

export interface User {
  user_metadata?: {
    full_name?: string;
    name?: string;
    display_name?: string;
  };
  email?: string;
}

export interface GradeColors {
  stroke: string;
  fill: string;
  background: string;
  border: string;
  hover: string;
}

export interface ParsedComment {
  reasoning: string;
  finalScore: string;
  suggestions: string;
  original: string;
}

export type { AnalysisScore, LetterGrade };
