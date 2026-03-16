import React from 'react';
import MermaidRenderer from './MermaidRenderer';

export default function Viewer({ code, theme }) {
  if (!code) {
    return (
      <div className="viewer-empty">
        No diagram yet. Click the edit icon to add one.
      </div>
    );
  }

  return (
    <div className="viewer-root">
      <MermaidRenderer code={code} theme={theme} />
    </div>
  );
}
