import React, { useState } from 'react';

const PAGE_SIZE = 50;

export default function HistoryPanel({ history, onRestore, onClose }) {
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(0);

  const reversedHistory = [...history].reverse();
  const totalPages = Math.max(1, Math.ceil(reversedHistory.length / PAGE_SIZE));
  const pageItems = reversedHistory.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h3>Diagram History</h3>
          <button className="panel-close" onClick={onClose}>x</button>
        </div>
        <div className="panel-body">
          {reversedHistory.length === 0 ? (
            <p className="panel-empty">No history yet. Publish your diagram to create history entries.</p>
          ) : (
            <>
              <ul className="history-list">
                {pageItems.map((entry, i) => {
                  const globalIndex = page * PAGE_SIZE + i;
                  return (
                    <li
                      key={globalIndex}
                      className={`history-item ${selected === globalIndex ? 'selected' : ''}`}
                      onClick={() => setSelected(globalIndex)}
                    >
                      <div className="history-time">
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                      <div className="history-author">by {entry.savedBy}</div>
                      {selected === globalIndex && (
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
                  );
                })}
              </ul>
              {totalPages > 1 && (
                <div className="history-pagination">
                  <button className="toolbar-btn" disabled={page === 0} onClick={() => { setPage(page - 1); setSelected(null); }}>Previous</button>
                  <span className="history-page-info">Page {page + 1} of {totalPages}</span>
                  <button className="toolbar-btn" disabled={page >= totalPages - 1} onClick={() => { setPage(page + 1); setSelected(null); }}>Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
