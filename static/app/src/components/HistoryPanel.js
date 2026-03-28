import React, { useState, useEffect } from 'react';

const PAGE_SIZE = 50;

export default function HistoryPanel({ fetchPage, onRestore, onClose }) {
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(0);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPage(page).then((result) => {
      if (cancelled) return;
      setItems(result.items);
      setTotal(result.total);
      setLoading(false);
    }).catch(() => {
      if (cancelled) return;
      setItems([]);
      setTotal(0);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [page, fetchPage]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h3>Diagram History</h3>
          <button className="panel-close" onClick={onClose}>x</button>
        </div>
        <div className="panel-body">
          {loading ? (
            <p className="panel-empty">Loading...</p>
          ) : items.length === 0 && page === 0 ? (
            <p className="panel-empty">No history yet. Publish your diagram to create history entries.</p>
          ) : (
            <>
              <ul className="history-list">
                {items.map((entry, i) => {
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
