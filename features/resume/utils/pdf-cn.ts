import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * PDF 專用的 className 處理，移除 hover 和互動相關的類別
 */
export function cnPdf(...inputs: ClassValue[]) {
  const className = twMerge(clsx(inputs));

  // 移除 PDF 不需要的互動類別
  return className
    .replace(/hover:[^\s]+/g, '')
    .replace(/cursor-pointer/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}