import React, { useState, useEffect } from 'react';

const PAGE_SIZE = 50;

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const pages = [];
  pages.push(0);
  let start = Math.max(1, current - 1);
  let end = Math.min(total - 2, current + 1);
  if (current <= 2) { start = 1; end = 3; }
  if (current >= total - 3) { start = total - 4; end = total - 2; }
  if (start > 1) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 2) pages.push('...');
  pages.push(total - 1);
  return pages;
}

export default function HistoryPanel({ fetchPage, onRestore, onClose }) {
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(0);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPage(page).then((result) => {
      if (cancelled) return;
      setItems(result.items);
      setTotal(result.total);
      setLoading(false);
      setInitialLoad(false);
    }).catch(() => {
      if (cancelled) return;
      setItems([]);
      setTotal(0);
      setLoading(false);
      setInitialLoad(false);
    });
    return () => { cancelled = true; };
  }, [page, fetchPage]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const goToPage = (p) => { setPage(p); setSelected(null); };
  const pageNumbers = getPageNumbers(page, totalPages);

  const renderList = () => {
    if (initialLoad) return <p className="panel-empty">Loading...</p>;
    if (items.length === 0 && page === 0) {
      return <p className="panel-empty">No history yet. Publish your diagram to create history entries.</p>;
    }
    return (
      <div className={`history-list-wrap${loading ? ' history-loading' : ''}`}>
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
      </div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1 || initialLoad) return null;
    return (
      <div className="history-pagination">
        <button className="toolbar-btn" disabled={page === 0} onClick={() => goToPage(page - 1)}>Previous</button>
        <div className="history-pages">
          {pageNumbers.map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="history-page-ellipsis">...</span>
            ) : (
              <button
                key={p}
                className={`history-page-btn${p === page ? ' active' : ''}`}
                onClick={() => goToPage(p)}
              >
                {p + 1}
              </button>
            )
          )}
        </div>
        <button className="toolbar-btn" disabled={page >= totalPages - 1} onClick={() => goToPage(page + 1)}>Next</button>
      </div>
    );
  };

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h3>Diagram History</h3>
          <button className="panel-close" onClick={onClose}>x</button>
        </div>
        <div className="panel-body">
          {renderList()}
        </div>
        {renderPagination()}
      </div>
    </div>
  );
}
