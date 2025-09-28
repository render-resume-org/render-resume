"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { Minus, Plus, RotateCcw } from "lucide-react";

interface ZoomToolbarProps {
  value: number; // e.g., 1.0 = 100%
  min?: number;
  max?: number;
  step?: number;
  onChange: (next: number) => void;
  className?: string;
}

export default function ZoomToolbar({ value, min = 0.5, max = 2, step = 0.1, onChange, className }: ZoomToolbarProps) {
  const clamp = (v: number) => Math.max(min, Math.min(max, Number(v.toFixed(2))));
  const handleZoomOut = () => onChange(clamp(value - step));
  const handleZoomIn = () => onChange(clamp(value + step));
  const handleReset = () => onChange(clamp(1));

  const percentage = Math.round(value * 100);

  return (
    <div className={cn("inline-flex items-center gap-1 rounded-md border bg-white/90 dark:bg-gray-900/90 backdrop-blur px-2 py-1 shadow-sm", className)}>
      <Button size="icon" variant="ghost" onClick={handleZoomOut} disabled={value <= min} className="h-8 w-8">
        <Minus className="h-4 w-4" />
      </Button>
      <div className="min-w-[4.5rem] text-center text-xs font-medium tabular-nums select-none">{percentage}%</div>
      <Button size="icon" variant="ghost" onClick={handleZoomIn} disabled={value >= max} className="h-8 w-8">
        <Plus className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost" onClick={handleReset} className="h-8 w-8">
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}


