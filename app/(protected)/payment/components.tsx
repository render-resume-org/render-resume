import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

interface PaymentContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PaymentContainer({ children, className = "" }: PaymentContainerProps) {
  return (
    <div className={`py-16 ${className}`}>
      <div className="container mx-auto px-4 max-w-2xl">
        {children}
      </div>
    </div>
  );
}

export function BackToHomeButton() {
  return (
    <Button asChild variant="outline" className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
      <Link href="/dashboard">
        <Home className="w-4 h-4 mr-2" />
        回到首頁
      </Link>
    </Button>
  );
} 