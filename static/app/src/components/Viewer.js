import React from 'react';
import MermaidRenderer from './MermaidRenderer';
import ZoomControls from './ZoomControls';
import usePanZoom from '../hooks/usePanZoom';

export default function Viewer({ code, theme }) {
  const panZoom = usePanZoom();

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
      ref={panZoom.containerRef}
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
        <MermaidRenderer code={code} theme={theme} />
      </div>
      <ZoomControls
        onResetZoom={panZoom.resetZoom}
        onZoomOut={panZoom.zoomOut}
        onZoomIn={panZoom.zoomIn}
      />
    </div>
  );
}
