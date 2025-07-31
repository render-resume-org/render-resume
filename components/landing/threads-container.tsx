"use client";

import { motion } from "framer-motion";
import { threadsPosts } from "./data";
import ThreadsPost from "./threads-post";

export default function ThreadsContainer() {
  // 只取前三個貼文
  const displayPosts = threadsPosts.slice(0, 5);

  return (
    <div className="space-y-4">
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="space-y-0">
          {displayPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ThreadsPost
                author={post.author}
                content={post.content}
                timestamp={post.timestamp}
                likes={post.likes}
                replies={post.replies}
                reposts={post.reposts}
                shares={post.shares}
                isThread={post.isThread}
                isLastInThread={post.isLastInThread}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 