import { ActivityContent } from "@/features/account/components";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ActivityPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ActivityContent />
      </div>
    </div>
  );
} 