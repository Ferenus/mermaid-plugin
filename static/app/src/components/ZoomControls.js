import React from 'react';

export default function ZoomControls({ onResetZoom, onZoomOut, onZoomIn }) {
  return (
    <div className="zoom-controls">
      <button className="zoom-btn" onClick={onResetZoom} title="Fit to view">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 8 3 3 8 3" />
          <polyline points="16 3 21 3 21 8" />
          <polyline points="21 16 21 21 16 21" />
          <polyline points="8 21 3 21 3 16" />
        </svg>
      </button>
      <div className="zoom-divider" />
      <button className="zoom-btn" onClick={onZoomOut} title="Zoom out">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>
      <div className="zoom-divider" />
      <button className="zoom-btn" onClick={onZoomIn} title="Zoom in">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>
    </div>
  );
}
