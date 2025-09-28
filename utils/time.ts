/**
 * 人性化時間顯示工具函數
 * 類似 Threads 的時間顯示方式
 */

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  // 未來時間
  if (diffInSeconds < 0) {
    return '剛剛';
  }

  // 小於 1 分鐘
  if (diffInSeconds < 60) {
    return '剛剛';
  }

  // 小於 1 小時
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}分鐘前`;
  }

  // 小於 24 小時
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}小時前`;
  }

  // 小於 7 天
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}天前`;
  }

  // 小於 30 天
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks}週前`;
  }

  // 小於 365 天
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months}個月前`;
  }

  // 超過 1 年
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years}年前`;
}

/**
 * 格式化完整日期時間
 * 用於需要顯示完整時間的場合
 */
export function formatFullDateTime(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  const now = new Date();
  const isToday = targetDate.toDateString() === now.toDateString();
  const isThisYear = targetDate.getFullYear() === now.getFullYear();

  // 今天的時間
  if (isToday) {
    return targetDate.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // 今年的日期
  if (isThisYear) {
    return targetDate.toLocaleDateString('zh-TW', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // 其他年份
  return targetDate.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * 格式化日期（不含時間）
 */
export function formatDate(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  const now = new Date();
  const isThisYear = targetDate.getFullYear() === now.getFullYear();

  // 今年的日期
  if (isThisYear) {
    return targetDate.toLocaleDateString('zh-TW', {
      month: 'long',
      day: 'numeric'
    });
  }

  // 其他年份
  return targetDate.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * 智能時間顯示
 * 根據時間距離自動選擇最適合的顯示方式
 */
export function formatSmartTime(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  // 小於 1 小時顯示相對時間
  if (diffInSeconds < 3600) {
    return formatRelativeTime(targetDate);
  }

  // 小於 24 小時顯示相對時間
  if (diffInSeconds < 86400) {
    return formatRelativeTime(targetDate);
  }

  // 小於 7 天顯示相對時間
  if (diffInSeconds < 604800) {
    return formatRelativeTime(targetDate);
  }

  // 超過 7 天顯示完整日期
  return formatFullDateTime(targetDate);
} 