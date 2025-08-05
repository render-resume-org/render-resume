"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface RedeemCodeCardProps {
  onRedeemSuccess?: () => void;
}

export function RedeemCodeCard({ onRedeemSuccess }: RedeemCodeCardProps) {
  const [redeemCode, setRedeemCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleRedeemCode = async () => {
    if (!redeemCode.trim()) {
      toast.error('請輸入序號');
      return;
    }

    try {
      setIsRedeeming(true);
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: redeemCode.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '兌換失敗');
      }

      toast.success('兌換成功！', {
        description: `已成功兌換 ${data.subscription.plans?.title} 方案`,
      });

      setRedeemCode('');
      onRedeemSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '兌換失敗，請稍後再試';
      toast.error('兌換失敗', {
        description: errorMessage,
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Gift className="h-5 w-5 mr-2" />
          序號兌換
        </CardTitle>
        <CardDescription>
          輸入序號來兌換方案或升級您的帳戶
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center">
        <div className="flex gap-4 w-full">
          <div className="flex-1">
            <Label htmlFor="redeem-code"></Label>
            <Input
              id="redeem-code"
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value)}
              placeholder="輸入您的序號"
              disabled={isRedeeming}
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={handleRedeemCode}
              disabled={isRedeeming || !redeemCode.trim()}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isRedeeming ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Gift className="h-4 w-4 mr-2" />
              )}
              兌換
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 