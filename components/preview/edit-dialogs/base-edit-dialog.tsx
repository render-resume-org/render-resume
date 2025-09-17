import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/utils";
import React from "react";

interface BaseEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  saveButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
  className?: string;
}

export default function BaseEditDialog({
  isOpen,
  onClose,
  onSave,
  title,
  description,
  children,
  saveButtonText = "儲存",
  cancelButtonText = "取消",
  isLoading = false,
  className,
}: BaseEditDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(className, "md:w-[60vw] w-[95vw] max-h-[90vh] overflow-y-auto")}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="py-4">{children}</div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelButtonText}
          </Button>
          <Button
            onClick={onSave}
            disabled={isLoading}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            {isLoading ? "儲存中..." : saveButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 