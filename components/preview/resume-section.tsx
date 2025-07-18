import { Button } from "@/components/ui/button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from '@/lib/utils';
import { Copy, GripVertical, Pencil, Trash } from "lucide-react";
import React, { useRef } from 'react';
import { toast } from "sonner";

interface ResumeSectionProps {
  title: string;
  icon?: React.ElementType;
  className?: string;
  titleClassName?: string;
  iconClassName?: string;
  children: React.ReactNode;
  showIcon?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ResumeSection = ({
  title,
  icon: Icon,
  className,
  titleClassName,
  iconClassName,
  children,
  showIcon = true,
  onEdit,
  onDelete,
}: ResumeSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  const handleCopySection = async () => {
    try {
      if (sectionRef.current) {
        const sectionText = sectionRef.current.innerText;
        await navigator.clipboard.writeText(sectionText);
        toast.success("區段內容已複製到剪貼簿！");
      }
    } catch (error) {
      console.error('複製失敗:', error);
      toast.error("複製失敗，請手動選擇文字複製");
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      toast.info("編輯功能即將推出");
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    } else {
      toast.info("刪除功能即將推出");
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <section ref={sectionRef} className={cn('resume-section group relative cursor-pointer', className)}>
          <h3 className={cn('resume-section-title', titleClassName)}>
            {Icon && showIcon && <Icon className={cn('resume-section-icon mr-2', iconClassName)} />}
            {title}
          </h3>
          <div className="resume-section-content">
            {children}
          </div>
        </section>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto p-2 py-4 rounded-full" side="left" align="start" sideOffset={40}>
        <div className="flex flex-col space-y-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 justify-center rounded-full hover:bg-gray-100"
            onClick={handleCopySection}
            title="複製此區段內容"
          >
            <Copy className="h-4 w-4 text-gray-500 font-bold" strokeWidth={3} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 justify-center rounded-full hover:bg-gray-100"
            onClick={handleEdit}
            title="編輯此區段"
          >
            <Pencil className="h-4 w-4 text-gray-500 font-bold" strokeWidth={3} />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 justify-center cursor-move rounded-full">
            <GripVertical className="h-4 w-4 text-gray-500 font-bold" strokeWidth={3} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 justify-center rounded-full hover:bg-red-50 hover:text-red-500"
            onClick={handleDelete}
            title="刪除此區段"
          >
            <Trash className="h-4 w-4 text-gray-500 font-bold" strokeWidth={3} />
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ResumeSection; 