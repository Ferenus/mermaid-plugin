import React from 'react';

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
          className={`toolbar-btn ${viewMode === 'code' ? 'active' : ''}`}
          onClick={() => onViewModeChange('code')}
          title="Code only"
        >
          Code
        </button>
        <button
          className={`toolbar-btn ${viewMode === 'both' ? 'active' : ''}`}
          onClick={() => onViewModeChange('both')}
          title="Split view"
        >
          Both
        </button>
        <button
          className={`toolbar-btn ${viewMode === 'graph' ? 'active' : ''}`}
          onClick={() => onViewModeChange('graph')}
          title="Graph only"
        >
          Graph
        </button>
      </div>
      <div className="toolbar-group">
        <button className="toolbar-btn" onClick={onOpenTemplates} title="Diagram templates">
          Templates
        </button>
        <button className="toolbar-btn" onClick={onOpenHistory} title="Diagram history">
          History
        </button>
        <button className="toolbar-btn" onClick={onOpenHelp} title="Help">
          Help
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
