import React, { useState } from 'react';
import templates from '../templates';
import MermaidRenderer from './MermaidRenderer';

export default function TemplatesPanel({ onSelect, onClose, theme }) {
  const [confirming, setConfirming] = useState(null);

  const handleSelect = (template) => {
    setConfirming(template);
  };

  const handleConfirm = () => {
    if (confirming) {
      onSelect(confirming.code);
      onClose();
    }
  };

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className={`panel${confirming ? '' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h3>{confirming ? confirming.name : 'Diagram Templates'}</h3>
          <button className="panel-close" onClick={onClose}>x</button>
        </div>
        <div className="panel-body">
          {confirming ? (
            <div className="template-confirm">
              <div className="template-preview">
                <MermaidRenderer code={confirming.code} theme={theme} />
              </div>
              <p>This will replace your current diagram. You can use Ctrl+Z to undo.</p>
              <div className="template-confirm-actions">
                <button className="toolbar-btn" onClick={handleConfirm}>Replace</button>
                <button className="toolbar-btn" onClick={() => setConfirming(null)}>Back</button>
              </div>
            </div>
          ) : (
            <div className="templates-grid">
              {templates.map((t) => (
                <div key={t.name} className="template-card" onClick={() => handleSelect(t)}>
                  <h4>{t.name}</h4>
                  <p>{t.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
