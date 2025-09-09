"use client";

import { mapOptimizedToUnified } from '@/lib/mappers/optimized-to-unified';
import { mapUnifiedToOptimized } from '@/lib/mappers/unified-to-optimized';
import { calculateStringSimilarity } from '@/lib/similarity';
import type { OptimizedResume } from '@/lib/types/resume';
import type { UnifiedResume } from '@/lib/types/resume-unified';
import { setByPath } from '@/lib/utils/set-by-path';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

// Local types copied from original file to avoid deep import
export type ArrayContainer = unknown[];
export type PathCursor = Record<string, unknown> | unknown[] | null;
export type PathNavigationResult = { container: ArrayContainer | null; lastKey: string | null };

export type PatchOp = { op: 'set'; path: string; value: string };
export type InsertOp = { op: 'insert'; path: string; value: unknown; index?: number };
export type RemoveOp = { op: 'remove'; path: string; index?: number };

// Focus management types
export type FocusTarget = {
  groupId: string;
  index: number;
  position: 'start' | 'end';
  bulletId?: string;
};

interface ResumeEditorContextValue {
  unified: UnifiedResume | null;
  optimized: OptimizedResume | null;
  isPreviewing: boolean;
  previewOps: Array<PatchOp | InsertOp | RemoveOp> | null;
  previewDiffs: Record<string, { before?: string; after?: string }>;
  setPreviewOps: (ops: Array<PatchOp | InsertOp | RemoveOp> | null) => void;
  setIsPreviewing: (v: boolean) => void;
  setPreviewDiffs: React.Dispatch<React.SetStateAction<Record<string, { before?: string; after?: string }>>>;
  persist: (next: OptimizedResume) => void;
  getPreviewedResume: () => OptimizedResume | null;
  handleInlineChange: (path: string, next: unknown) => void;
  handleUpdateOptimized: (next: OptimizedResume) => void;
  acceptPreview: () => void;
  rejectPreview: () => void;
  getInlineIds: (groupId: string, length: number) => string[];
  resolveIndexById: (groupId: string, id: string) => number;
  // Focus management API
  focusInlineElement: (target: FocusTarget) => void;
  focusAfterRemove: (groupId: string, removedIndex: number) => void;
}

const ResumeEditorContext = createContext<ResumeEditorContextValue | null>(null);

export function useResumeEditor(): ResumeEditorContextValue | null {
  const ctx = useContext(ResumeEditorContext);
  return ctx;
}

export function useResumeEditorRequired(): ResumeEditorContextValue {
  const ctx = useContext(ResumeEditorContext);
  if (!ctx) throw new Error('useResumeEditor must be used within ResumeEditorProvider');
  return ctx;
}

