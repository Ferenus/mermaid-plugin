import React, { useState } from 'react';
import templates from '../templates';
import MermaidRenderer from './MermaidRenderer';

export default function TemplatesPanel({ onSelect, onClose, theme }) {
  const [selectedName, setSelectedName] = useState(null);

  const handleCardClick = (template) => {
    setSelectedName(selectedName === template.name ? null : template.name);
  };

  const handleConfirm = (template) => {
    onSelect(template.code);
    onClose();
  };

  // Group templates into rows of 3 to insert preview after the correct row
  const columns = 3;
  const rows = [];
  for (let i = 0; i < templates.length; i += columns) {
    rows.push(templates.slice(i, i + columns));
  }

  const selectedTemplate = selectedName ? templates.find((t) => t.name === selectedName) : null;

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h3>Diagram Templates</h3>
          <button className="panel-close" onClick={onClose}>x</button>
        </div>
        <div className="panel-body">
          <div className="templates-grid-rows">
            {rows.map((row, rowIdx) => {
              const showPreviewAfter = selectedTemplate && row.some((t) => t.name === selectedName);
              return (
                <React.Fragment key={rowIdx}>
                  <div className="templates-grid">
                    {row.map((t) => (
                      <div
                        key={t.name}
                        className={`template-card${t.name === selectedName ? ' selected' : ''}`}
                        onClick={() => handleCardClick(t)}
                      >
                        <h4>{t.name}</h4>
                        <p>{t.description}</p>
                      </div>
                    ))}
                  </div>
                  {showPreviewAfter && (
                    <div className="template-inline-preview">
                      <div className="template-preview">
                        <MermaidRenderer code={selectedTemplate.code} theme={theme} />
                      </div>
                      <div className="template-confirm-actions">
                        <button className="toolbar-btn publish-btn" onClick={() => handleConfirm(selectedTemplate)}>Replace</button>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
