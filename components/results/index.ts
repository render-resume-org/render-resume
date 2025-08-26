// Main component
export { ResumeGrade } from "./resume-grade";
export { ResumeComment } from "./resume-comment";
export { ResumeHighlightsIssuesSection } from './resume-highlights-issues-section';

// TODO: 未使用 - 可考慮移除
export { ResultsDetailedSections } from './results-detailed-sections';
export { ScoreTabsSection } from "./score-tabs-section";

// Hooks
export { useAnimatedScores } from "./hooks";

// Utils
export { getGradeColors, /* TODO: 未使用 - 可考慮移除 */ gradeToNumber, numberToGrade, parseAIComment } from "./utils";

// Types
export type { AnalysisScore, GradeColors, LetterGrade, ParsedComment, /* TODO: 未使用 - 可考慮移除 */ User } from "./types";

// Constants
export { ANIMATION_CONFIG, GRADE_MAPPING } from "./constants";
