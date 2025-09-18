"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AccountSettingsErrorStateProps {
  error: string;
  currentUserId?: string;
}

export function AccountSettingsErrorState({ error, currentUserId }: AccountSettingsErrorStateProps) {
  const getErrorIcon = () => {
    if (error === "您沒有權限查看此用戶資料") {
      return (
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      );
    } else if (error === "用戶不存在") {
      return (
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      );
    } else if (error === "請先登入") {
      return (
        <div className="w-20 h-20 bg-cyan-100 dark:bg-cyan-900/20 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      );
    }
  };

  const getErrorTitle = () => {
    if (error === "您沒有權限查看此用戶資料") return "存取被拒絕";
    if (error === "用戶不存在") return "找不到用戶";
    if (error === "請先登入") return "需要登入";
    return "發生錯誤";
  };

  const getErrorDescription = () => {
    if (error === "您沒有權限查看此用戶資料") {
      return "只有特定的管理員才能查看其他用戶的個人資料";
    }
    if (error === "用戶不存在") {
      return "您要查看的用戶可能已被刪除或不存在";
    }
    if (error === "請先登入") {
      return "您需要登入才能查看個人資料頁面";
    }
    return "";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
        {/* 錯誤圖標 */}
        <div className="mb-6">
          {getErrorIcon()}
        </div>

        {/* 錯誤標題 */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {getErrorTitle()}
        </h1>

        {/* 錯誤描述 */}
        <div className="mb-8 max-w-md">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            {error}
          </p>
          {getErrorDescription() && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {getErrorDescription()}
            </p>
          )}
        </div>

        {/* 操作按鈕 */}
        <div className="flex flex-col sm:flex-row gap-4">
          {error === "請先登入" ? (
            <>
              <Button 
                asChild 
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2"
              >
                <Link href="/auth/login">
                  立即登入
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline"
                className="px-6 py-2"
              >
                <Link href="/">
                  回到首頁
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button 
                asChild 
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2"
              >
                <Link href="/dashboard">
                  返回儀表板
                </Link>
              </Button>
              {currentUserId && (
                <Button 
                  asChild 
                  variant="outline"
                  className="px-6 py-2"
                >
                  <Link href={`/account-settings/${currentUserId}`}>
                    查看我的資料
                  </Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 