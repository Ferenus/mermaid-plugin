import { useState, useRef, useCallback } from 'react';

export default function usePanZoom() {
  const containerRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTransform((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const zoomIn = useCallback(() => {
    setTransform((prev) => ({ ...prev, scale: Math.min(prev.scale + 0.25, 5) }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform((prev) => ({ ...prev, scale: Math.max(prev.scale - 0.25, 0.25) }));
  }, []);

  const resetZoom = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale + delta, 0.25), 5),
    }));
  }, []);

  return {
    containerRef,
    transform,
    zoomIn,
    zoomOut,
    resetZoom,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
  };
}
