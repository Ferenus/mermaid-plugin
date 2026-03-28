import React, { useState, useEffect, useRef, useCallback } from 'react';
import SimpleEditor from 'react-simple-code-editor';
import Prism from '../mermaid-prism';
import MermaidRenderer from './MermaidRenderer';
import Toolbar from './Toolbar';
import HistoryPanel from './HistoryPanel';
import TemplatesPanel from './TemplatesPanel';
import HelpPanel from './HelpPanel';
import ZoomControls from './ZoomControls';
import usePanZoom from '../hooks/usePanZoom';
import { invoke, view, events } from '@forge/bridge';

function highlight(code) {
  return Prism.highlight(code, Prism.languages.mermaid, 'mermaid');
}

export default function Editor({ storageKey, initialCode, theme }) {
  const [code, setCode] = useState(initialCode);
  const [viewMode, setViewMode] = useState('both');
  const [showHistory, setShowHistory] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [splitPercent, setSplitPercent] = useState(50);
  const [activeLine, setActiveLine] = useState(-1);
  const saveTimerRef = useRef(null);
  const editorContentRef = useRef(null);
  const isDraggingRef = useRef(false);
  const gutterRef = useRef(null);
  const editorPaneRef = useRef(null);
  const panZoom = usePanZoom();
  const svgDimsRef = useRef(null);
  const previewElRef = useRef(null);
  const lastPreviewWidthRef = useRef(0);

  const doPreviewFit = useCallback((containerWidth) => {
    if (!svgDimsRef.current) return;
    const { w, h } = svgDimsRef.current;
    panZoom.fitToView(w, h, containerWidth);
  }, [panZoom.fitToView]);

  const handlePreviewRender = useCallback((svgEl) => {
    const vb = svgEl.getAttribute('viewBox');
    let w, h;
    if (vb) {
      const parts = vb.split(/[\s,]+/);
      w = parseFloat(parts[2]);
      h = parseFloat(parts[3]);
    }
    if (!w || !h) {
      w = parseFloat(svgEl.getAttribute('width'));
      h = parseFloat(svgEl.getAttribute('height'));
    }
    if (!w || !h) return;

    svgEl.style.removeProperty('max-width');
    const pad = 50;
    const vbParts = (svgEl.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number);
    const vbX = (vbParts[0] || 0) - pad;
    const vbY = (vbParts[1] || 0) - pad;
    w += pad * 2;
    h += pad * 2;
    svgEl.setAttribute('viewBox', `${vbX} ${vbY} ${w} ${h}`);
    svgEl.setAttribute('width', w);
    svgEl.setAttribute('height', h);

    svgDimsRef.current = { w, h };
    doPreviewFit();
  }, [doPreviewFit]);

  // Re-fit preview on resize
  useEffect(() => {
    const el = previewElRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const newWidth = entry.contentRect.width;
      if (Math.abs(newWidth - lastPreviewWidthRef.current) > 1) {
        lastPreviewWidthRef.current = newWidth;
        doPreviewFit(newWidth);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [doPreviewFit]);

  const setPreviewRef = useCallback((el) => {
    previewElRef.current = el;
    panZoom.containerRef.current = el;
  }, [panZoom.containerRef]);

  const updateActiveLine = useCallback(() => {
    if (!editorPaneRef.current) return;
    const textarea = editorPaneRef.current.querySelector('textarea');
    if (!textarea) return;
    const pos = textarea.selectionStart;
    const line = textarea.value.substring(0, pos).split('\n').length - 1;
    setActiveLine(line);
  }, []);

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

  const handleCodeChange = useCallback((newCode) => {
    if (newCode === undefined) return;
    setCode(newCode);
    saveToBackend(newCode);
  }, [saveToBackend]);

  const fetchHistoryPage = useCallback(async (page) => {
    const result = await invoke('getHistory', { key: storageKey, page });
    return result || { items: [], total: 0 };
  }, [storageKey]);

  const handleOpenHistory = () => {
    setShowHistory(true);
  };

  const replaceCodeViaTextarea = useCallback((newCode) => {
    const textarea = editorPaneRef.current?.querySelector('textarea');
    if (textarea) {
      textarea.focus();
      textarea.select();
      document.execCommand('insertText', false, newCode);
    } else {
      setCode(newCode);
    }
    saveToBackend(newCode);
  }, [saveToBackend]);

  const handleRestore = (restoredCode) => {
    replaceCodeViaTextarea(restoredCode);
  };

  const handleTemplateSelect = (templateCode) => {
    replaceCodeViaTextarea(templateCode);
  };

  const handleClose = () => {
    if (code !== initialCode) {
      setShowCloseConfirm(true);
      return;
    }
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    view.close();
  };

  const handleConfirmClose = () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    invoke('saveDiagram', { key: storageKey, code: initialCode, savedBy: 'editor' })
      .catch(console.error)
      .finally(() => view.close());
  };

  const handlePublish = () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    invoke('saveDiagram', { key: storageKey, code, savedBy: 'editor', addToHistory: true })
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
          <div className="editor-pane" style={viewMode === 'both' ? { width: `${splitPercent}%` } : undefined} ref={editorPaneRef}>
            <div className="line-gutter" ref={gutterRef}>
              {code.split('\n').map((_, i) => (
                <div key={i} className={`line-number${i === activeLine ? ' active' : ''}`}>{i + 1}</div>
              ))}
            </div>
            <div className="code-editor-wrap">
              {activeLine >= 0 && (
                <div
                  className="line-highlight"
                  style={{ top: 12 + activeLine * 21 }}
                />
              )}
              <SimpleEditor
                value={code}
                onValueChange={handleCodeChange}
                highlight={highlight}
                padding={12}
                className="code-editor"
                style={{
                  fontFamily: "'SF Mono', 'Monaco', 'Menlo', 'Consolas', 'Courier New', monospace",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
                onClick={updateActiveLine}
                onKeyUp={updateActiveLine}
                onBlur={() => setActiveLine(-1)}
                onScroll={(e) => {
                  if (gutterRef.current) {
                    gutterRef.current.scrollTop = e.target.scrollTop;
                  }
                }}
              />
            </div>
          </div>
        )}
        {viewMode === 'both' && (
          <div className="split-divider" onMouseDown={handleDividerMouseDown} />
        )}
        {viewMode !== 'code' && (
          <div
            className="preview-pane"
            style={viewMode === 'both' ? { width: `${100 - splitPercent}%` } : undefined}
            ref={setPreviewRef}
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
                width: 'max-content',
              }}
            >
              <MermaidRenderer code={code} theme={theme} onRender={handlePreviewRender} />
            </div>
            <ZoomControls
              onResetZoom={() => doPreviewFit()}
              onZoomOut={panZoom.zoomOut}
              onZoomIn={panZoom.zoomIn}
            />
          </div>
        )}
      </div>
      {showHistory && (
        <HistoryPanel
          fetchPage={fetchHistoryPage}
          onRestore={handleRestore}
          onClose={() => setShowHistory(false)}
        />
      )}
      {showTemplates && (
        <TemplatesPanel
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
          theme={theme}
        />
      )}
      {showHelp && <HelpPanel onClose={() => setShowHelp(false)} />}
      {showCloseConfirm && (
        <div className="panel-overlay">
          <div className="panel panel-small">
            <div className="panel-header">
              <h3>Unsaved changes</h3>
            </div>
            <div className="panel-body">
              <p style={{ margin: '0 0 16px' }}>You have unpublished changes. Closing will discard them.</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button className="toolbar-btn" onClick={() => setShowCloseConfirm(false)}>Cancel</button>
                <button className="toolbar-btn publish-btn" onClick={handleConfirmClose}>Discard & Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
