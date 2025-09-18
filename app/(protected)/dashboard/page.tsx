import { BannerCard, RecentAnnouncements, FeatureCards } from "@/features/content/components";
import { RecentActivity, UsageStats } from "@/features/account/components";
import { getActiveAnnouncements } from "@/services/actions/announcements";
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
    <div className="bg-white dark:bg-gray-900" style={{ minHeight: 'calc(100vh - 80px)' }}>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 h-full">
        <div className="max-w-6xl mx-auto h-full flex flex-col">

          {/* First Row - Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Announcements Section - 1 column */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <RecentAnnouncements announcements={announcements} />
            </div>
            
            {/* Banner Card - 2 columns */}
            <div className="lg:col-span-2 h-full order-1 lg:order-2">
              <BannerCard imageUrl="/images/banner-with-slogan.png" />
            </div>
          </div>

          {/* Feature Cards Component */}
          <div className="flex-1">
            <FeatureCards />
          </div>

          {/* Last Row - 3 Slot Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Recent Activity - Left Two Slots */}
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
            
            {/* Usage Stats - Right Slot */}
            <div className="lg:col-span-1">
              <UsageStats />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 