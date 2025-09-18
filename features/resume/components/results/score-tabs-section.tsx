"use client";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/utils";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, HelpCircle, Laptop, Rocket, Sparkles, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnalysisScore } from "./types";
import { parseAIComment } from "./utils";

interface ScoreTabsSectionProps {
  scores: AnalysisScore[];
  isVisible: boolean;
}

function getCategoryIconByChinese(category: string, active: boolean) {
  const color = active ? "text-cyan-600" : "text-gray-400";
  if (!category) return <HelpCircle className={`w-5 h-5 ${color}`} />;
  if (category.includes("技術")) return <Laptop className={`w-5 h-5 ${color}`} />;
  if (category.includes("項目")) return <Rocket className={`w-5 h-5 ${color}`} />;
  if (category.includes("經驗")) return <Briefcase className={`w-5 h-5 ${color}`} />;
  if (category.includes("教育")) return <GraduationCap className={`w-5 h-5 ${color}`} />;
  if (category.includes("成果") || category.includes("驗證")) return <Trophy className={`w-5 h-5 ${color}`} />;
  if (category.includes("專業") || category.includes("形象")) return <Sparkles className={`w-5 h-5 ${color}`} />;
  return <HelpCircle className={`w-5 h-5 ${color}`} />;
}

export function ScoreTabsSection({ 
  scores, 
  isVisible 
}: ScoreTabsSectionProps) {
  const [selectedTab, setSelectedTab] = useState(scores[0]?.category || '');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    // 量測所有 tab 內容高度，取最大值
    const heights = tabRefs.current.map(ref => ref?.offsetHeight || 0);
    setMaxHeight(Math.max(...heights, 0));
  }, [scores]);

  return (
    <Card className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-700 delay-1500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <CardHeader>
        <CardDescription>
          點擊分頁或按左右鍵查看各項評分和 AI 評語
        </CardDescription>
      </CardHeader>

      <CardContent className="h-fit">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          {/* Browser-style Tab List */}
          <div className="bg-[#f8fafb] dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 p-2">
            <div className="w-full">
              <TabsList className="flex w-full gap-2 bg-transparent p-0 h-auto relative overflow-visible">
              {scores.map((score, idx) => {
                const isActive = selectedTab === score.category;
                return (
                  <TabsTrigger
                    key={score.category}
                    value={score.category}
                    ref={(el: HTMLButtonElement | null) => { tabRefs.current[idx] = el; }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-xl transition-all duration-200 relative z-10",
                      isActive
                        ? "bg-cyan-50 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 font-semibold shadow"
                        : "bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <span>
                      {getCategoryIconByChinese(score.category, isActive)}
                    </span>
                    {isActive && (
                      <span className="text-base font-medium ml-2">{score.category}</span>
                    )}
                  </TabsTrigger>
                );
              })}
              </TabsList>
            </div>
          </div>

          {/* Tab Content with AnimatePresence */}
          <div className="flex-1 relative w-full " style={{ minHeight: maxHeight }}>
            {scores.map((score) => {
              const parsedComment = parseAIComment(score.comment);
              return (
                <div
                  key={score.category}
                  style={{
                    display: selectedTab === score.category ? 'block' : 'none',
                    width: '100%',
                    position: selectedTab === score.category ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                  }}
                >
                  <TabsContent 
                    value={score.category}
                    className="mt-0 space-y-4"
                  >
                    {/* Score Header */}
                    <motion.div 
                      className="flex items-center justify-between mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05, duration: 0.3 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div>
                          <motion.p 
                            className="text-sm text-gray-600 dark:text-gray-300"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15, duration: 0.2 }}
                          >
                            {score.description}
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>

                    {/* AI 評語區塊 */}
                    <motion.div 
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <motion.div 
                        className="flex items-center gap-4 mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25, duration: 0.2 }}
                      >
                        <span className="text-lg font-medium text-gray-900 dark:text-white">🤖 AI 評語</span>
                      </motion.div>
                      
                      {parsedComment.reasoning && (
                        <motion.div 
                          className="border-l-4 border-cyan-600 pl-4"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.3 }}
                        >
                          <h4 className="text-sm font-semibold text-cyan-600 dark:text-cyan-600 mb-2">推理過程</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {parsedComment.reasoning}
                          </p>
                        </motion.div>
                      )}
                      
                      {parsedComment.finalScore && (
                        <motion.div 
                          className="border-l-4 border-cyan-600 pl-4"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.35, duration: 0.3 }}
                        >
                          <h4 className="text-sm font-semibold text-cyan-600 dark:text-cyan-600 mb-2">最終評分</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {parsedComment.finalScore}
                          </p>
                        </motion.div>
                      )}
                      
                      {parsedComment.suggestions && (
                        <motion.div 
                          className="border-l-4 border-cyan-600 pl-4"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                        >
                          <h4 className="text-sm font-semibold text-cyan-600 dark:text-cyan-600 mb-2">改進建議</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {parsedComment.suggestions}
                          </p>
                        </motion.div>
                      )}
                      
                      {!parsedComment.reasoning && !parsedComment.finalScore && !parsedComment.suggestions && (
                        <motion.p 
                          className="text-sm text-gray-700 dark:text-gray-300"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.3 }}
                        >
                          {parsedComment.original}
                        </motion.p>
                      )}
                    </motion.div>
                  </TabsContent>
                </div>
              );
            })}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
} 