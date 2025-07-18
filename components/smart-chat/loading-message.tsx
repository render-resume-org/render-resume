import { motion } from "framer-motion";
import Image from "next/image";

const LoadingMessage = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex justify-start"
  >
    <div className="flex items-start space-x-2">
      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Image
          src="/images/remo.png"
          alt="AI 機器人頭像"
          width={32}
          height={32}
          className="border w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 object-cover"
          priority
        />
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
        <div className="flex space-x-1">
          <motion.div 
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div 
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
          />
          <motion.div 
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          />
        </div>
      </div>
    </div>
  </motion.div>
);

export default LoadingMessage; 