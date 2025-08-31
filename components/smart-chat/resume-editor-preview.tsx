"use client";

import ResumePreview from '@/components/preview/resume-preview';
import { ResumeTemplate } from '@/lib/config/resume-templates';
import { mapOptimizedToUnified } from '@/lib/mappers/optimized-to-unified';
import { mapUnifiedToOptimized } from '@/lib/mappers/unified-to-optimized';
import { calculateStringSimilarity } from '@/lib/similarity';
import type { OptimizedResume } from '@/lib/types/resume';
import type { UnifiedResume } from '@/lib/types/resume-unified';
import { setByPath } from '@/lib/utils/set-by-path';
import { useCallback, useEffect, useState } from 'react';

interface ResumeEditorPreviewProps {
  template: ResumeTemplate;
  className?: string;
}

export default function ResumeEditorPreview({ template }: ResumeEditorPreviewProps) {
  const [unified, setUnified] = useState<UnifiedResume | null>(null);
  const [optimized, setOptimized] = useState<OptimizedResume | null>(null);
  const [previewOps, setPreviewOps] = useState<Array<{ op: 'set'; path: string; value: string }> | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewDiffs, setPreviewDiffs] = useState<Record<string, { before?: string; after?: string }>>({});

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('resume');
      if (stored) {
        const parsed = JSON.parse(stored) as UnifiedResume;
        setUnified(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!unified) return;
    setOptimized(mapUnifiedToOptimized(unified));
  }, [unified]);

  const persist = useCallback((next: OptimizedResume) => {
    setOptimized(next);
    const nextUnified = mapOptimizedToUnified(next);
    setUnified(nextUnified);
    try { sessionStorage.setItem('resume', JSON.stringify(nextUnified)); } catch {}
  }, []);

  const handleUpdateOptimized = useCallback((next: OptimizedResume) => {
    persist(next);
  }, [persist]);

  const handleInlineChange = useCallback((path: string, next: unknown) => {
    if (!optimized) return;
    const updated: OptimizedResume = JSON.parse(JSON.stringify(optimized));
    if (path === 'summary') {
      updated.summary = String(next ?? '');
    } else if (path === 'experience') {
      const payload = next as { path?: string; value?: string; action?: 'addBullet' | 'removeBullet'; index?: number };
      if (payload?.action === 'addBullet' && typeof payload.index === 'number' && payload.path) {
        const m = payload.path.match(/^experience\[(\d+)\]\.achievements$/);
        if (m) {
          const idx = Number(m[1]);
          const insertAt = payload.index + 1;
          updated.experience[idx].achievements.splice(insertAt, 0, '');
          persist(updated);
          setTimeout(() => {
            document.dispatchEvent(new CustomEvent('resume-inline-focus', { detail: { groupId: `experience-${idx}-achievements`, index: insertAt, position: 'start' } }));
          }, 0);
          return;
        }
      } else if (payload?.action === 'removeBullet' && typeof payload.index === 'number' && payload.path) {
        const m = payload.path.match(/^experience\[(\d+)\]\.achievements$/);
        if (m) {
          const idx = Number(m[1]);
          const removeAt = payload.index;
          updated.experience[idx].achievements.splice(removeAt, 1);
          persist(updated);
          setTimeout(() => {
            document.dispatchEvent(new CustomEvent('resume-inline-focus', { detail: { groupId: `experience-${idx}-achievements`, index: Math.max(0, removeAt - 1), position: 'end' } }));
          }, 0);
          return;
        }
      } else if (payload?.path) {
        const m = payload.path.match(/^experience\[(\d+)\]\.(title|company|period|achievements\[(\d+)\])$/);
        if (m) {
          const idx = Number(m[1]);
          const field = m[2];
          const achIdx = m[3] ? Number(m[3]) : undefined;
          if (field.startsWith('achievements') && achIdx != null) {
            updated.experience[idx].achievements[achIdx] = String(payload.value ?? '');
          } else if (field === 'title') {
            updated.experience[idx].title = String(payload.value ?? '');
          } else if (field === 'company') {
            updated.experience[idx].company = String(payload.value ?? '');
          } else if (field === 'period') {
            updated.experience[idx].period = String(payload.value ?? '');
          }
        }
      }
    } else if (path === 'projects') {
      const payload = next as { path?: string; value?: string; action?: 'addBullet' | 'removeBullet'; index?: number };
      if (payload?.action === 'addBullet' && typeof payload.index === 'number' && payload.path) {
        const m = payload.path.match(/^projects\[(\d+)\]\.achievements$/);
        if (m) {
          const idx = Number(m[1]);
          const insertAt = payload.index + 1;
          updated.projects[idx].achievements.splice(insertAt, 0, '');
          persist(updated);
          setTimeout(() => {
            document.dispatchEvent(new CustomEvent('resume-inline-focus', { detail: { groupId: `projects-${idx}-achievements`, index: insertAt, position: 'start' } }));
          }, 0);
          return;
        }
      } else if (payload?.action === 'removeBullet' && typeof payload.index === 'number' && payload.path) {
        const m = payload.path.match(/^projects\[(\d+)\]\.achievements$/);
        if (m) {
          const idx = Number(m[1]);
          const removeAt = payload.index;
          updated.projects[idx].achievements.splice(removeAt, 1);
          persist(updated);
          setTimeout(() => {
            document.dispatchEvent(new CustomEvent('resume-inline-focus', { detail: { groupId: `projects-${idx}-achievements`, index: Math.max(0, removeAt - 1), position: 'end' } }));
          }, 0);
          return;
        }
      } else if (payload?.path) {
        const m = payload.path.match(/^projects\[(\d+)\]\.(name|period|achievements\[(\d+)\])$/);
        if (m) {
          const idx = Number(m[1]);
          const field = m[2];
          const achIdx = m[3] ? Number(m[3]) : undefined;
          if (field.startsWith('achievements') && achIdx != null) {
            updated.projects[idx].achievements[achIdx] = String(payload.value ?? '');
          } else if (field === 'name') {
            updated.projects[idx].name = String(payload.value ?? '');
          } else if (field === 'period') {
            updated.projects[idx].period = String(payload.value ?? '');
          }
        }
      }
    } else if (path === 'education') {
      const payload = next as { path?: string; value?: string };
      if (payload?.path) {
        // Map composite edits for degree/major/gpa and details comma-separated
        if (/^education\[\d+\]\.degreeMajorGpa$/.test(payload.path)) {
          const idx = Number(payload.path.match(/^education\[(\d+)\]/)?.[1] || 0);
          const text = String(payload.value ?? '');
          // naive parse: split by comma
          const parts = text.split(',').map(s => s.trim());
          updated.education[idx].degree = parts[0] || '';
          const majorPart = parts.find(p => p && !p.toLowerCase().startsWith('gpa'));
          if (majorPart && majorPart !== parts[0]) updated.education[idx].major = majorPart.replace(/^,\s*/, '');
          const gpaPart = parts.find(p => /^gpa/i.test(p));
          updated.education[idx].gpa = gpaPart ? gpaPart.replace(/^(gpa: ?)/i, '') : updated.education[idx].gpa;
        } else if (/^education\[\d+\]\.degreeMajor$/.test(payload.path)) {
          const idx = Number(payload.path.match(/^education\[(\d+)\]/)?.[1] || 0);
          const text = String(payload.value ?? '');
          const parts = text.split(',').map(s => s.trim());
          updated.education[idx].degree = parts[0] || '';
          updated.education[idx].major = parts[1] || '';
        } else if (/^education\[\d+\]\.details$/.test(payload.path)) {
          const idx = Number(payload.path.match(/^education\[(\d+)\]/)?.[1] || 0);
          updated.education[idx].details = String(payload.value ?? '').split(',').map(s => s.trim()).filter(Boolean);
        } else {
          const m = payload.path.match(/^education\[(\d+)\]\.(school|period|honor)$/);
          if (m) {
            const idx = Number(m[1]);
            const field = m[2] as 'school' | 'period' | 'honor';
            if (field === 'school') updated.education[idx].school = String(payload.value ?? '');
            if (field === 'period') updated.education[idx].period = String(payload.value ?? '');
            if (field === 'honor') updated.education[idx].honor = String(payload.value ?? '');
          }
        }
      }
    } else if (path === 'achievements') {
      const payload = next as { path?: string; value?: string; action?: 'addBullet' | 'removeBullet'; index?: number };
      if (payload?.action === 'addBullet' && typeof payload.index === 'number' && payload.path) {
        const m = payload.path.match(/^achievements\[(\d+)\]\.details$/);
        if (m) {
          const idx = Number(m[1]);
          const insertAt = payload.index + 1;
          if (!updated.achievements![idx].details) updated.achievements![idx].details = [];
          updated.achievements![idx].details!.splice(insertAt, 0, '');
          persist(updated);
          setTimeout(() => {
            document.dispatchEvent(new CustomEvent('resume-inline-focus', { detail: { groupId: `achievements-${idx}-details`, index: insertAt, position: 'start' } }));
          }, 0);
          return;
        }
      } else if (payload?.action === 'removeBullet' && typeof payload.index === 'number' && payload.path) {
        const m = payload.path.match(/^achievements\[(\d+)\]\.details$/);
        if (m) {
          const idx = Number(m[1]);
          const removeAt = payload.index;
          if (!updated.achievements![idx].details) updated.achievements![idx].details = [];
          updated.achievements![idx].details!.splice(removeAt, 1);
          persist(updated);
          setTimeout(() => {
            document.dispatchEvent(new CustomEvent('resume-inline-focus', { detail: { groupId: `achievements-${idx}-details`, index: Math.max(0, removeAt - 1), position: 'end' } }));
          }, 0);
          return;
        }
      } else if (payload?.path) {
        const m = payload.path.match(/^achievements\[(\d+)\]\.(title|period|organization|details\[(\d+)\])$/);
        if (m) {
          const idx = Number(m[1]);
          const field = m[2];
          const detIdx = m[3] ? Number(m[3]) : undefined;
          if (field.startsWith('details') && detIdx != null) {
            updated.achievements![idx].details![detIdx] = String(payload.value ?? '');
          } else if (field === 'title') {
            updated.achievements![idx].title = String(payload.value ?? '');
          } else if (field === 'period') {
            updated.achievements![idx].period = String(payload.value ?? '');
          } else if (field === 'organization') {
            updated.achievements![idx].organization = String(payload.value ?? '');
          }
        }
      }
    } else if (path === 'personalInfo') {
      const payload = next as { path?: string; value?: string };
      if (payload?.path) {
        const m = payload.path.match(/^personalInfo\.(fullName|email|phone|linkedin|github|website)$/);
        if (m) {
          const field = m[1] as keyof OptimizedResume['personalInfo'];
          const value = String(payload.value ?? '');
          if (field === 'fullName') updated.personalInfo.fullName = value;
          if (field === 'email') updated.personalInfo.email = value;
          if (field === 'phone') updated.personalInfo.phone = value;
          if (field === 'linkedin') updated.personalInfo.linkedin = value;
          if (field === 'github') updated.personalInfo.github = value;
          if (field === 'website') updated.personalInfo.website = value;
        }
      }
    } else if (path === 'skills') {
      const payload = next as { path?: string; value?: string };
      if (payload?.path) {
        const m = payload.path.match(/^skills\[(\d+)\]\.(category|items\[(\d+)\])$/);
        if (m) {
          const idx = Number(m[1]);
          const field = m[2];
          const itemIdx = m[3] ? Number(m[3]) : undefined;
          if (field.startsWith('items') && itemIdx != null) {
            updated.skills[idx].items[itemIdx] = String(payload.value ?? '');
          } else if (field === 'category') {
            updated.skills[idx].category = String(payload.value ?? '');
          }
        }
      }
    }
    persist(updated);
  }, [optimized, persist]);

  useEffect(() => {
    const normalizePath = (path: string) =>
      path
        .replace(/\.outcomes\[/g, '.achievements[')
        .replace(/\.outcomes\./g, '.achievements.');

    const resolveNeighborIndexIfNeeded = (root: unknown, path: string, afterValue: string): string => {
      try {
        const norm = normalizePath(path);
        const arrPath = norm.replace(/\[(\d+)\]/g, '.$1');
        const segments = arrPath.split('.').filter(Boolean);
        if (segments.length < 2) return norm;
        const last = segments[segments.length - 1];
        const index = Number.isFinite(Number(last)) ? Number(last) : NaN;
        if (Number.isNaN(index)) return norm;
        // Traverse to parent container
        let cursor: unknown = optimized as unknown;
        for (let i = 0; i < segments.length - 1; i++) {
          const key = segments[i];
          if (cursor && typeof cursor === 'object' && key in (cursor as Record<string, unknown>)) {
            cursor = (cursor as Record<string, unknown>)[key];
          } else {
            return norm;
          }
        }
        if (!Array.isArray(cursor)) return norm;
        const container = cursor as unknown[];
        const candidates = [index - 1, index, index + 1].filter(i => i >= 0 && i < container.length);
        const simFor = (i: number) => typeof container[i] === 'string' ? calculateStringSimilarity(String(container[i]), afterValue) : 0;
        const scored = candidates.map(i => ({ i, s: simFor(i) }));
        // choose the best among neighbors; if all zero, keep original
        scored.sort((a,b) => b.s - a.s);
        const best = scored[0];
        if (best && best.i !== index && best.s >= 0.15) {
          const segs = [...segments];
          segs[segs.length - 1] = String(best.i);
          // turn back into bracket path
          const rebuilt = segs.map((seg, idx) => (Number.isFinite(Number(seg)) ? `[${seg}]` : (idx === 0 ? seg : `.${seg}`))).join('');
          return rebuilt;
        }
        return norm;
      } catch {
        return normalizePath(path);
      }
    };

    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent<{ patchOps: Array<{ op: 'set'; path: string; value: string }> }>).detail;
      if (!detail) return;

      // Normalize and resolve paths
      const normalizedPatchOps = detail.patchOps.map(op => ({
        ...op,
        path: resolveNeighborIndexIfNeeded(optimized, op.path, op.value),
      }));

      setPreviewOps(normalizedPatchOps);
      // Build preview diffs (before/after) from current optimized state
      try {
        const diffs: Record<string, { before?: string; after?: string }> = {};
        if (optimized) {
          for (const op of normalizedPatchOps) {
            if (op.op !== 'set') continue;
            const arrPath = op.path.replace(/\[(\d+)\]/g, '.$1');
            const segments = arrPath.split('.');
            let cursor: Record<string, unknown> | unknown[] | null = optimized as unknown as Record<string, unknown>;
            for (let i = 0; i < segments.length; i++) {
              const key = segments[i];
              if (i === segments.length - 1) {
                const currentValue = (cursor as Record<string, unknown>)?.[key as unknown as string];
                diffs[op.path] = { before: String((currentValue ?? '') as unknown as string), after: op.value };
              } else {
                const nextCursorVal: unknown = (cursor as Record<string, unknown>)?.[key as unknown as string];
                cursor = (typeof nextCursorVal === 'object' && nextCursorVal !== null) ? (nextCursorVal as Record<string, unknown>) : null;
                if (cursor == null) break;
              }
            }
          }
        }
        setPreviewDiffs(diffs);
      } catch (error) {
        console.error('❌ Error building preview diffs:', error);
      }
      setIsPreviewing(true);
    };
    window.addEventListener('resume-preview-patchops', handler as EventListener);
    return () => window.removeEventListener('resume-preview-patchops', handler as EventListener);
  }, [optimized, persist]);

  const getPreviewedResume = useCallback((): OptimizedResume | null => {
    if (!optimized) return optimized;
    // For set-preview, do not mutate resume; we only render highlights via props
    return optimized;
  }, [optimized]);

  const handleAcceptPreview = useCallback(() => {
    if (!optimized || !isPreviewing || !previewOps?.length) return;
    const next: OptimizedResume = JSON.parse(JSON.stringify(optimized));
    for (const op of previewOps) {
      if (op.op === 'set') {
        setByPath(next as unknown as Record<string, unknown>, op.path, op.value as unknown);
      }
    }
    persist(next);
    setIsPreviewing(false);
    setPreviewOps(null);
    setPreviewDiffs({});
  }, [optimized, isPreviewing, previewOps, persist]);

  const handleRejectPreview = useCallback(() => {
    setIsPreviewing(false);
    setPreviewOps(null);
    setPreviewDiffs({});
  }, []);

  if (!optimized) return null;

  return (
    <div className="relative h-full">
      <ResumePreview
      resumeData={getPreviewedResume() || optimized}
      template={template}
      onUpdateResume={handleUpdateOptimized}
      editable
      analysisResult={null}
      inlineEditable
      onInlineChange={handleInlineChange}
      previewHighlights={isPreviewing ? (previewOps || []).map(op => ({ type: 'set' as const, path: op.path })) : undefined}
      previewDiffs={isPreviewing ? previewDiffs : undefined}
      />
      {isPreviewing && (
        <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="pointer-events-auto backdrop-blur-sm bg-white/70 dark:bg-gray-900/60 shadow-lg rounded-xl px-3 py-2 flex items-center gap-2 border border-gray-200/60 dark:border-gray-700/60">
            <span className="text-sm text-gray-700 dark:text-gray-200">預覽變更（段落覆寫）</span>
            <button onClick={handleAcceptPreview} className="text-sm px-3 py-1 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white">接受</button>
            <button onClick={handleRejectPreview} className="text-sm px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100">拒絕</button>
          </div>
        </div>
      )}
    </div>
  );
}
