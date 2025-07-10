import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CannedMessagesProps {
  cannedOptions: string[];
  onCannedMessage: (message: string) => void;
}

const CannedMessages = ({ cannedOptions, onCannedMessage }: CannedMessagesProps) => (
  <div className="space-y-2 min-h-[2.5rem]">
    <div className="flex flex-wrap gap-1 sm:gap-2">
      {cannedOptions.map((option, index) => (
        <motion.div
          key={`${option}-${index}`}
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
            className="text-xs text-gray-800 hover:bg-cyan-50 hover:border-cyan-300 dark:hover:bg-cyan-900/20 transition-colors"
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
    </div>
  </div>
);

export default CannedMessages; 