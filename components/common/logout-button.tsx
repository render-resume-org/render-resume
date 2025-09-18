"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      // 讓 use-auth hook 處理重定向
    } catch (error) {
      console.error('登出失敗:', error);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}
