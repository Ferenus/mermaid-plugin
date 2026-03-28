import React from 'react';

export default function HelpPanel({ onClose }) {
  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel panel-small" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h3>Help</h3>
          <button className="panel-close" onClick={onClose}>x</button>
        </div>
        <div className="panel-body">
          <ul className="help-links">
            <li>
              <a
                href="https://mermaid.js.org/syntax/flowchart.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Official Mermaid Documentation
              </a>
              <p>Learn about all supported diagram types and syntax.</p>
            </li>
            <li>
              <a
                href="https://mermaid.live/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mermaid Live Editor
              </a>
              <p>Try out diagrams in the official online editor.</p>
            </li>
          </ul>
          <div className="help-tips">
            <h4>Tips</h4>
            <ul>
              <li>Use the Templates button to start with a pre-built diagram.</li>
              <li>Use Ctrl+Z / Cmd+Z to undo changes in the editor.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
