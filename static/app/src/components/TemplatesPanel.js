import React, { useState } from 'react';
import templates from '../templates';

export default function TemplatesPanel({ onSelect, onClose }) {
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
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h3>Diagram Templates</h3>
          <button className="panel-close" onClick={onClose}>x</button>
        </div>
        <div className="panel-body">
          {confirming ? (
            <div className="template-confirm">
              <p>This will replace your current diagram with the <strong>{confirming.name}</strong> template.</p>
              <p>You can use Ctrl+Z to undo this action.</p>
              <div className="template-confirm-actions">
                <button className="toolbar-btn" onClick={handleConfirm}>Replace</button>
                <button className="toolbar-btn" onClick={() => setConfirming(null)}>Cancel</button>
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
