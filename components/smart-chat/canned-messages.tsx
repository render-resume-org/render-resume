import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface CannedMessagesProps {
  cannedOptions: string[];
  onCannedMessage: (message: string) => void;
}

const CannedMessages = ({ cannedOptions, onCannedMessage }: CannedMessagesProps) => {
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const [visibleCount, setVisibleCount] = useState(cannedOptions.length);

  useEffect(() => {
    if (!containerRef.current) return;
    // 只在桌面版檢查
    if (window.innerWidth >= 1024) {
      const el = containerRef.current;
      // 先重設
      setShowAll(false);
      setVisibleCount(cannedOptions.length);
      // 計算一行能放幾個
      const children = Array.from(el.children) as HTMLElement[];
      let totalWidth = 0;
      const maxWidth = el.offsetWidth;
      let count = 0;
      for (let i = 0; i < children.length; i++) {
        totalWidth += children[i].offsetWidth + 8; // gap-2
        if (totalWidth > maxWidth) break;
        count++;
      }
      if (count < cannedOptions.length) {
        setIsOverflow(true);
        setVisibleCount(count);
      } else {
        setIsOverflow(false);
        setVisibleCount(cannedOptions.length);
      }
    } else {
      setIsOverflow(false);
      setVisibleCount(cannedOptions.length);
    }
  }, [cannedOptions]);

  // 手機版橫向滑動
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

  return (
    <div className="py-0 space-y-2 hfit">
      <div
        className={
          isDesktop
            ? "flex gap-2 flex-wrap overflow-visible whitespace-normal px-1"
            : "flex gap-2 overflow-x-auto whitespace-nowrap px-1"
        }
        ref={containerRef}
        style={isDesktop ? { maxHeight: showAll ? 'none' : '2.5rem', overflow: 'hidden' } : {}}
      >
        {cannedOptions.slice(0, showAll || !isOverflow ? cannedOptions.length : visibleCount).map((option, index) => (
          <motion.div
            key={`${option}-${index}`}
            className="inline-block flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{
              delay: index === 0 ? 0 : index * 0.15,
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            layout
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCannedMessage(option)}
              className="text-sm text-gray-800 hover:bg-cyan-50 hover:border-cyan-300 dark:hover:bg-cyan-900/20 transition-colors px-4 py-2"
              asChild
            >
              <motion.button
                whileTap={{
                  scale: 0.95,
                  transition: { duration: 0.1 }
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 17
                }}
              >
                {option}
              </motion.button>
            </Button>
          </motion.div>
        ))}
        {isDesktop && isOverflow && !showAll && (
          <Badge
            variant="secondary"
            className="cursor-pointer ml-2"
            onClick={() => setShowAll(true)}
          >
            +{cannedOptions.length - visibleCount}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default CannedMessages; 