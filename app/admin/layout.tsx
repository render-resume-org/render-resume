"use client";

import {
  BarChart3,
  Bell,
  Mail,
  Settings,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";



const adminNavItems = [
  {
    title: "總覽",
    href: "/admin",
    icon: BarChart3,
    description: "系統概況與統計資料"
  },
  {
    title: "用戶管理", 
    href: "/admin/users",
    icon: Users,
    description: "管理用戶帳戶與權限"
  },
  {
    title: "公告管理",
    href: "/admin/announcements",
    icon: Bell,
    description: "管理系統公告"
  },
  {
    title: "郵件群發",
    href: "/admin/email",
    icon: Mail,
    description: "發送郵件給使用者"
  },
  {
    title: "系統設定",
    href: "/admin/settings",
    icon: Settings,
    description: "系統配置與參數"
  },
  {
    title: "測試郵件",
    href: "/admin/test-email",
    icon: Mail,
    description: "測試郵件模板"
  }
];

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/auth');
      const data = await response.json();
      
      if (!response.ok || !data.isAdmin) {
        router.push('/auth/login');
        return;
      }
      
      setAdminUser(data.user);
    } catch (error) {
      console.error('Admin auth check failed:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主要導航 */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-3 py-4 border-b-2 text-sm font-medium whitespace-nowrap
                    ${isActive 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 主要內容區域 */}
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
