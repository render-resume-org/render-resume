import React, { useRef } from "react";

interface DraggableFabProps {
  onClick: () => void;
  icon: React.ReactNode;
  initialPosition?: { left?: number; right?: number; top?: number; bottom?: number };
  snapMargin?: number;
}

const DraggableFab: React.FC<DraggableFabProps> = ({ onClick, icon, initialPosition, snapMargin = 32 }) => {
  const fabRef = useRef<HTMLDivElement>(null);

  // 設定初始位置
  React.useEffect(() => {
    const el = fabRef.current;
    if (!el || !initialPosition) return;
    if (initialPosition.left !== undefined) el.style.left = initialPosition.left + "px";
    if (initialPosition.right !== undefined) el.style.right = initialPosition.right + "px";
    if (initialPosition.top !== undefined) el.style.top = initialPosition.top + "px";
    if (initialPosition.bottom !== undefined) el.style.bottom = initialPosition.bottom + "px";
    el.style.position = "fixed";
  }, [initialPosition]);

  // 拖曳邏輯
  const handleDragStart = (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const el = fabRef.current;
    if (!el) return;
    let shiftX = 0, shiftY = 0;
    let dragging = false;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = el.offsetWidth;
    const height = el.offsetHeight;

    function getEventXY(ev: MouseEvent | TouchEvent): { x: number; y: number } {
      if ('touches' in ev && ev.touches[0]) return { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
      const mouseEv = ev as MouseEvent;
      return { x: mouseEv.clientX, y: mouseEv.clientY };
    }

    // 型別安全轉換
    let eventXY: { x: number; y: number };
    if ((e as unknown as TouchEvent).touches) {
      eventXY = getEventXY(e as unknown as TouchEvent);
    } else {
      eventXY = getEventXY(e as unknown as MouseEvent);
    }
    const { x, y } = eventXY;
    const rect = el.getBoundingClientRect();
    shiftX = x - rect.left;
    shiftY = y - rect.top;
    dragging = true;

    function moveAt(pageX: number, pageY: number) {
      if (!fabRef.current) return;
      const el = fabRef.current;
      el.style.left = Math.max(0, Math.min(pageX - shiftX, window.innerWidth - width)) + "px";
      el.style.top = Math.max(0, Math.min(pageY - shiftY, window.innerHeight - height)) + "px";
      el.style.right = "auto";
      el.style.bottom = "auto";
      el.style.position = "fixed";
    }

    function onMove(ev: MouseEvent | TouchEvent) {
      if (!dragging || !fabRef.current) return;
      const { x, y } = getEventXY(ev);
      moveAt(x, y);
    }

    function onEnd() {
      if (!fabRef.current) return;
      dragging = false;
      document.removeEventListener("mousemove", onMove as EventListener);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove as EventListener);
      document.removeEventListener("touchend", onEnd);
      // snap
      const el = fabRef.current;
      const rect = el.getBoundingClientRect();
      const snapTop = Math.max(snapMargin, Math.min(rect.top, vh - height - snapMargin));
      el.style.left = "";
      el.style.right = "";
      if (rect.left + width / 2 < vw / 2) {
        el.style.left = snapMargin + "px";
        el.style.right = "auto";
      } else {
        el.style.left = "auto";
        el.style.right = snapMargin + "px";
      }
      el.style.top = snapTop + "px";
      el.style.bottom = "auto";
      el.style.position = "fixed";
    }

    document.addEventListener("mousemove", onMove as EventListener);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove as EventListener);
    document.addEventListener("touchend", onEnd);
  };

  return (
    <div
      ref={fabRef}
      className="fixed z-50 flex items-center justify-center cursor-pointer active:scale-95"
      style={{ touchAction: "none", transition: "left 0.4s cubic-bezier(.4,2,.6,1), right 0.4s cubic-bezier(.4,2,.6,1), top 0.4s cubic-bezier(.4,2,.6,1)" }}
      draggable
      onClick={onClick}
      onDragStart={e => { e.preventDefault(); handleDragStart(e); }}
      onTouchStart={e => { handleDragStart(e); }}
    >
      {icon}
    </div>
  );
};

export default DraggableFab; 