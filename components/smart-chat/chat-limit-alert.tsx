import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { CHAT_MESSAGE_LIMIT } from "./utils";

interface ChatLimitAlertProps {
  messageCount: number;
}

const ChatLimitAlert = ({ messageCount }: ChatLimitAlertProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex items-center space-x-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
  >
    <AlertCircle className="h-4 w-4 text-amber-600" />
    <span className="text-sm text-amber-800 dark:text-amber-200">
      {messageCount >= CHAT_MESSAGE_LIMIT ? `已達到對話上限（${CHAT_MESSAGE_LIMIT}則）` : `即將達到對話上限（${messageCount}/${CHAT_MESSAGE_LIMIT}）`}
    </span>
  </motion.div>
);

export default ChatLimitAlert; 