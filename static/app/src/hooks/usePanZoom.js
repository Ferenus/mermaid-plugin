import { useState, useRef, useCallback } from 'react';

export default function usePanZoom() {
  const containerRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const dragging = useRef(false);
  const animating = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e) => {
    if (animating.current) return;
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
    if (!dragging.current) return;
    dragging.current = false;

    // Animate placement back if the diagram is dragged completely out of bounds
    const container = containerRef.current;
    if (!container) return;
    const inner = container.querySelector('.preview-inner, .viewer-inner');
    if (!inner) return;

    const cRect = container.getBoundingClientRect();
    const iRect = inner.getBoundingClientRect();

    const outOfBounds =
      iRect.right < cRect.left ||
      iRect.left > cRect.right ||
      iRect.bottom < cRect.top ||
      iRect.top > cRect.bottom;

    if (outOfBounds) {
      animating.current = true;
      inner.style.transition = 'transform 0.3s ease-out';
      setTransform((prev) => ({ ...prev, x: 0, y: 0 }));
      const onEnd = () => {
        inner.style.transition = '';
        animating.current = false;
        inner.removeEventListener('transitionend', onEnd);
      };
      inner.addEventListener('transitionend', onEnd);
    }
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

  return {
    containerRef,
    transform,
    zoomIn,
    zoomOut,
    resetZoom,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
}
