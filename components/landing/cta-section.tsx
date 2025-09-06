import { Button } from "@/components/ui/button";
import { ScrollText, Star, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-800 dark:to-blue-800 py-16 text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            準備好體驗專業級 AI 履歷分析了嗎？
          </h2>
          <p className="text-xl mb-8 opacity-90">
            加入 Waitlist，搶先體驗基於 Fortune 500 企業標準的六維度評分系統，
            讓您的履歷在競爭中脫穎而出！
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <Star className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                <div className="font-semibold">六維度評分</div>
                <div className="text-sm opacity-80">專業權威認證</div>
              </div>
              <div>
                <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                <div className="font-semibold">3分鐘完成</div>
                <div className="text-sm opacity-80">AI 快速分析</div>
              </div>
              <div>
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                <div className="font-semibold">面試機率 +N%</div>
                <div className="text-sm opacity-80">實證效果</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                立即加入 Waitlist
                <ScrollText className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <p className="text-sm mt-6 opacity-80">
            💫 註冊即表示您同意搶先體驗最新的 AI 履歷分析技術
          </p>
        </div>
      </div>
    </section>
  );
} 