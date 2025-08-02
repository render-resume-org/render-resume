import { BannerCard, DashboardAnnouncements, RecentActivity } from "@/components/dashboard";
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
    <div className="bg-white dark:bg-gray-900">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">

          {/* First Row - Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Announcements Section - 1 column */}
            <div className="lg:col-span-1">
              <DashboardAnnouncements announcements={announcements} />
            </div>
            
            {/* Banner Card - 2 columns */}
            <div className="lg:col-span-2">
              <BannerCard />
            </div>
          </div>

          {/* Dashboard Client Component */}
          <DashboardClient />

          {/* Recent Activity */}
          <div className="mt-8">
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
} 