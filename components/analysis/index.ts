// Main component
export { ResumeGrade } from "./resume-grade";
export { ResumeComment } from "./resume-comment";

// Sub-components
export { ResultsDetailedSections } from './results-detailed-sections';
export { UnifiedResultsDetailedSections } from './unified-results-detailed-sections';
export { ScoreTabsSection } from "./score-tabs-section";

// Hooks
export { useAnimatedScores } from "./hooks";

// Utils
export { getGradeColors, gradeToNumber, numberToGrade, parseAIComment } from "./utils";

// Types
export type { AnalysisScore, GradeColors, LetterGrade, ParsedComment, User } from "./types";

// Constants
export { ANIMATION_CONFIG, GRADE_MAPPING } from "./constants";
