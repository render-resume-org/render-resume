"use client";

import ResumePreview from '@/components/preview/resume-preview';
import ZoomToolbar from '@/components/smart-chat/zoom-toolbar';
import { ResumeTemplate } from '@/lib/config/resume-templates';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ResumeEditorProvider, useResumeEditorRequired } from './context/resume-editor-context';

interface ResumeEditorPreviewProps {
  template: ResumeTemplate;
  className?: string;
}

function ResumeEditorPreviewInner({ template }: ResumeEditorPreviewProps) {
  const { optimized, isPreviewing, previewOps, previewDiffs, getPreviewedResume, handleInlineChange, handleUpdateOptimized } = useResumeEditorRequired();
  const [scale, setScale] = useState<number>(1);
  const [translate, setTranslate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragOriginRef = useRef<{ startX: number; startY: number; startTx: number; startTy: number } | null>(null);
  const mouseMoveHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);
  const mouseUpHandlerRef = useRef<(() => void) | null>(null);
  const touchMoveHandlerRef = useRef<((e: TouchEvent) => void) | null>(null);
  const touchEndHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (scale === 1 && (translate.x !== 0 || translate.y !== 0)) {
      setTranslate({ x: 0, y: 0 });
    }
  }, [scale, translate.x, translate.y]);

  const isInteractiveElement = (el: HTMLElement | null): boolean => {
    let node: HTMLElement | null = el;
    while (node) {
      const tag = node.tagName.toLowerCase();
      if (
        tag === 'input' || tag === 'textarea' || tag === 'button' || tag === 'select' ||
        node.isContentEditable || node.getAttribute('role') === 'textbox'
      ) {
        return true;
      }
      node = node.parentElement;
    }
    return false;
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current || !dragOriginRef.current) return;
    const dx = e.clientX - dragOriginRef.current.startX;
    const dy = e.clientY - dragOriginRef.current.startY;
    setTranslate({ x: dragOriginRef.current.startTx + dx, y: dragOriginRef.current.startTy + dy });
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    dragOriginRef.current = null;
    document.body.style.userSelect = '';
    if (mouseMoveHandlerRef.current) {
      window.removeEventListener('mousemove', mouseMoveHandlerRef.current);
    }
    if (mouseUpHandlerRef.current) {
      window.removeEventListener('mouseup', mouseUpHandlerRef.current);
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // left button only
    if (scale === 1) return;
    const target = e.target as HTMLElement | null;
    if (isInteractiveElement(target)) return;
    isDraggingRef.current = true;
    dragOriginRef.current = { startX: e.clientX, startY: e.clientY, startTx: translate.x, startTy: translate.y };
    // avoid text selection while dragging
    document.body.style.userSelect = 'none';
    mouseMoveHandlerRef.current = handleMouseMove;
    mouseUpHandlerRef.current = handleMouseUp;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [scale, translate.x, translate.y, handleMouseMove, handleMouseUp]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDraggingRef.current || !dragOriginRef.current) return;
    const t = e.touches[0];
    if (!t) return;
    e.preventDefault();
    const dx = t.clientX - dragOriginRef.current.startX;
    const dy = t.clientY - dragOriginRef.current.startY;
    setTranslate({ x: dragOriginRef.current.startTx + dx, y: dragOriginRef.current.startTy + dy });
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
    dragOriginRef.current = null;
    if (touchMoveHandlerRef.current) {
      window.removeEventListener('touchmove', touchMoveHandlerRef.current);
    }
    if (touchEndHandlerRef.current) {
      window.removeEventListener('touchend', touchEndHandlerRef.current);
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (scale === 1) return;
    const target = e.target as HTMLElement | null;
    if (isInteractiveElement(target)) return;
    const t = e.touches[0];
    isDraggingRef.current = true;
    dragOriginRef.current = { startX: t.clientX, startY: t.clientY, startTx: translate.x, startTy: translate.y };
    touchMoveHandlerRef.current = handleTouchMove;
    touchEndHandlerRef.current = handleTouchEnd;
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  }, [scale, translate.x, translate.y, handleTouchMove, handleTouchEnd]);


  // Dispatch preview state changes to parent component
  useEffect(() => {
    document.dispatchEvent(new CustomEvent('resume-preview-state-change', { 
      detail: { isPreviewing } 
    }));
  }, [isPreviewing]);




  if (!optimized) return null;

  return (
    <div className="relative h-full">
      <div className="w-full h-full overflow-visible">
        <div className="sticky top-0 z-30 flex justify-end pointer-events-none">
          <ZoomToolbar value={scale} onChange={setScale} className="m-3 pointer-events-auto" />
        </div>
        <div
          className="flex justify-center pt-6 pb-4"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ cursor: scale !== 1 ? (isDraggingRef.current ? 'grabbing' : 'grab') : 'default' }}
        >
          <div style={{ transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`, transformOrigin: 'top center' }}>
            <ResumePreview
              resumeData={getPreviewedResume() || optimized}
              template={template}
              onUpdateResume={handleUpdateOptimized}
              editable
              analysisResult={null}
              inlineEditable
              onInlineChange={handleInlineChange}
              previewHighlights={isPreviewing ? (previewOps || []).map(op => ({ type: op.op === 'insert' ? 'insert' as const : 'set' as const, path: op.path })) : undefined}
              previewDiffs={isPreviewing ? previewDiffs : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResumeEditorPreview({ template }: ResumeEditorPreviewProps) {
  return (
    <ResumeEditorProvider>
      <ResumeEditorPreviewInner template={template} />
    </ResumeEditorProvider>
  );
}
