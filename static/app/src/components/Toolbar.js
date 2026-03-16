import React from 'react';

const IconCode = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconBoth = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="12" y1="3" x2="12" y2="21" />
  </svg>
);

const IconGraph = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <circle cx="18" cy="6" r="3" />
    <line x1="6" y1="9" x2="6" y2="21" />
    <path d="M6 9a9 9 0 0 1 9 -3" />
    <path d="M6 21a9 9 0 0 0 9 -3" />
  </svg>
);

const IconTemplates = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconHistory = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 15" />
  </svg>
);

const IconHelp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export default function Toolbar({
  viewMode,
  onViewModeChange,
  onOpenHistory,
  onOpenTemplates,
  onOpenHelp,
  onPublish,
  onClose,
}) {
  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <span className="toolbar-title">Mermaid Editor</span>
        <button
          className={`toolbar-btn icon-btn ${viewMode === 'code' ? 'active' : ''}`}
          onClick={() => onViewModeChange('code')}
          title="Code only"
        >
          <IconCode />
        </button>
        <button
          className={`toolbar-btn icon-btn ${viewMode === 'both' ? 'active' : ''}`}
          onClick={() => onViewModeChange('both')}
          title="Split view"
        >
          <IconBoth />
        </button>
        <button
          className={`toolbar-btn icon-btn ${viewMode === 'graph' ? 'active' : ''}`}
          onClick={() => onViewModeChange('graph')}
          title="Graph only"
        >
          <IconGraph />
        </button>
      </div>
      <div className="toolbar-group">
        <button className="toolbar-btn icon-btn" onClick={onOpenTemplates} title="Diagram templates">
          <IconTemplates />
        </button>
        <button className="toolbar-btn icon-btn" onClick={onOpenHistory} title="Diagram history">
          <IconHistory />
        </button>
        <button className="toolbar-btn icon-btn" onClick={onOpenHelp} title="Help">
          <IconHelp />
        </button>
        <button className="toolbar-btn publish-btn" onClick={onPublish} title="Save and close editor">
          Publish
        </button>
        <button className="toolbar-btn close-btn" onClick={onClose} title="Close without publishing">
          Close
        </button>
      </div>
    </div>
  );
}
