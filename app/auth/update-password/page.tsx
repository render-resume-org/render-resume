// 關鍵！禁用靜態生成，因為包含 Supabase 相關組件
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { UpdatePasswordForm } from "@/components/update-password-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
