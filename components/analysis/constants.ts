export const GRADE_MAPPING = {
  'A+': { value: 95, level: "卓越", emoji: '🏆' },
  'A': { value: 87, level: "優秀", emoji: '🏆' },
  'A-': { value: 82, level: "良好", emoji: '🏆' },
  'B+': { value: 78, level: "滿意", emoji: '🎯' },
  'B': { value: 75, level: "尚可", emoji: '🎯' },
  'B-': { value: 70, level: "合格", emoji: '🎯' },
  'C+': { value: 68, level: "待改進", emoji: '📈' },
  'C': { value: 65, level: "需改進", emoji: '📈' },
  'C-': { value: 60, level: "需改進", emoji: '📈' },
  'F': { value: 50, level: "不合格", emoji: '💪' }
} as const;

export const ANIMATION_CONFIG = {
  OVERALL_DELAY: 500,
  OVERALL_STEPS: 50,
  OVERALL_INTERVAL: 20,
  SCORE_DELAY_BASE: 800,
  SCORE_DELAY_INCREMENT: 200,
  SCORE_STEPS: 50,
  SCORE_INTERVAL: 20
} as const;

export const SHARE_CARD_CONFIG = {
  WIDTH: 400,
  POSITION_DELAY: 100,
  CANVAS_SCALE: 2
} as const; 