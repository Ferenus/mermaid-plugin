import React, { useState, useEffect, useRef, useCallback } from 'react';
import MermaidRenderer from './MermaidRenderer';
import Toolbar from './Toolbar';
import HistoryPanel from './HistoryPanel';
import TemplatesPanel from './TemplatesPanel';
import HelpPanel from './HelpPanel';
import ZoomControls from './ZoomControls';
import usePanZoom from '../hooks/usePanZoom';
import { invoke, view, events } from '@forge/bridge';

export default function Editor({ storageKey, initialCode, theme }) {
  const [code, setCode] = useState(initialCode);
  const [viewMode, setViewMode] = useState('both');
  const [showHistory, setShowHistory] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [history, setHistory] = useState([]);
  const [splitPercent, setSplitPercent] = useState(50);
  const textareaRef = useRef(null);
  const saveTimerRef = useRef(null);
  const editorContentRef = useRef(null);
  const isDraggingRef = useRef(false);
  const panZoom = usePanZoom();

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const saveToBackend = useCallback((newCode) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      invoke('saveDiagram', {
        key: storageKey,
        code: newCode,
        savedBy: 'editor',
      }).catch(console.error);
    }, 1000);
  }, [storageKey]);

  const handleCodeChange = useCallback((e) => {
    const newCode = e.target.value;
    setCode(newCode);
    saveToBackend(newCode);
  }, [saveToBackend]);

  const handleOpenHistory = async () => {
    try {
      const h = await invoke('getHistory', { key: storageKey });
      setHistory(h || []);
    } catch (err) {
      console.error('Failed to load history:', err);
      setHistory([]);
    }
    setShowHistory(true);
  };

  const handleRestore = (restoredCode) => {
    setCode(restoredCode);
    saveToBackend(restoredCode);
  };

  const handleTemplateSelect = (templateCode) => {
    setCode(templateCode);
    saveToBackend(templateCode);
  };

  const handleClose = () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    view.close();
  };

  const handlePublish = () => {
    // Ensure any pending save completes, then close the config dialog
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    // Save, emit event to inline macro, then close
    invoke('saveDiagram', { key: storageKey, code, savedBy: 'editor' })
      .catch(console.error)
      .finally(() => {
        events.emit('DIAGRAM_UPDATED', { code });
        view.close({ code });
      });
  };

  const handleDividerMouseDown = useCallback((e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (moveEvent) => {
      if (!isDraggingRef.current || !editorContentRef.current) return;
      const rect = editorContentRef.current.getBoundingClientRect();
      const percent = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      setSplitPercent(Math.min(80, Math.max(20, percent)));
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  // Handle Tab key in textarea for indentation
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      saveToBackend(newCode);
      // Restore cursor position after React re-render
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className="editor-root">
      <Toolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenHistory={handleOpenHistory}
        onOpenTemplates={() => setShowTemplates(true)}
        onOpenHelp={() => setShowHelp(true)}
        onPublish={handlePublish}
        onClose={handleClose}
      />
      <div className={`editor-content view-${viewMode}`} ref={editorContentRef}>
        {viewMode !== 'graph' && (
          <div className="editor-pane" style={viewMode === 'both' ? { width: `${splitPercent}%` } : undefined}>
            <textarea
              ref={textareaRef}
              className="code-textarea"
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter Mermaid diagram code here..."
              spellCheck={false}
            />
          </div>
        )}
        {viewMode === 'both' && (
          <div className="split-divider" onMouseDown={handleDividerMouseDown} />
        )}
        {viewMode !== 'code' && (
          <div
            className="preview-pane"
            style={viewMode === 'both' ? { width: `${100 - splitPercent}%` } : undefined}
            ref={panZoom.containerRef}
            onMouseDown={panZoom.onMouseDown}
            onMouseMove={panZoom.onMouseMove}
            onMouseUp={panZoom.onMouseUp}
            onMouseLeave={panZoom.onMouseUp}
          >
            <div
              className="preview-inner"
              style={{
                transform: `translate(${panZoom.transform.x}px, ${panZoom.transform.y}px) scale(${panZoom.transform.scale})`,
                transformOrigin: '0 0',
              }}
            >
              <MermaidRenderer code={code} theme={theme} />
            </div>
            <ZoomControls
              onResetZoom={panZoom.resetZoom}
              onZoomOut={panZoom.zoomOut}
              onZoomIn={panZoom.zoomIn}
            />
          </div>
        )}
      </div>
      {showHistory && (
        <HistoryPanel
          history={history}
          onRestore={handleRestore}
          onClose={() => setShowHistory(false)}
        />
      )}
      {showTemplates && (
        <TemplatesPanel
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}
      {showHelp && <HelpPanel onClose={() => setShowHelp(false)} />}
    </div>
  );
}
