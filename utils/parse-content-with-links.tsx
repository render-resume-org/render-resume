import Link from "next/link";
import { ReactNode } from "react";

/**
 * Parses content text and converts HTTPS URLs to Next.js Link components
 * @param content - The text content that may contain HTTPS URLs
 * @returns Array of React nodes with Link components for HTTPS URLs
 */
export function parseContentWithLinks(content: string): ReactNode[] {
  // Regular expression to match HTTPS URLs
  const httpsUrlRegex = /(https:\/\/[^\s]+)/g;
  
  const parts = content.split(httpsUrlRegex);
  
  return parts.map((part, index) => {
    // Check if this part is an HTTPS URL
    if (httpsUrlRegex.test(part)) {
      return (
        <Link
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 underline transition-colors"
        >
          {part}
        </Link>
      );
    }
    
    // Return regular text for non-URL parts
    return part;
  });
}
