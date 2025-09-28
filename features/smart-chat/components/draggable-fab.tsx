import React, { useEffect, useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

interface DraggableFabProps {
  onClick: () => void;
  icon: React.ReactNode;
  initialPosition?: { left?: number; right?: number; top?: number; bottom?: number };
  snapMargin?: number;
}

const DraggableFab: React.FC<DraggableFabProps> = ({ onClick, icon, initialPosition, snapMargin = 32 }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [bounds, setBounds] = useState<{ left: number; top: number; right: number; bottom: number } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let defaultX = initialPosition?.left ?? (initialPosition?.right !== undefined ? vw - initialPosition.right : vw - snapMargin);
      let defaultY = initialPosition?.top ?? (initialPosition?.bottom !== undefined ? vh - initialPosition.bottom : vh - snapMargin);
      if (defaultX === undefined) defaultX = vw - snapMargin;
      if (defaultY === undefined) defaultY = vh - snapMargin;
      setPosition({ x: defaultX, y: defaultY });
      setBounds({ left: 0, top: 0, right: vw, bottom: vh });
    }
  }, [initialPosition, snapMargin]);

  const handleStop = (e: DraggableEvent, data: DraggableData) => {
    if (!nodeRef.current) return;
    const width = nodeRef.current.offsetWidth;
    const vw = window.innerWidth;
    let snapX = data.x;
    if (data.x + width / 2 < vw / 2) {
      snapX = snapMargin;
    } else {
      snapX = vw - width - snapMargin;
    }
    const vh = window.innerHeight;
    const snapY = Math.max(snapMargin, Math.min(data.y, vh - nodeRef.current.offsetHeight - snapMargin));
    setPosition({ x: snapX, y: snapY });
  };

  if (!position || !bounds) return null;

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStop={handleStop}
      onDrag={(_, data) => setPosition({ x: data.x, y: data.y })}
      bounds={bounds}
    >
      <div
        ref={nodeRef}
        className="fixed z-50 flex items-center justify-center cursor-pointer active:scale-95"
        style={{ touchAction: "none", transition: "left 0.4s cubic-bezier(.4,2,.6,1), right 0.4s cubic-bezier(.4,2,.6,1), top 0.4s cubic-bezier(.4,2,.6,1), transform 0.4s cubic-bezier(.4,2,.6,1)" }}
        onClick={onClick}
      >
        {icon}
      </div>
    </Draggable>
  );
};

export default DraggableFab; 