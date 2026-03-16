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

    // Clamp placement so the diagram doesn't leave empty gaps
    const container = containerRef.current;
    if (!container) return;
    const inner = container.querySelector('.preview-inner, .viewer-inner');
    if (!inner) return;

    const cRect = container.getBoundingClientRect();
    const iRect = inner.getBoundingClientRect();

    let dx = 0;
    let dy = 0;

    if (iRect.width <= cRect.width) {
      // Diagram fits horizontally — keep it inside
      if (iRect.left < cRect.left) dx = cRect.left - iRect.left;
      else if (iRect.right > cRect.right) dx = cRect.right - iRect.right;
    } else {
      // Diagram wider than viewport — don't allow gaps at edges
      if (iRect.left > cRect.left) dx = cRect.left - iRect.left;
      else if (iRect.right < cRect.right) dx = cRect.right - iRect.right;
    }

    if (iRect.height <= cRect.height) {
      // Diagram fits vertically — keep it inside
      if (iRect.top < cRect.top) dy = cRect.top - iRect.top;
      else if (iRect.bottom > cRect.bottom) dy = cRect.bottom - iRect.bottom;
    } else {
      // Diagram taller than viewport — don't allow gaps at edges
      if (iRect.top > cRect.top) dy = cRect.top - iRect.top;
      else if (iRect.bottom < cRect.bottom) dy = cRect.bottom - iRect.bottom;
    }

    if (dx === 0 && dy === 0) return;

    animating.current = true;
    inner.style.transition = 'transform 0.3s ease-out';
    setTransform((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    const onEnd = () => {
      inner.style.transition = '';
      animating.current = false;
      inner.removeEventListener('transitionend', onEnd);
    };
    inner.addEventListener('transitionend', onEnd);
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
