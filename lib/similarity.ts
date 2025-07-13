// Similarity-related helper functions for text, suggestions, and excerpts

// 向量化與相似度
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^-\u9fff\w\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 0);
}

export function getTextVector(text: string): Map<string, number> {
  const tokens = tokenize(text);
  const vector = new Map<string, number>();
  tokens.forEach(token => {
    vector.set(token, (vector.get(token) || 0) + 1);
  });
  return vector;
}

export function calculateCosineSimilarity(vec1: Map<string, number>, vec2: Map<string, number>): number {
  const allKeys = new Set([...vec1.keys(), ...vec2.keys()]);
  let dotProduct = 0, norm1 = 0, norm2 = 0;
  allKeys.forEach(key => {
    const val1 = vec1.get(key) || 0;
    const val2 = vec2.get(key) || 0;
    dotProduct += val1 * val2;
    norm1 += val1 * val1;
    norm2 += val2 * val2;
  });
  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

export function calculateStringSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1;
  if (str1.length === 0 || str2.length === 0) return 0;
  const matrix: number[][] = [];
  for (let i = 0; i <= str1.length; i++) matrix[i] = [i];
  for (let j = 0; j <= str2.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  const distance = matrix[str1.length][str2.length];
  const maxLength = Math.max(str1.length, str2.length);
  return 1 - (distance / maxLength);
}

export function getSuggestionText(suggestion: { title: string; description: string }) {
  return `${suggestion.title} ${suggestion.description}`;
}

export function getExcerptKey(excerpt: { title: string; content: string; source: string }) {
  return `${excerpt.source}:${excerpt.title}:${excerpt.content}`;
}

// Debug helper for excerpt vs template similarity
export function logExcerptVsTemplateContentSimilarity(
  excerpt: { title: string; content: string },
  templates: { title: string; description: string; originalFollowUp?: string }[]
) {
  if (!templates || templates.length === 0) return;
  console.group('[Excerpt vs Template Similarity]');
  templates.forEach((template) => {
    const contentSim = calculateStringSimilarity(
      excerpt.content.substring(0, 50),
      (template.description + (template.originalFollowUp || '')).substring(0, 50)
    );
    console.log(`Excerpt "${excerpt.title}" vs Template "${template.title}"`);
    console.log(`  - Content Similarity: ${(contentSim * 100).toFixed(2)}%`);
  });
  console.groupEnd();
} 