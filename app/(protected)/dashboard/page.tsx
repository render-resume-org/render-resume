export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { Announcements } from "@/components/announcements";
import { DashboardClient } from "@/components/dashboard-client";
import { getActiveAnnouncements } from "@/lib/actions/announcements";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // 获取公告数据
  const announcements = await getActiveAnnouncements();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">

          {/* Announcements Section */}
          <Announcements announcements={announcements} />

          {/* Dashboard Client Component */}
          <DashboardClient />
        </div>
      </main>
    </div>
  );
} 