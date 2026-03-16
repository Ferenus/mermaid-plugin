import React from 'react';

export default function ZoomControls({ onResetZoom, onZoomOut, onZoomIn }) {
  return (
    <div className="zoom-controls">
      <button className="zoom-btn" onClick={onResetZoom} title="Reset view">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 1 3 6.36" />
          <polyline points="3 22 3 12 13 12" />
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
