import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Lightbulb, Trash2 } from "lucide-react";
import { SuggestionRecord } from "../smart-chat";

interface SuggestionListProps {
  suggestions: SuggestionRecord[];
  onQuote: (suggestion: SuggestionRecord) => void;
  onRemove: (suggestionId: string) => void;
  onComplete: () => void;
  messageCount: number;
  suggestionsScrollAreaRef: React.RefObject<HTMLDivElement | null>;
}

const SuggestionList = ({ suggestions, onQuote, onRemove, onComplete, messageCount, suggestionsScrollAreaRef }: SuggestionListProps) => (
  <Card className="sticky top-4">
    <CardHeader>
      <CardTitle className="flex items-center">
        <Lightbulb className="h-5 w-5 mr-2 text-cyan-600" />
        AI 建議記錄 ({suggestions.length})
      </CardTitle>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        對話中產生的履歷優化建議
      </p>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[400px]" ref={suggestionsScrollAreaRef}>
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
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm pr-2 leading-relaxed">
                    {suggestion.title}
                  </h4>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onQuote(suggestion)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors"
                      title="引用此建議進行深入討論"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(suggestion.id)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="刪除此建議"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-xs mb-3 break-words leading-relaxed">
                  {suggestion.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="inline-block text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                    {suggestion.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {suggestion.timestamp.toLocaleTimeString('zh-TW', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
      {(suggestions.length > 0 || messageCount >= 20) && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4 border-t mt-4"
        >
          <Button 
            onClick={onComplete}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white transition-colors"
            size="sm"
          >
            完成對話 ({suggestions.length} 個建議)
          </Button>
        </motion.div>
      )}
    </CardContent>
  </Card>
);

export default SuggestionList; 