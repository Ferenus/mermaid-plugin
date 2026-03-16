import React, { useState } from 'react';

export default function HistoryPanel({ history, onRestore, onClose }) {
  const [selected, setSelected] = useState(null);

  const reversedHistory = [...history].reverse();

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h3>Diagram History</h3>
          <button className="panel-close" onClick={onClose}>x</button>
        </div>
        <div className="panel-body">
          {reversedHistory.length === 0 ? (
            <p className="panel-empty">No history yet. Save your diagram to create history entries.</p>
          ) : (
            <ul className="history-list">
              {reversedHistory.map((entry, i) => (
                <li
                  key={i}
                  className={`history-item ${selected === i ? 'selected' : ''}`}
                  onClick={() => setSelected(i)}
                >
                  <div className="history-time">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                  <div className="history-author">by {entry.savedBy}</div>
                  {selected === i && (
                    <div className="history-preview">
                      <pre>{entry.code}</pre>
                      <button
                        className="toolbar-btn"
                        onClick={() => { onRestore(entry.code); onClose(); }}
                      >
                        Restore this version
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
