import React from 'react';

/**
 * Parses text content and converts HTTPS URLs to clickable links
 * @param text - The text content to parse
 * @returns Array of React elements (text and link elements)
 */
export function parseTextWithLinks(text: string): React.ReactNode[] {
  if (!text) return [];

  // Regular expression to match HTTPS URLs
  const urlRegex = /(https:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    // Check if this part is a URL
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 underline transition-colors"
        >
          {part}
        </a>
      );
    }
    
    // Return regular text
    return part;
  });
}

/**
 * Component that renders text with HTTPS links converted to clickable elements
 */
interface TextWithLinksProps {
  text: string | null;
  className?: string;
}

export function TextWithLinks({ text, className }: TextWithLinksProps) {
  const parsedContent = parseTextWithLinks(text || '');
  
  return (
    <span className={className}>
      {parsedContent}
    </span>
  );
}
