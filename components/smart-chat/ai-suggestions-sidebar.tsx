import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, ChevronLeft, ChevronRight, Circle, Lightbulb, MessageCircleQuestion, Play } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import SuggestionCard from "./suggestion-card";

export interface SuggestionRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  timestamp: Date;
}

export interface SuggestionTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in_progress' | 'completed';
  originalFollowUp?: string; // 原始的 follow-up 問題
  completedSuggestion?: SuggestionRecord; // 完成後的建議
  timestamp: Date;
}

interface AISuggestionsSidebarProps {
  suggestions: SuggestionRecord[];
  suggestionTemplates: SuggestionTemplate[];
  onQuote: (suggestion: SuggestionRecord) => void;
  onQuoteTemplate: (template: SuggestionTemplate) => void;
  onRemove: (suggestionId: string) => void;
  onRemoveTemplate: (id: string) => void;
  onComplete: () => void;
  messageCount: number;
  suggestionsScrollAreaRef: React.RefObject<HTMLDivElement | null>;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const getStatusIcon = (status: SuggestionTemplate['status']) => {
  switch (status) {
    case 'pending':
      return <Circle className="h-4 w-4 text-gray-400" />;
    case 'in_progress':
      return <Play className="h-4 w-4 text-blue-500" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
  }
};

const AISuggestionsSidebar = ({
  suggestions,
  suggestionTemplates,
  onQuote,
  onQuoteTemplate,
  onRemove,
  onRemoveTemplate,
  onComplete,
  messageCount,
  suggestionsScrollAreaRef,
  isCollapsed,
  onToggleCollapse
}: AISuggestionsSidebarProps) => {
  const totalItems = suggestions.length + suggestionTemplates.length;
  const completedTemplates = suggestionTemplates.filter(t => t.status === 'completed').length;

  // 新增：追蹤需要自動展開的 template id
  const [forceExpandId, setForceExpandId] = useState<string | null>(null);
  const prevStatuses = useRef<{ [id: string]: SuggestionTemplate['status'] }>({});
  const templateRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    // 檢查狀態變化
    for (const t of suggestionTemplates) {
      const prev = prevStatuses.current[t.id];
      if (prev && prev !== t.status && (t.status === 'in_progress' || t.status === 'completed')) {
        setForceExpandId(t.id);
      }
      prevStatuses.current[t.id] = t.status;
    }
  }, [suggestionTemplates]);

  // 當 forceExpandId 變化且該卡片存在時，自動 scrollIntoView
  useEffect(() => {
    if (forceExpandId && templateRefs.current[forceExpandId]) {
      templateRefs.current[forceExpandId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [forceExpandId]);
  
  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "h-full flex flex-col transition-all duration-300 ease-in-out",
            isCollapsed ? "w-16" : "w-[24rem]"
          )}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center min-w-0">
                {!isCollapsed && (
                  <Lightbulb className="h-5 w-5 text-cyan-600 flex-shrink-0" />
                )}
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-2 overflow-hidden"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        AI 建議記錄 ({totalItems})
                      </h3>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 py-2 border-b border-gray-200 dark:border-gray-700"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-600 rounded-full"></span>
                    追蹤問題 ({completedTemplates}/{suggestionTemplates.length})
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <div className={cn(
              "flex-1 min-h-0 overflow-y-auto",
              isCollapsed ? "p-2" : "p-6"
            )}>
              <AnimatePresence mode="wait">
                {isCollapsed ? (
                  // Collapsed view - show icons only
                  <div>
                    <ScrollArea className="h-full" ref={suggestionsScrollAreaRef}>
                      <div className="space-y-2">
                        {/* Templates */}
                        {suggestionTemplates.map((template, index) => (
                          <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex justify-center"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onQuoteTemplate(template)}
                              className="h-10 w-10 p-0 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors rounded-lg relative"
                              title={template.title}
                            >
                              {getStatusIcon(template.status)}
                              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-600 flex items-center justify-center">
                                <span className="text-xs text-white font-bold">T</span>
                              </div>
                            </Button>
                          </motion.div>
                        ))}
                        {/* Regular suggestions */}
                        {suggestions.map((suggestion, index) => (
                          <motion.div
                            key={suggestion.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (suggestionTemplates.length + index) * 0.05 }}
                            className="flex justify-center"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onQuote(suggestion)}
                              className="h-10 w-10 p-0 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors rounded-lg"
                              title={suggestion.title}
                            >
                              <MessageCircleQuestion className="h-5 w-5 text-cyan-600" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  // Expanded view - show full content
                  <div>
                    {/* Suggestion Templates Section */}
                    {suggestionTemplates.length > 0 && (
                      <div>
                        <div className="space-y-3">
                          <AnimatePresence mode="popLayout">
                            {suggestionTemplates.map((template) => (
                              <motion.div
                                key={template.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                layout
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                ref={el => { templateRefs.current[template.id] = el; }}
                              >
                                <SuggestionCard
                                  template={template}
                                  onQuote={item => {
                                    if ('status' in item) onQuoteTemplate(item);
                                  }}
                                  onRemove={onRemoveTemplate}
                                  forceExpand={forceExpandId === template.id}
                                />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}

                    {/* Regular Suggestions Section */}
                    {suggestions.length > 0 && (
                      <div>
                        {suggestionTemplates.length > 0 && (
                          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                        )}
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                          額外建議 ({suggestions.length})
                        </h4>
                        <div className="space-y-3">
                          <AnimatePresence mode="popLayout">
                            {suggestions.map((suggestion) => (
                              <motion.div
                                key={suggestion.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                layout
                                transition={{ duration: 0.2, ease: "easeOut" }}
                              >
                                <SuggestionCard suggestion={suggestion} onQuote={onQuote} onRemove={onRemove} />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Complete button (footer) */}
            {(totalItems > 0 || messageCount >= 20) && !isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <Button 
                  onClick={onComplete}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white transition-colors"
                  size="sm"
                >
                  完成對話 ({completedTemplates}/{suggestionTemplates.length} 問題完成, {suggestions.length} 額外建議)
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AISuggestionsSidebar; 