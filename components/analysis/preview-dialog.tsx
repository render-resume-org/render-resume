"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Eye, Share2, X } from "lucide-react";
import Image from "next/image";

interface PreviewDialogProps {
  showPreviewDialog: boolean;
  setShowPreviewDialog: (show: boolean) => void;
  previewImageUrl: string;
  handleDownloadImage: () => void;
  handleShareImage: () => void;
}

export function PreviewDialog({ 
  showPreviewDialog, 
  setShowPreviewDialog, 
  previewImageUrl, 
  handleDownloadImage, 
  handleShareImage 
}: PreviewDialogProps) {
  return (
    <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
      <DialogContent className="max-w-[95vw] mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            預覽分享圖片
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-center py-4">
          {previewImageUrl && (
            <Image
              src={previewImageUrl} 
              alt="履歷評分分享圖片" 
              width={400}
              height={0}
              className="max-w-full h-auto rounded-lg shadow-lg border border-gray-200"
              style={{ maxHeight: '400px', width: 'auto' }}
            />
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreviewDialog(false)}
            className="flex items-center"
          >
            <X className="w-4 h-4 mr-2" />
            取消
          </Button>
          <Button
            onClick={handleDownloadImage}
            className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            下載圖片
          </Button>
          <Button
            onClick={handleShareImage}
            variant="outline"
            className="border-cyan-600 text-cyan-600 hover:bg-cyan-50 flex items-center"
          >
            <Share2 className="w-4 h-4 mr-2" />
            分享圖片
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
 