// Helpers
export const normalizePath = (path: string): string =>
  path.replace(/\.outcomes\[/g, '.outcomes[').replace(/\.outcomes\./g, '.outcomes.').replace(/\.outcomes$/g, '.outcomes');

export const getByPath = (root: unknown, path: string): unknown => {
  try {
    const arrPath = path.replace(/\[(\d+)\]/g, '.$1');
    const segments = arrPath.split('.').filter(Boolean);
    let cursor: PathCursor = root as PathCursor;
    for (let i = 0; i < segments.length; i++) {
      if (cursor == null || typeof cursor !== 'object') return undefined;
      const key = segments[i];
      cursor = (cursor as Record<string, unknown>)[key as string] as PathCursor;
    }
    return cursor;
  } catch {
    return undefined;
  }
};

export function ResumeEditorProvider({ children }: { children: React.ReactNode }) {
  const [unified, setUnified] = useState<UnifiedResume | null>(null);
  const [optimized, setOptimized] = useState<OptimizedResume | null>(null);
  const [previewOps, setPreviewOps] = useState<Array<PatchOp | InsertOp | RemoveOp> | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewDiffs, setPreviewDiffs] = useState<Record<string, { before?: string; after?: string }>>({});
  const [, setInlineIds] = useState<Record<string, string[]>>({});
  const inlineIdsRef = useRef<Record<string, string[]>>({});
  const pendingUpdatesRef = useRef<Record<string, string[]>>({});

  const generateUuid = useCallback((): string => {
    try { return (globalThis as unknown as { crypto?: { randomUUID?: () => string } }).crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2); } catch { return Math.random().toString(36).slice(2); }
  }, []);

  // Effect to handle pending inline ID updates
  useEffect(() => {
    const pending = pendingUpdatesRef.current;
    if (Object.keys(pending).length > 0) {
      setInlineIds(prev => ({ ...prev, ...pending }));
      pendingUpdatesRef.current = {};
    }
  }, []);

  const getInlineIds = useCallback((groupId: string, length: number): string[] => {
    let current = inlineIdsRef.current[groupId];
    if (!current || current.length !== length) {
      const nextArr: string[] = Array.from({ length }, (_, i) => (current && current[i]) ? current[i] : generateUuid());
      // Update ref immediately for synchronous access
      inlineIdsRef.current = { ...inlineIdsRef.current, [groupId]: nextArr };
      // Queue state update for next effect cycle
      pendingUpdatesRef.current = { ...pendingUpdatesRef.current, [groupId]: nextArr };
      current = nextArr;
    }
    return current;
  }, [generateUuid]);

  const resolveIndexById = useCallback((groupId: string, id: string): number => {
    const arr = inlineIdsRef.current[groupId];
    if (!arr) return -1;
    return arr.indexOf(id);
  }, []);

  // Focus management API
  const focusInlineElement = useCallback((target: FocusTarget) => {
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('resume-inline-focus', { detail: target }));
    }, 50);
  }, []);

  const focusAfterRemove = useCallback((groupId: string, removedIndex: number) => {
    setTimeout(() => {
      const focusIndex = Math.max(0, removedIndex - 1);
      const focusIds = inlineIdsRef.current[groupId] || [];
      const focusBulletId = focusIds[focusIndex];
      document.dispatchEvent(new CustomEvent('resume-inline-focus', { 
        detail: { 
          groupId, 
          index: focusIndex, 
          position: 'end',
          bulletId: focusBulletId 
        } 
      }));
    }, 10);
  }, []);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('resume');
      if (stored) setUnified(JSON.parse(stored) as UnifiedResume);
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

  const getDefaultInsertValue = useCallback((containerName: string, value: unknown): unknown => {
    if (containerName === 'experience') {
      const v = (typeof value === 'object' && value !== null ? value : { title: String(value ?? ''), company: '', period: '', outcomes: [] }) as Record<string, unknown>;
      return { title: String(v.title ?? ''), company: String(v.company ?? ''), period: String(v.period ?? ''), outcomes: Array.isArray(v.outcomes) ? v.outcomes.map(s => String(s ?? '')) : [] };
    }
    if (containerName === 'projects') {
      const v = (typeof value === 'object' && value !== null ? value : { name: String(value ?? ''), period: '', outcomes: [] }) as Record<string, unknown>;
      return { name: String(v.name ?? ''), period: String(v.period ?? ''), outcomes: Array.isArray(v.outcomes) ? v.outcomes.map(s => String(s ?? '')) : [] };
    }
    if (containerName === 'achievements') {
      const v = (typeof value === 'object' && value !== null ? value : { title: String(value ?? ''), organization: '', period: '', outcomes: [] }) as Record<string, unknown>;
      return { title: String(v.title ?? ''), organization: String(v.organization ?? ''), period: String(v.period ?? ''), outcomes: Array.isArray(v.outcomes) ? v.outcomes.map(s => String(s ?? '')) : [] };
    }
    if (containerName === 'education') {
      const v = (typeof value === 'object' && value !== null ? value : { degree: '', major: '', school: String(value ?? ''), period: '', outcomes: [] }) as Record<string, unknown>;
      return { degree: String(v.degree ?? ''), major: String(v.major ?? ''), school: String(v.school ?? ''), period: String(v.period ?? ''), outcomes: Array.isArray(v.outcomes) ? v.outcomes.map(s => String(s ?? '')) : [], gpa: typeof v.gpa === 'string' ? v.gpa : undefined, honor: typeof v.honor === 'string' ? v.honor : undefined };
    }
    if (containerName === 'skills') {
      const v = (typeof value === 'object' && value !== null ? value : { category: String(value ?? ''), items: [] }) as Record<string, unknown>;
      return { category: String(v.category ?? ''), items: Array.isArray(v.items) ? v.items.map(s => String(s ?? '')) : [] };
    }
    return value;
  }, []);

  const getPreviewedResume = useCallback((): OptimizedResume | null => {
    if (!optimized) return optimized;
    if (!isPreviewing || !previewOps?.length) return optimized;
    const virtual: OptimizedResume = JSON.parse(JSON.stringify(optimized));
    for (const op of previewOps) {
      if (op.op === 'set') {
        setByPath(virtual as unknown as Record<string, unknown>, op.path, op.value as unknown);
      } else if (op.op === 'insert') {
        const arrPath = op.path.replace(/\[(\d+)\]/g, '.$1');
        const segments = arrPath.split('.').filter(Boolean);
        let cursor: PathCursor = virtual as unknown as PathCursor;
        for (let i = 0; i < segments.length - 1; i++) {
          const key = segments[i];
          if (typeof cursor === 'object' && cursor !== null && !(key in cursor)) {
            (cursor as Record<string, unknown>)[key] = {};
          }
          if (typeof cursor === 'object' && cursor !== null) {
            cursor = (cursor as Record<string, unknown>)[key] as PathCursor;
          }
        }
        const lastKey = segments[segments.length - 1];
        const numericIndex = Number.isFinite(Number(lastKey)) ? Number(lastKey) : null;
        if (numericIndex !== null && Array.isArray(cursor)) {
          const arrayItems = cursor as unknown[];
          const parentKey = segments[segments.length - 2] || '';
          const isBulletArray = /outcomes$/.test(parentKey) || /items$/.test(parentKey);
          const valueToInsert = isBulletArray ? String(op.value as string ?? '') : getDefaultInsertValue(parentKey, op.value);
          const boundedIndex = Math.max(0, Math.min(numericIndex, arrayItems.length));
          arrayItems.splice(boundedIndex, 0, valueToInsert as unknown);
        } else if (typeof cursor === 'object' && cursor !== null && lastKey in cursor) {
          const lastValue = (cursor as Record<string, unknown>)[lastKey];
          if (!Array.isArray(lastValue)) {
            (cursor as Record<string, unknown>)[lastKey] = [];
          }
          const arrayItems = (cursor as Record<string, unknown>)[lastKey] as unknown[];
          const idxMatch = op.path.match(/\[(\d+)\]$/);
          const insertIndex = idxMatch ? Number(idxMatch[1]) : arrayItems.length;
          const isBulletArray = /outcomes$/.test(String(lastKey)) || /items$/.test(String(lastKey));
          const valueToInsert = isBulletArray ? String(op.value as string ?? '') : getDefaultInsertValue(String(lastKey), op.value);
          const boundedIndex = Math.max(0, Math.min(insertIndex, arrayItems.length));
          arrayItems.splice(boundedIndex, 0, valueToInsert as unknown);
        }
      }
    }
    return virtual;
  }, [optimized, isPreviewing, previewOps, getDefaultInsertValue]);

  const handleInlineChange = useCallback((path: string, next: unknown) => {
    if (!optimized) return;
    const updated: OptimizedResume = JSON.parse(JSON.stringify(optimized));
    type BulletPayload = { path?: string; value?: string; action?: 'addBullet' | 'removeBullet'; index?: number; bulletId?: string };
    const getGroupIdForPath = (p: string): string | null => {
      const m = p.match(/^(experience|projects|education|achievements)\[(\d+)\]\.outcomes$/);
      if (m) return `${m[1]}-${Number(m[2])}-outcomes`;
      const s = p.match(/^skills\[(\d+)\]\.items$/);
      if (s) return `skills-${Number(s[1])}-items`;
      return null;
    };
    const updateIdsOnInsert = (groupId: string, at: number) => {
      const arr = inlineIdsRef.current[groupId] ? [...inlineIdsRef.current[groupId]] : [];
      if (at < 0 || at > arr.length) arr.length = Math.max(arr.length, at);
      arr.splice(at, 0, generateUuid());
      inlineIdsRef.current = { ...inlineIdsRef.current, [groupId]: arr };
      pendingUpdatesRef.current = { ...pendingUpdatesRef.current, [groupId]: arr };
    };
    const updateIdsOnRemove = (groupId: string, at: number) => {
      const arr = inlineIdsRef.current[groupId] ? [...inlineIdsRef.current[groupId]] : [];
      if (at >= 0 && at < arr.length) arr.splice(at, 1);
      inlineIdsRef.current = { ...inlineIdsRef.current, [groupId]: arr };
      pendingUpdatesRef.current = { ...pendingUpdatesRef.current, [groupId]: arr };
    };
    
    // Helper: detect whether a path is inside an inserted preview (so base data may not exist yet)
    const isPathUnderInsert = (p: string): boolean => {
      if (!isPreviewing || !previewOps?.length) return false;
      return previewOps.some(op => op.op === 'insert' && (p === op.path || p.startsWith(op.path + '.')));
    };
    // New helper: detect whether an array container is affected by any preview insert
    const isContainerUnderInsert = (containerPath: string): boolean => {
      if (!isPreviewing || !previewOps?.length) return false;
      return previewOps.some(op => {
        if (op.op !== 'insert') return false;
        return op.path.startsWith(containerPath + '[') || containerPath.startsWith(op.path + '.') || op.path === containerPath;
      });
    };
    // Helper: when editing preview-only content, store edits in previewDiffs instead of mutating base
    const writePreviewOnlyEdit = (p: string, value: string) => {
      setPreviewDiffs(prev => ({
        ...prev,
        [p]: { before: '', after: value }
      }));
    };
    
    if (path === 'summary') {
      updated.summary = String(next ?? '');
    } else if (path === 'experience') {
      const payload = next as BulletPayload;
      // Redirect edits to preview store if they target preview-only inserted content
      if (payload?.path && isPathUnderInsert(payload.path) && payload.value !== undefined) {
        writePreviewOnlyEdit(payload.path, String(payload.value ?? ''));
        return;
      }
      if (payload?.action === 'addBullet' && typeof payload.index === 'number' && payload.path) {
        const m = payload.path.match(/^experience\[(\d+)\]\.outcomes$/);
        if (m) {
          const idx = Number(m[1]);
          const insertAt = payload.index + 1;
          const gid = getGroupIdForPath(payload.path);
          if (isContainerUnderInsert(payload.path)) {
            if (gid) updateIdsOnInsert(gid, insertAt);
            setPreviewOps(prev => ([...(prev || []), { op: 'insert', path: `${payload.path}[${insertAt}]`, value: '' }]));
          } else {
            if (!updated.experience[idx].outcomes) updated.experience[idx].outcomes = [];
            updated.experience[idx].outcomes!.splice(insertAt, 0, '');
            if (gid) updateIdsOnInsert(gid, insertAt);
            persist(updated);
          }
          focusInlineElement({ groupId: `experience-${idx}-outcomes`, index: insertAt, position: 'start' });
          return;
        }
      } else if (payload?.action === 'removeBullet' && payload.path) {
        const m = payload.path.match(/^experience\[(\d+)\]\.outcomes$/);
        if (m) {
          const idx = Number(m[1]);
          let removeAt = typeof payload.index === 'number' ? payload.index : -1;
          const gid = getGroupIdForPath(payload.path);
          if (gid && payload.bulletId) {
            const resolved = resolveIndexById(gid, payload.bulletId);
            if (resolved >= 0) removeAt = resolved;
          }
          if (isContainerUnderInsert(payload.path)) {
            if (gid) updateIdsOnRemove(gid, removeAt);
            setPreviewOps(prev => ([...(prev || []), { op: 'remove', path: `${payload.path}[${removeAt}]` }]));
          } else {
            if (!updated.experience[idx].outcomes) updated.experience[idx].outcomes = [];
            updated.experience[idx].outcomes!.splice(removeAt, 1);
            if (gid) updateIdsOnRemove(gid, removeAt);
            persist(updated);
          }
          focusAfterRemove(`experience-${idx}-outcomes`, removeAt);
          return;
        }
      } else if (payload?.path) {
        const m = payload.path.match(/^experience\[(\d+)\]\.(title|company|period|outcomes\[(\d+)\]|outcomes)$/);
        if (m) {
          const idx = Number(m[1]);
          const field = m[2];
          const achIdx = m[3] ? Number(m[3]) : undefined;
          if (field.startsWith('outcomes') && achIdx != null) {
            if (!updated.experience[idx].outcomes) updated.experience[idx].outcomes = [];
            const arr = updated.experience[idx].outcomes!;
            if (achIdx >= arr.length) {
              arr.length = achIdx + 1;
              for (let i = 0; i < arr.length; i++) { if (arr[i] === undefined) arr[i] = ''; }
            }
            arr[achIdx] = String(payload.value ?? '');
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
      const payload = next as BulletPayload;
      if (payload?.action === 'addBullet' && typeof payload.index === 'number' && payload.path) {
        const m = payload.path.match(/^projects\[(\d+)\]\.outcomes$/);
        if (m) {
          const idx = Number(m[1]);
          const insertAt = payload.index + 1;
          const gid = getGroupIdForPath(payload.path);
          if (isContainerUnderInsert(payload.path)) {
            if (gid) updateIdsOnInsert(gid, insertAt);
            setPreviewOps(prev => ([...(prev || []), { op: 'insert', path: `${payload.path}[${insertAt}]`, value: '' }]));
          } else {
            if (!updated.projects[idx].outcomes) updated.projects[idx].outcomes = [];
            updated.projects[idx].outcomes!.splice(insertAt, 0, '');
            if (gid) updateIdsOnInsert(gid, insertAt);
            persist(updated);
          }
          focusInlineElement({ groupId: `projects-${idx}-outcomes`, index: insertAt, position: 'start' });
          return;
        }
      } else if (payload?.action === 'removeBullet' && payload.path) {
        const m = payload.path.match(/^projects\[(\d+)\]\.outcomes$/);
        if (m) {
          const idx = Number(m[1]);
          let removeAt = typeof payload.index === 'number' ? payload.index : -1;
          const gid = getGroupIdForPath(payload.path);
          if (gid && payload.bulletId) {
            const resolved = resolveIndexById(gid, payload.bulletId);
            if (resolved >= 0) removeAt = resolved;
          }
          if (isContainerUnderInsert(payload.path)) {
            if (gid) updateIdsOnRemove(gid, removeAt);
            setPreviewOps(prev => ([...(prev || []), { op: 'remove', path: `${payload.path}[${removeAt}]` }]));
          } else {
            if (!updated.projects[idx].outcomes) updated.projects[idx].outcomes = [];
            updated.projects[idx].outcomes!.splice(removeAt, 1);
            if (gid) updateIdsOnRemove(gid, removeAt);
            persist(updated);
          }
          focusAfterRemove(`projects-${idx}-outcomes`, removeAt);
          return;
        }
      } else if (payload?.path) {
        const m = payload.path.match(/^projects\[(\d+)\]\.(name|period|outcomes\[(\d+)\]|outcomes)$/);
        if (m) {
          const idx = Number(m[1]);
          const field = m[2];
          const achIdx = m[3] ? Number(m[3]) : undefined;
          if (field.startsWith('outcomes') && achIdx != null) {
            if (!updated.projects[idx].outcomes) updated.projects[idx].outcomes = [];
            const arr = updated.projects[idx].outcomes!;
            if (achIdx >= arr.length) {
              arr.length = achIdx + 1;
              for (let i = 0; i < arr.length; i++) { if (arr[i] === undefined) arr[i] = ''; }
            }
            arr[achIdx] = String(payload.value ?? '');
          } else if (field === 'name') {
            updated.projects[idx].name = String(payload.value ?? '');
          } else if (field === 'period') {
            updated.projects[idx].period = String(payload.value ?? '');
          }
        }
      }
    } else if (path === 'education') {
      const payload = next as BulletPayload;
      if (payload?.action === 'addBullet' && typeof payload.index === 'number' && payload.path) {
        const m = payload.path.match(/^education\[(\d+)\]\.outcomes$/);
        if (m) {
          const idx = Number(m[1]);
          const insertAt = payload.index + 1;
          const gid = getGroupIdForPath(payload.path);
          if (isContainerUnderInsert(payload.path)) {
            if (gid) updateIdsOnInsert(gid, insertAt);
            setPreviewOps(prev => ([...(prev || []), { op: 'insert', path: `${payload.path}[${insertAt}]`, value: '' }]));
          } else {
            if (!updated.education[idx].outcomes) updated.education[idx].outcomes = [];
            updated.education[idx].outcomes!.splice(insertAt, 0, '');
            if (gid) updateIdsOnInsert(gid, insertAt);
            persist(updated);
          }
          focusInlineElement({ groupId: `education-${idx}-outcomes`, index: insertAt, position: 'start' });
          return;
        }
      } else if (payload?.action === 'removeBullet' && payload.path) {
        const m = payload.path.match(/^education\[(\d+)\]\.outcomes$/);
        if (m) {
          const idx = Number(m[1]);
          let removeAt = typeof payload.index === 'number' ? payload.index : -1;
          const gid = getGroupIdForPath(payload.path);
          if (gid && payload.bulletId) {
            const resolved = resolveIndexById(gid, payload.bulletId);
            if (resolved >= 0) removeAt = resolved;
          }
          if (isContainerUnderInsert(payload.path)) {
            if (gid) updateIdsOnRemove(gid, removeAt);
            setPreviewOps(prev => ([...(prev || []), { op: 'remove', path: `${payload.path}[${removeAt}]` }]));
          } else {
            if (!updated.education[idx].outcomes) updated.education[idx].outcomes = [];
            if (updated.education[idx].outcomes!.length <= 1) {
              updated.education[idx].outcomes![0] = '';
            } else {
              updated.education[idx].outcomes!.splice(removeAt, 1);
            }
            if (gid) updateIdsOnRemove(gid, removeAt);
            persist(updated);
          }
          focusAfterRemove(`education-${idx}-outcomes`, removeAt);
          return;
        }
      } else if (payload?.path) {
        const m = payload.path.match(/^education\[(\d+)\]\.(degree|major|school|period|gpa|honor|outcomes\[(\d+)\]|outcomes)$/);
        if (m) {
          const idx = Number(m[1]);
          const field = m[2];
          const outcomeIdx = m[3] ? Number(m[3]) : undefined;
          
          if (field.startsWith('outcomes') && outcomeIdx != null) {
            updated.education[idx].outcomes![outcomeIdx] = String(payload.value ?? '');
          } else if (field === 'degree') {
            updated.education[idx].degree = String(payload.value ?? '');
          } else if (field === 'major') {
            updated.education[idx].major = String(payload.value ?? '');
          } else if (field === 'school') {
            updated.education[idx].school = String(payload.value ?? '');
          } else if (field === 'period') {
            updated.education[idx].period = String(payload.value ?? '');
          } else if (field === 'gpa') {
            updated.education[idx].gpa = String(payload.value ?? '');
          } else if (field === 'honor') {
            updated.education[idx].honor = String(payload.value ?? '');
          }
        }
      }
    } else if (path === 'achievements') {
      const payload = next as BulletPayload;
      if (payload?.action === 'addBullet' && typeof payload.index === 'number' && payload.path) {
        const m = payload.path.match(/^achievements\[(\d+)\]\.outcomes$/);
        if (m) {
          const idx = Number(m[1]);
          const insertAt = payload.index + 1;
          const gid = getGroupIdForPath(payload.path);
          if (isContainerUnderInsert(payload.path)) {
            if (gid) updateIdsOnInsert(gid, insertAt);
            setPreviewOps(prev => ([...(prev || []), { op: 'insert', path: `${payload.path}[${insertAt}]`, value: '' }]));
          } else {
            if (!updated.achievements![idx].outcomes) updated.achievements![idx].outcomes = [];
            updated.achievements![idx].outcomes!.splice(insertAt, 0, '');
            if (gid) updateIdsOnInsert(gid, insertAt);
            persist(updated);
          }
          focusInlineElement({ groupId: `achievements-${idx}-outcomes`, index: insertAt, position: 'start' });
          return;
        }
      } else if (payload?.action === 'removeBullet' && payload.path) {
        const m = payload.path.match(/^achievements\[(\d+)\]\.outcomes$/);
        if (m) {
          const idx = Number(m[1]);
          let removeAt = typeof payload.index === 'number' ? payload.index : -1;
          const gid = getGroupIdForPath(payload.path);
          if (gid && payload.bulletId) {
            const resolved = resolveIndexById(gid, payload.bulletId);
            if (resolved >= 0) removeAt = resolved;
          }
          if (isContainerUnderInsert(payload.path)) {
            if (gid) updateIdsOnRemove(gid, removeAt);
            setPreviewOps(prev => ([...(prev || []), { op: 'remove', path: `${payload.path}[${removeAt}]` }]));
          } else {
            if (!updated.achievements![idx].outcomes) updated.achievements![idx].outcomes = [];
            if (updated.achievements![idx].outcomes!.length <= 1) {
              updated.achievements![idx].outcomes![0] = '';
            } else {
              updated.achievements![idx].outcomes!.splice(removeAt, 1);
            }
            if (gid) updateIdsOnRemove(gid, removeAt);
            persist(updated);
          }
          focusAfterRemove(`achievements-${idx}-outcomes`, removeAt);
          return;
        }
      } else if (payload?.path) {
        const m = payload.path.match(/^achievements\[(\d+)\]\.(title|period|organization|outcomes\[(\d+)\]|outcomes)$/);
        if (m) {
          const idx = Number(m[1]);
          const field = m[2];
          const outcomeIdx = m[3] ? Number(m[3]) : undefined;
          if (field.startsWith('outcomes') && outcomeIdx != null) {
            updated.achievements![idx].outcomes![outcomeIdx] = String(payload.value ?? '');
          } else if (field === 'title') {
            updated.achievements![idx].title = String(payload.value ?? '');
          } else if (field === 'period') {
            updated.achievements![idx].period = String(payload.value ?? '');
          } else if (field === 'organization') {
            updated.achievements![idx].organization = String(payload.value ?? '');
          }
        }
      }
    } else if (path.startsWith('personalInfo.')) {
      const m = path.match(/^personalInfo\.(fullName|email|phone|location|linkedin|github|website)$/);
      if (m) {
        const field = m[1] as keyof OptimizedResume['personalInfo'];
        const value = String(next ?? '');
        if (field === 'fullName') updated.personalInfo.fullName = value;
        if (field === 'email') updated.personalInfo.email = value;
        if (field === 'phone') updated.personalInfo.phone = value;
        if (field === 'location') updated.personalInfo.location = value;
        if (field === 'linkedin') updated.personalInfo.linkedin = value;
        if (field === 'github') updated.personalInfo.github = value;
        if (field === 'website') updated.personalInfo.website = value;
      }
    } else if (path === 'skills') {
      const payload = next as { path?: string; value?: string };
      if (payload?.path) {
        const m = payload.path.match(/^skills\[(\d+)\]\.(category|items\[(\d+)\]|items)$/);
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
  }, [optimized, persist, isPreviewing, previewOps, setPreviewDiffs, setPreviewOps, focusInlineElement, focusAfterRemove]);

  // Patch operations handling
  useEffect(() => {
    const normalizePath = (path: string) =>
      path
        .replace(/\.outcomes\[/g, '.outcomes[')
        .replace(/\.outcomes\./g, '.outcomes.')
        .replace(/\.outcomes$/g, '.outcomes');

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
      const detail = (ev as CustomEvent<{ patchOps: Array<PatchOp | InsertOp | RemoveOp> }>).detail;
      if (!detail) return;

      // Helpers
      const getByPath = (root: unknown, path: string): unknown => {
        try {
          const arrPath = path.replace(/\[(\d+)\]/g, '.$1');
          const segments = arrPath.split('.').filter(Boolean);
          let cursor: PathCursor = root as PathCursor;
          for (let i = 0; i < segments.length; i++) {
            if (cursor == null || typeof cursor !== 'object') return undefined;
            const key = segments[i];
            if (typeof cursor === 'object' && cursor !== null) {
              cursor = (cursor as Record<string, unknown>)[key] as PathCursor;
            } else {
              return undefined;
            }
          }
          return cursor;
        } catch {
          return undefined;
        }
      };

      const getArrayInfo = (root: unknown, arrayPath: string): PathNavigationResult => {
        try {
          const arrPath = arrayPath.replace(/\[(\d+)\]/g, '.$1');
          const segments = arrPath.split('.').filter(Boolean);
          let cursor: PathCursor = root as PathCursor;
          for (let i = 0; i < segments.length - 1; i++) {
            if (cursor == null || typeof cursor !== 'object') return { container: null, lastKey: null };
            const key = segments[i];
            if (typeof cursor === 'object' && cursor !== null && key in cursor) {
              cursor = (cursor as Record<string, unknown>)[key] as PathCursor;
            } else {
              return { container: null, lastKey: null };
            }
            if (cursor == null) return { container: null, lastKey: null };
          }
          if (cursor == null || typeof cursor !== 'object') return { container: null, lastKey: null };
          const lastKey = segments[segments.length - 1];
          if (typeof cursor === 'object' && cursor !== null && lastKey in cursor) {
            const lastValue = (cursor as Record<string, unknown>)[lastKey];
            const container = Array.isArray(lastValue) ? lastValue as ArrayContainer : null;
            return { container, lastKey };
          }
          return { container: null, lastKey: null };
        } catch {
          return { container: null, lastKey: null };
        }
      };

      const computeInsertTargetPath = (op: { path: string; value: unknown; index?: number }): string => {
        const normPath = normalizePath(op.path);
        const idxMatch = normPath.match(/\[(\d+)\]$/);
        if (idxMatch) {
          const base = normPath.replace(/\[(\d+)\]$/, '');
          const insertIndex = op.index != null ? op.index : Number(idxMatch[1]) + 1;
          return `${base}[${insertIndex}]`;
        }
        // path is array path without trailing index → append or at provided index
        const { container } = getArrayInfo(optimized, normPath);
        const targetIndex = op.index != null ? op.index : (container ? container.length : 0);
        return `${normPath}[${targetIndex}]`;
      };

      const computeRemoveTargetPath = (op: { path: string; index?: number }): string | null => {
        const normPath = normalizePath(op.path);
        const idxMatch = normPath.match(/\[(\d+)\]$/);
        if (idxMatch) return normPath;
        if (typeof op.index === 'number') return `${normPath}[${op.index}]`;
        // cannot resolve index
        return null;
      };

      // Helper: compute base path and start index for inserts into array containers
      const computeInsertBaseAndStart = (op: { path: string; index?: number }) => {
        const normPath = normalizePath(op.path);
        // If op.path already ends with [index], use that as start
        const idxMatch = normPath.match(/\[(\d+)\]$/);
        if (idxMatch) {
          const base = normPath.replace(/\[(\d+)\]$/, '');
          const start = typeof op.index === 'number' ? op.index : Number(idxMatch[1]);
          return { base, start };
        }
        // Otherwise, use container length or provided index
        const { container } = getArrayInfo(optimized, normPath);
        const start = typeof op.index === 'number' ? op.index : (container ? container.length : 0);
        return { base: normPath, start };
      };

      // Normalize and resolve paths (including neighbor resolution for set/insert),
      // and expand array-valued inserts for outcomes/items into multiple scalar inserts
      const normalizedPatchOps: Array<PatchOp | InsertOp | RemoveOp> = [];
      for (const rawOp of detail.patchOps) {
        if (!rawOp || typeof rawOp.path !== 'string') continue;
        if (rawOp.op === 'set') {
          normalizedPatchOps.push({
            ...rawOp,
            path: resolveNeighborIndexIfNeeded(optimized, rawOp.path, String((rawOp as PatchOp).value ?? '')),
          } as PatchOp);
          continue;
        }
        if (rawOp.op === 'insert') {
          const isContainerPath = /(outcomes|items)$/.test(rawOp.path);
          const isArrayValue = Array.isArray((rawOp as InsertOp).value);
          if (isContainerPath && isArrayValue) {
            const { base, start } = computeInsertBaseAndStart(rawOp);
            const values = (rawOp as InsertOp).value as unknown[];
            values.forEach((v, i) => {
              const targetPath = `${base}[${start + i}]`;
              const resolvedPath = resolveNeighborIndexIfNeeded(optimized, targetPath, typeof v === 'string' ? v : '');
              normalizedPatchOps.push({ op: 'insert', path: resolvedPath, value: typeof v === 'string' ? v : String(v ?? '') } as InsertOp);
            });
          } else {
            const targetPath = computeInsertTargetPath(rawOp);
            normalizedPatchOps.push({
              ...rawOp,
              path: resolveNeighborIndexIfNeeded(optimized, targetPath, typeof (rawOp as InsertOp).value === 'string' ? (rawOp as InsertOp).value as string : ''),
            } as InsertOp);
          }
          continue;
        }
        if (rawOp.op === 'remove') {
          const targetPath = computeRemoveTargetPath(rawOp);
          normalizedPatchOps.push(targetPath ? { ...rawOp, path: targetPath } as RemoveOp : rawOp);
          continue;
        }
        normalizedPatchOps.push(rawOp as PatchOp | InsertOp | RemoveOp);
      }

      setPreviewOps(normalizedPatchOps);
      // Build preview diffs (before/after) from current optimized state
      try {
        const diffs: Record<string, { before?: string; after?: string }> = {};
        if (optimized) {
          for (const op of normalizedPatchOps) {
            if (op.op === 'set') {
              const arrPath = op.path.replace(/\[(\d+)\]/g, '.$1');
              const segments = arrPath.split('.');
              let cursor: Record<string, unknown> | unknown[] | null = optimized as unknown as Record<string, unknown>;
              for (let i = 0; i < segments.length; i++) {
                const key = segments[i];
                if (i === segments.length - 1) {
                  const currentValue = (cursor as Record<string, unknown>)?.[key as string];
                  diffs[op.path] = { before: String((currentValue ?? '') as unknown as string), after: String(op.value as string ?? '') };
                } else {
                  const nextCursorVal: unknown = (cursor as Record<string, unknown>)?.[key as string];
                  cursor = (typeof nextCursorVal === 'object' && nextCursorVal !== null) ? (nextCursorVal as Record<string, unknown>) : null;
                  if (cursor == null) break;
                }
              }
            } else if (op.op === 'insert') {
              // For insert, show added value as after; before is empty
              if (Array.isArray(op.value)) {
                // If array of bullet lines is provided, join as multi-line preview for the same path
                const afterValue = (op.value as unknown[]).map(v => String(v ?? '')).join('\n');
                diffs[op.path] = { before: '', after: afterValue };
              } else {
                let afterValue = '[新增段落]';
                if (typeof op.value === 'string' && op.value.trim() !== '') {
                  afterValue = op.value;
                }
                diffs[op.path] = { before: '', after: afterValue };
              }
            } else if (op.op === 'remove') {
              // For remove, show current content as before; after empty
              const currentVal = getByPath(optimized, op.path);
              diffs[op.path] = { before: String((currentVal ?? '') as unknown as string), after: '' };
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

  const acceptPreview = useCallback(() => {
    if (!optimized || !isPreviewing || !previewOps?.length) return;
    const next: OptimizedResume = JSON.parse(JSON.stringify(optimized));
    // Helper to read current value by path from an object (supports bracket indices)
    const getByPath = (root: unknown, path: string): unknown => {
      try {
        const arrPath = path.replace(/\[(\d+)\]/g, '.$1');
        const segments = arrPath.split('.').filter(Boolean);
        let cursor: PathCursor = root as PathCursor;
        for (let i = 0; i < segments.length; i++) {
          if (cursor == null) return undefined;
          const key = segments[i];
          if (typeof cursor === 'object' && cursor !== null) {
            cursor = (cursor as Record<string, unknown>)[key] as PathCursor;
          } else {
            return undefined;
          }
        }
        return cursor;
      } catch {
        return undefined;
      }
    };

    const withDefaults = getDefaultInsertValue;

    for (const op of previewOps) {
      if (op.op === 'set') {
        // Determine whether the user edited this field during preview.
        const diffs = previewDiffs[op.path];
        const currentVal = getByPath(optimized, op.path);
        const beforeVal = diffs?.before ?? '';
        const aiAfterVal = diffs?.after ?? op.value;
        const userEdited = String(currentVal ?? '') !== String(beforeVal ?? '');
        const valueToApply = userEdited ? String(currentVal ?? '') : String(aiAfterVal ?? '');
        setByPath(next as unknown as Record<string, unknown>, op.path, valueToApply as unknown);
      } else if (op.op === 'insert') {
        const arrPath = op.path.replace(/\[(\d+)\]/g, '.$1');
        const segments = arrPath.split('.').filter(Boolean);
        let cursor: PathCursor = next as unknown as PathCursor;
        for (let i = 0; i < segments.length - 1; i++) {
          const key = segments[i];
          if (typeof cursor === 'object' && cursor !== null && !(key in cursor)) {
            (cursor as Record<string, unknown>)[key] = {};
          }
          if (typeof cursor === 'object' && cursor !== null) {
            cursor = (cursor as Record<string, unknown>)[key] as PathCursor;
          }
        }
        const lastKey = segments[segments.length - 1];
        const numericIndex = Number.isFinite(Number(lastKey)) ? Number(lastKey) : null;
        // Case 1: op.path ends with an index (e.g., projects[2] or experience[0].outcomes[3])
        if (numericIndex !== null && Array.isArray(cursor)) {
          const arrayItems = cursor as unknown[];
          const parentKey = segments[segments.length - 2] || '';
          const isBulletArray = /outcomes$/.test(parentKey) || /items$/.test(parentKey);
          if (isBulletArray && Array.isArray(op.value)) {
            const insertValues = (op.value as unknown[]).map(v => String(v ?? ''));
            const start = Math.max(0, Math.min(numericIndex, arrayItems.length));
            arrayItems.splice(start, 0, ...insertValues);
          } else {
            const valueToInsert = isBulletArray
              ? String(op.value as string ?? '')
              : withDefaults(parentKey, op.value);
            const boundedIndex = Math.max(0, Math.min(numericIndex, arrayItems.length));
            arrayItems.splice(boundedIndex, 0, valueToInsert as unknown);
          }
        } else if (typeof cursor === 'object' && cursor !== null && lastKey in cursor) {
          // Case 2: op.path ends with an array key (fallback)
          const lastValue = (cursor as Record<string, unknown>)[lastKey];
          if (!Array.isArray(lastValue)) {
            (cursor as Record<string, unknown>)[lastKey] = [];
          }
          const arrayItems = (cursor as Record<string, unknown>)[lastKey] as unknown[];
          if (Array.isArray(arrayItems)) {
            const idxMatch = op.path.match(/\[(\d+)\]$/);
            const insertIndex = idxMatch ? Number(idxMatch[1]) : arrayItems.length;
            const isBulletArray = /outcomes$/.test(String(lastKey)) || /items$/.test(String(lastKey));
            if (isBulletArray && Array.isArray(op.value)) {
              const insertValues = (op.value as unknown[]).map(v => String(v ?? ''));
              const start = Math.max(0, Math.min(insertIndex, arrayItems.length));
              arrayItems.splice(start, 0, ...insertValues);
            } else {
              const valueToInsert = isBulletArray
                ? String(op.value as string ?? '')
                : withDefaults(String(lastKey), op.value);
              const boundedIndex = Math.max(0, Math.min(insertIndex, arrayItems.length));
              arrayItems.splice(boundedIndex, 0, valueToInsert as unknown);
            }
          }
        }
      } else if (op.op === 'remove') {
        const idxMatch = op.path.match(/\[(\d+)\]$/);
        const targetArrPath = idxMatch ? op.path.replace(/\[(\d+)\]$/, '') : op.path;
        const arrPath = targetArrPath.replace(/\[(\d+)\]/g, '.$1');
        const segments = arrPath.split('.').filter(Boolean);
        let cursor: PathCursor = next as unknown as PathCursor;
        for (let i = 0; i < segments.length - 1; i++) {
          const key = segments[i];
          if (typeof cursor === 'object' && cursor !== null && !(key in cursor)) { cursor = null; break; }
          if (typeof cursor === 'object' && cursor !== null) {
            cursor = (cursor as Record<string, unknown>)[key] as PathCursor;
          }
          if (cursor == null) break;
        }
        if (cursor && typeof cursor === 'object') {
          const lastKey = segments[segments.length - 1];
          if (lastKey in cursor) {
            const lastValue = (cursor as Record<string, unknown>)[lastKey];
            if (Array.isArray(lastValue)) {
              const arrayContainer = lastValue as ArrayContainer;
              const removeIndex = typeof op.index === 'number' ? op.index : (idxMatch ? Number(idxMatch[1]) : -1);
              if (removeIndex >= 0 && removeIndex < (arrayContainer?.length ?? 0)) {
                arrayContainer?.splice(removeIndex, 1);
              }
            } else {
              // If removing an entire array field (e.g., experience[5].outcomes), set it to empty array
              const isArrayField = /outcomes$/.test(lastKey) || /items$/.test(lastKey);
              if (isArrayField) {
                (cursor as Record<string, unknown>)[lastKey] = [];
              }
            }
          }
        }
      }
    }
    persist(next);
    setIsPreviewing(false);
    setPreviewOps(null);
    setPreviewDiffs({});
  }, [optimized, isPreviewing, previewOps, persist, previewDiffs, getDefaultInsertValue]);

  const rejectPreview = useCallback(() => {
    setIsPreviewing(false);
    setPreviewOps(null);
    setPreviewDiffs({});
  }, []);

  // Listen for accept/reject actions from the preview panel
  useEffect(() => {
    const handleAcceptAction = () => {
      if (isPreviewing) {
        acceptPreview();
      }
    };

    const handleRejectAction = () => {
      if (isPreviewing) {
        rejectPreview();
      }
    };

    document.addEventListener('resume-preview-accept', handleAcceptAction);
    document.addEventListener('resume-preview-reject', handleRejectAction);

    return () => {
      document.removeEventListener('resume-preview-accept', handleAcceptAction);
      document.removeEventListener('resume-preview-reject', handleRejectAction);
    };
  }, [isPreviewing, acceptPreview, rejectPreview]);

  const handleUpdateOptimized = useCallback((next: OptimizedResume) => {
    persist(next);
  }, [persist]);

  const value = useMemo<ResumeEditorContextValue>(() => ({
    unified,
    optimized,
    isPreviewing,
    previewOps,
    previewDiffs,
    setPreviewOps,
    setIsPreviewing,
    setPreviewDiffs,
    persist,
    getPreviewedResume,
    handleInlineChange,
    handleUpdateOptimized,
    acceptPreview,
    rejectPreview,
    getInlineIds,
    resolveIndexById,
    focusInlineElement,
    focusAfterRemove,
  }), [unified, optimized, isPreviewing, previewOps, previewDiffs, persist, getPreviewedResume, handleInlineChange, handleUpdateOptimized, acceptPreview, rejectPreview, getInlineIds, resolveIndexById, focusInlineElement, focusAfterRemove]);

  return (
    <ResumeEditorContext.Provider value={value}>
      {children}
    </ResumeEditorContext.Provider>
  );
}


