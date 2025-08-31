export const GRADE_MAPPING = {
  'A+': { value: 95, level: "卓越" },
  'A': { value: 87, level: "優秀" },
  'A-': { value: 82, level: "良好" },
  'B+': { value: 78, level: "滿意" },
  'B': { value: 75, level: "尚可" },
  'B-': { value: 70, level: "合格" },
  'C+': { value: 68, level: "待改進" },
  'C': { value: 65, level: "需改進" },
  'C-': { value: 60, level: "需改進" },
  'D': { value: 55, level: "不及格" },
  'F': { value: 50, level: "不合格" }
} as const;

export const ANIMATION_CONFIG = {
  OVERALL_DELAY: 500,
  OVERALL_STEPS: 50,
  OVERALL_INTERVAL: 20
} as const; 