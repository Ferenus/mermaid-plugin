import React, { useState, useCallback, useRef, useEffect } from 'react';
import MermaidRenderer from './MermaidRenderer';
import ZoomControls from './ZoomControls';
import usePanZoom from '../hooks/usePanZoom';

export default function Viewer({ code, theme }) {
  const panZoom = usePanZoom();
  const [contentHeight, setContentHeight] = useState(null);
  const svgDims = useRef(null);
  const rootElRef = useRef(null);
  const lastWidthRef = useRef(0);

  const doFit = useCallback((containerWidth) => {
    if (!svgDims.current) return;
    const { w, h } = svgDims.current;
    const result = panZoom.fitToView(w, h, containerWidth);
    if (result) {
      setContentHeight(result.height + 16);
    }
  }, [panZoom.fitToView]);

  // Called by MermaidRenderer after the SVG is injected into the DOM.
  const handleRender = useCallback((svgEl) => {
    const vb = svgEl.getAttribute('viewBox');
    let w, h;
    if (vb) {
      const parts = vb.split(/[\s,]+/);
      w = parseFloat(parts[2]);
      h = parseFloat(parts[3]);
    }
    if (!w || !h) {
      w = parseFloat(svgEl.getAttribute('width'));
      h = parseFloat(svgEl.getAttribute('height'));
    }
    if (!w || !h) return;

    // Remove mermaid's width="100%" and max-width so the SVG renders at
    // its viewBox size; fitToView handles scaling via CSS transform.
    svgEl.style.removeProperty('max-width');

    // Mermaid mindmaps can generate content that overflows the viewBox.
    // Add padding to the viewBox to ensure all content is visible.
    const pad = 50;
    const vbParts = (svgEl.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number);
    const vbX = (vbParts[0] || 0) - pad;
    const vbY = (vbParts[1] || 0) - pad;
    w += pad * 2;
    h += pad * 2;
    svgEl.setAttribute('viewBox', `${vbX} ${vbY} ${w} ${h}`);
    svgEl.setAttribute('width', w);
    svgEl.setAttribute('height', h);

    svgDims.current = { w, h };
    doFit();
  }, [doFit]);

  // Merge refs for panZoom and our local ref
  const setRootRef = useCallback((el) => {
    rootElRef.current = el;
    panZoom.containerRef.current = el;
  }, [panZoom.containerRef]);

  // Use ResizeObserver on the root element - fires after the element
  // has actually been resized, unlike window.resize which can fire
  // before the iframe layout updates.
  useEffect(() => {
    const el = rootElRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const newWidth = entry.contentRect.width;
      // Only refit if width actually changed (ignore height-only changes from our own setState)
      if (Math.abs(newWidth - lastWidthRef.current) > 1) {
        lastWidthRef.current = newWidth;
        doFit(newWidth);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [doFit]);

  if (!code) {
    return (
      <div className="viewer-empty">
        No diagram yet. Click the edit icon to add one.
      </div>
    );
  }

  return (
    <div
      className="viewer-root"
      ref={setRootRef}
      style={contentHeight ? { height: contentHeight } : undefined}
      onMouseDown={panZoom.onMouseDown}
      onMouseMove={panZoom.onMouseMove}
      onMouseUp={panZoom.onMouseUp}
      onMouseLeave={panZoom.onMouseUp}
    >
      <div
        className="viewer-inner"
        style={{
          transform: `translate(${panZoom.transform.x}px, ${panZoom.transform.y}px) scale(${panZoom.transform.scale})`,
          transformOrigin: '0 0',
        }}
      >
        <MermaidRenderer code={code} theme={theme} onRender={handleRender} />
      </div>
      <ZoomControls
        onResetZoom={() => doFit()}
        onZoomOut={panZoom.zoomOut}
        onZoomIn={panZoom.zoomIn}
      />
    </div>
  );
}
