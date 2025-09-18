import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

export const typeIcons = {
  info: Info,
  warning: AlertCircle,
  success: CheckCircle,
  error: XCircle,
} as const;

export const typeStyles = {
  info: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-100",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950/50 dark:border-yellow-800 dark:text-yellow-100",
  success: "bg-green-50 border-green-200 text-green-900 dark:bg-green-950/50 dark:border-green-800 dark:text-green-100",
  error: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950/50 dark:border-red-800 dark:text-red-100",
} as const;

export const typeLabels = {
  info: "資訊",
  warning: "警告",
  success: "資訊",
  error: "錯誤",
} as const;

export type AnnouncementType = keyof typeof typeLabels; 