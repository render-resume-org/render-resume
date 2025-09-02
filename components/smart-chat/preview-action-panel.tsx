import { Button } from "@/components/ui/button";

interface PreviewActionPanelProps {
  onAccept: () => void;
  onReject: () => void;
  className?: string;
}

export default function PreviewActionPanel({ onAccept, onReject, className }: PreviewActionPanelProps) {
  return (
    <div className={`pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center z-10 ${className || ''}`}>
      <div className="pointer-events-auto backdrop-blur-sm bg-white/70 dark:bg-gray-900/60 shadow-lg rounded-xl px-3 py-2 flex items-center gap-2 border border-gray-200/60 dark:border-gray-700/60">
        <span className="text-sm text-gray-700 dark:text-gray-200 px-2">預覽變更</span>
        <Button
          size="sm"
          onClick={onAccept}
          className="text-sm px-3 py-1 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          接受
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onReject}
          className="text-sm px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
        >
          拒絕
        </Button>
      </div>
    </div>
  );
}
