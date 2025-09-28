import { GradeColors, LetterGrade } from "../types/grade";

export const numberToGrade = (score: number): LetterGrade => {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 77) return 'B+';
  if (score >= 73) return 'B';
  if (score >= 70) return 'B-';
  if (score >= 67) return 'C+';
  if (score >= 63) return 'C';
  if (score >= 60) return 'C-';
  return 'F';
};

export const getGradeColors = (): GradeColors => {
  return {
    stroke: "text-cyan-300",
    fill: "fill-cyan-300",
    background: "text-cyan-100 dark:text-cyan-900",
    border: "border-cyan-300 dark:border-cyan-600",
    hover: "hover:border-cyan-400 dark:hover:border-cyan-500"
  };
}; 