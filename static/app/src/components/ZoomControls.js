import React from 'react';

export default function ZoomControls({ onResetZoom, onZoomOut, onZoomIn }) {
  return (
    <div className="zoom-controls">
      <button className="zoom-btn" onClick={onResetZoom} title="Reset view">
        Reset view
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
