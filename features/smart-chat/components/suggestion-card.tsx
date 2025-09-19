import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Trash2 } from "lucide-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

import { parsePatchOpsToHumanReadable } from "@/utils/patch-ops-parser";
import { PatchOp, SuggestionRecord, SuggestionTemplate } from "../types/resume-editor";

const getIndicatorBarColor = (status?: SuggestionTemplate['status']) => {
  if (!status) return 'bg-transparent';
  switch (status) {
    case 'pending':
      return 'bg-gray-300';
    case 'in_progress':
      return 'bg-orange-300';
    case 'completed':
      return 'bg-cyan-500';
  }
};

const getStatusText = (status: SuggestionTemplate['status']) => {
  switch (status) {
    case 'pending':
      return '未完成';
    case 'in_progress':
      return '進行中';
    case 'completed':
      return '已完成';
  }
};

interface SuggestionCardProps {
  suggestion?: (SuggestionRecord & { patchOps?: PatchOp[] });
  template?: (SuggestionTemplate & { patchOps?: PatchOp[] });
  onQuote: (item: SuggestionRecord | SuggestionTemplate) => void;
  onRemove: (id: string) => void;
  forceExpand?: boolean; // 新增
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, template, onQuote, onRemove, forceExpand }) => {
  const isTemplate = !!template;
  const [collapsed, setCollapsed] = useState(isTemplate ? true : false);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  // Unified fields
  const title = isTemplate
    ? (template!.status === 'completed' && template!.completedSuggestion ? template!.completedSuggestion.title : template!.title)
    : suggestion!.title;
  const description = isTemplate
    ? (template!.status === 'completed' && template!.completedSuggestion ? template!.completedSuggestion.description : template!.description)
    : suggestion!.description;
  const category = isTemplate ? template!.category : suggestion!.category;
  const id = isTemplate ? template!.id : suggestion!.id;

  // 當 forceExpand 從 false 變 true 時，自動展開（僅 template 卡片）
  const prevForceExpand = useRef(forceExpand);
  useEffect(() => {
    if (isTemplate && forceExpand && !prevForceExpand.current) {
      setCollapsed(false);
    }
    prevForceExpand.current = forceExpand;
  }, [forceExpand, isTemplate]);

  // Only measure content height when expanded
  useLayoutEffect(() => {
    if (!collapsed && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    } else if (collapsed) {
      setContentHeight(0);
    }
  }, [collapsed, title, description, category]);

  // Auto-preview when patchOps are present (on mount or when they change)
  const prevOpsStrRef = useRef<string | null>(null);
  useEffect(() => {
    try {
      const patchOps = isTemplate ? template?.patchOps : suggestion?.patchOps;
      const opsStr = JSON.stringify(patchOps || []);
      if (patchOps && patchOps.length > 0 && opsStr !== prevOpsStrRef.current) {
        window.dispatchEvent(new CustomEvent('resume-preview-patchops', { detail: { patchOps } }));
        prevOpsStrRef.current = opsStr;
      }
    } catch {}
  }, [isTemplate, template?.patchOps, suggestion?.patchOps]);

  // Prevent toggle during animation
  const handleAnimationStart = () => setIsAnimating(true);
  const handleAnimationComplete = () => setIsAnimating(false);
  const handleToggle = () => {
    if (isAnimating) return;
    setCollapsed((prev) => !prev);
  };

  return (
    <Card
      className={`overflow-hidden relative cursor-pointer select-none flex py-2 pl-2 pr-0 ${isTemplate ? 'pl-0' : ''} ${isAnimating ? 'pointer-events-none opacity-80' : ''}`}
      onClick={handleToggle}
      tabIndex={0}
      role="button"
      aria-expanded={!collapsed}
    >
      {/* Left indicator bar for templates */}
      {isTemplate && (
        <div className={`w-1.5 rounded-l-lg ${getIndicatorBarColor(template!.status)} h-full absolute left-0 top-0`} />
      )}
      <div className="flex-1 flex flex-col">
        {/* Header always present, only one CardTitle */}
        <div className="flex items-center justify-between min-h-[2.5rem] max-w-full px-4 py-2">
          <div className="flex-1 min-w-0 w-0">
            <CardTitle className="text-sm truncate overflow-hidden whitespace-nowrap max-w-full">
              {title}
            </CardTitle>
          </div>
          <AnimatePresence initial={false}>
            {collapsed && (
              <motion.div
                key="header-actions"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="flex items-center gap-1 flex-shrink-0 ml-2"
                onClick={e => { e.stopPropagation(); }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onQuote(isTemplate ? template! : suggestion!)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors rounded-lg"
                  title={isTemplate ? '引用此問題進行討論' : '引用此建議進行深入討論'}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(id)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg"
                  title={isTemplate ? '移除此問題' : '刪除此建議'}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Animated content area below header */}
        <motion.div
          initial={false}
          animate={{ height: collapsed ? 0 : contentHeight, opacity: collapsed ? 0 : 1 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
          style={{ height: collapsed && !isAnimating ? 0 : contentHeight || 'auto' }}
          onAnimationStart={handleAnimationStart}
          onAnimationComplete={handleAnimationComplete}
        >
          <div
            ref={contentRef}
            className={
              collapsed && !isAnimating
                ? 'opacity-0 pointer-events-none'
                : 'opacity-100 pointer-events-auto transition-opacity duration-300'
            }
          >
            <CardContent className="pt-2 pb-0 px-4">
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {description}
              </p>
              {/* Show patchOps human readable display for both suggestion and template */}
              {((!isTemplate && suggestion?.patchOps && suggestion.patchOps.length > 0) || 
                (isTemplate && template?.patchOps && template.patchOps.length > 0)) && (
                <div className="mt-3 text-xs">
                  <details className="group">
                    <summary className="cursor-pointer select-none text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">查看操作指示</summary>
                    <div className="mt-2 p-2 rounded bg-gray-50 dark:bg-gray-900/40 text-gray-700 dark:text-gray-200 max-h-48 overflow-y-auto">
                      {parsePatchOpsToHumanReadable(isTemplate ? template?.patchOps || [] : suggestion?.patchOps || []).map((instruction, index) => (
                        <div key={index} className="mb-1 text-sm leading-relaxed">
                          {instruction}
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between px-4 pb-2 pt-4">
              <div className="flex items-center gap-2">
                {isTemplate ? (
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300`}>
                    {getStatusText(template!.status)}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {category}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-2" onClick={e => { e.stopPropagation(); }}>
                {/* Auto-preview enabled; manual preview button removed */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onQuote(isTemplate ? template! : suggestion!)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors rounded-lg"
                  title={isTemplate ? '引用此問題進行討論' : '引用此建議進行深入討論'}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(id)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg"
                  title={isTemplate ? '移除此問題' : '刪除此建議'}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardFooter>
          </div>
        </motion.div>
      </div>
    </Card>
  );
};

export default SuggestionCard; 