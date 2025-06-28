"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClient();
        
        // 從 URL 中獲取認證代碼
        const code = searchParams.get('code');
        
        if (code) {
          // 使用代碼交換 session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('❌ [Auth Callback] Exchange error:', error);
            setError(error.message);
            setStatus('error');
            return;
          }

          if (data.session) {
            console.log('✅ [Auth Callback] Session established:', data.session.user.email);
            setStatus('success');
            
            // 減少延遲時間，更快速的重定向
            setTimeout(() => {
              router.replace('/dashboard'); // 使用 replace 而不是 push
            }, 800); // 從 1500ms 減少到 800ms
          } else {
            console.log('⚠️ [Auth Callback] No session in exchange response');
            setError('無法建立認證會話');
            setStatus('error');
          }
        } else {
          // 如果沒有代碼，檢查現有 session
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('❌ [Auth Callback] Session error:', error);
            setError(error.message);
            setStatus('error');
            return;
          }

          if (data.session) {
            console.log('✅ [Auth Callback] Existing session found:', data.session.user.email);
            setStatus('success');
            
            setTimeout(() => {
              router.replace('/dashboard'); // 使用 replace 而不是 push
            }, 800); // 從 1500ms 減少到 800ms
          } else {
            console.log('⚠️ [Auth Callback] No code and no session');
            setError('未找到有效的認證信息');
            setStatus('error');
          }
        }
      } catch (err) {
        console.error('❌ [Auth Callback] Unexpected error:', err);
        setError(err instanceof Error ? err.message : '認證過程中發生未知錯誤');
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  const handleRetry = () => {
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto"></div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              正在驗證...
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              請稍候，我們正在處理您的登入請求
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              登入成功！
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              正在重定向到您的儀表板...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              如果系統沒有自動導向，請
              <a 
                href="/dashboard" 
                className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 underline ml-1"
              >
                點擊連結跳轉
              </a>
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              認證失敗
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {error || '登入過程中發生錯誤，請重試'}
            </p>
            <button
              onClick={handleRetry}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              重新登入
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto"></div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            載入中...
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            正在初始化認證系統
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
} 