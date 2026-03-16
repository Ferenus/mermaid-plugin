import React from 'react';

export default function ZoomControls({ onResetZoom, onZoomOut, onZoomIn }) {
  return (
    <div className="zoom-controls">
      <button className="zoom-btn" onClick={onResetZoom} title="Reset view">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 8 3 3 8 3" />
          <polyline points="16 3 21 3 21 8" />
          <polyline points="21 16 21 21 16 21" />
          <polyline points="8 21 3 21 3 16" />
        </svg>
      </button>
      <div className="zoom-divider" />
      <button className="zoom-btn" onClick={onZoomOut} title="Zoom out">
        &minus;
      </button>
      <div className="zoom-divider" />
      <button className="zoom-btn" onClick={onZoomIn} title="Zoom in">
        +
      </button>
    </div>
  );
}
