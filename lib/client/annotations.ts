import type { UnifiedResumeAnalysisResult } from '@/types/resume-unified';
import React from 'react';

export type AnnotationKind = 'highlight' | 'issue';

export interface Annotation {
  text: string;
  kind: AnnotationKind;
}

export function buildAnnotationsFromAnalysis(analysis: UnifiedResumeAnalysisResult | null | undefined): Annotation[] {
  if (!analysis) return [];
  const annotations: Annotation[] = [];
  for (const h of analysis.highlights || []) {
    if (h.excerpt && h.excerpt.trim()) annotations.push({ text: h.excerpt.trim(), kind: 'highlight' });
  }
  for (const i of analysis.issues || []) {
    if (i.excerpt && i.excerpt.trim()) annotations.push({ text: i.excerpt.trim(), kind: 'issue' });
  }
  // Deduplicate by normalized text
  const seen = new Set<string>();
  const normalized = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
  return annotations.filter(a => {
    const key = `${a.kind}:${normalized(a.text)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function highlightText(text: string, annotations: Annotation[]): React.ReactNode {
  if (!text || annotations.length === 0) return text;
  let nodes: React.ReactNode[] = [text];

  for (const ann of annotations) {
    const nextNodes: React.ReactNode[] = [];
    const pattern = new RegExp(escapeRegex(ann.text).replace(/\s+/g, '\\s+'), 'gi');
    const className = ann.kind === 'issue'
      ? 'bg-red-100 dark:bg-red-900/40 ring-1 ring-red-300 dark:ring-red-700 rounded px-0.5'
      : 'bg-yellow-100 dark:bg-yellow-900/40 ring-1 ring-yellow-300 dark:ring-yellow-700 rounded px-0.5';

    for (const node of nodes) {
      if (typeof node !== 'string') { nextNodes.push(node); continue; }
      let lastIndex = 0;
      const parts: React.ReactNode[] = [];
      const str = node;
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(str)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        if (start > lastIndex) parts.push(str.slice(lastIndex, start));
        parts.push(React.createElement('span', { className, key: `${start}-${end}-${ann.kind}` }, str.slice(start, end)));
        lastIndex = end;
      }
      if (lastIndex < str.length) parts.push(str.slice(lastIndex));
      nextNodes.push(...parts);
    }
    nodes = nextNodes;
  }
  return React.createElement(React.Fragment, null, ...nodes);
}


