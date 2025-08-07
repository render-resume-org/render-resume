// Main component
export { AnalysisScores } from "./analysis-scores";

// Sub-components
export { ActionSection } from "./action-section";
export { MainAnalysisCard } from "./main-analysis-card";
export { PreviewDialog } from "./preview-dialog";
export { ResultsDetailedSections } from './results-detailed-sections';
export { UnifiedResultsDetailedSections } from './unified-results-detailed-sections';
export { ScoreTabsSection } from "./score-tabs-section";
export { ShareCard } from "./share-card";

// Hooks
export { useAnimatedScores, useShareFunctionality } from "./hooks";

// Utils
export { getGradeColors, gradeToNumber, numberToGrade, parseAIComment } from "./utils";

// Types
export type { AnalysisScore, AnalysisScoresProps, GradeColors, LetterGrade, ParsedComment, User } from "./types";

// Constants
export { ANIMATION_CONFIG, GRADE_MAPPING, SHARE_CARD_CONFIG } from "./constants";
