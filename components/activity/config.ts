import { Activity, Download, Eye, FileText, MessageSquare, Upload, User } from "lucide-react";

// Constants
const ACTION_ICONS = {
    'view announcement': Eye,
    'build resume': FileText,
    'optimize resume': Activity,
    'view account settings': User,
    'download resume': Download,
    'send smart chat message': MessageSquare,
    'upload smart chat attachment': Upload,
  } as const;
  
// Activity action labels mapping
export const ACTION_LABELS = {
  'view announcement': '查看公告',
  'build resume': '建立履歷',
  'optimize resume': '優化履歷',
  'view account settings': '查看個人資料',
  'download resume': '下載履歷',
  'send smart chat message': '發送智能對話',
  'upload smart chat attachment': '上傳附件',
} as const;

// Utility function to get action display info
export function getActionDisplayInfo(action: string) {
  const Icon = ACTION_ICONS[action as keyof typeof ACTION_ICONS] || Activity;
  const label = ACTION_LABELS[action as keyof typeof ACTION_LABELS] || action;
  return { Icon, label };
} 