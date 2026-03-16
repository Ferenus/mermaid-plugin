import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';

let renderCounter = 0;

export default function MermaidRenderer({ code, theme }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const renderDiagram = useCallback(async (diagramCode) => {
    if (!containerRef.current) return;
    if (!diagramCode || !diagramCode.trim()) {
      containerRef.current.innerHTML = '<div class="mermaid-placeholder">Enter Mermaid code to see a diagram</div>';
      setError(null);
      return;
    }

    const id = `mermaid-diagram-${++renderCounter}`;
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: theme === 'dark' ? 'dark' : 'default',
        securityLevel: 'strict',
        fontFamily: '"trebuchet ms", verdana, arial, sans-serif',
        fontSize: 16,
        htmlLabels: true,
        flowchart: {
          htmlLabels: true,
          curve: 'basis',
          padding: 15,
        },
        sequence: {
          actorFontFamily: '"trebuchet ms", verdana, arial, sans-serif',
          noteFontFamily: '"trebuchet ms", verdana, arial, sans-serif',
          messageFontFamily: '"trebuchet ms", verdana, arial, sans-serif',
        },
      });

      const { svg } = await mermaid.render(id, diagramCode);
      if (containerRef.current) {
        containerRef.current.innerHTML = svg;
        setError(null);
      }
    } catch (err) {
      // Mermaid v11 inserts an error SVG into the DOM on failure — clean it up
      const errSvg = document.getElementById(id);
      if (errSvg) errSvg.remove();
      setError(err.message || 'Invalid Mermaid syntax');
      // Keep last valid render in container
    }
  }, [theme]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      renderDiagram(code);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [code, renderDiagram]);

  return (
    <div className="mermaid-renderer">
      {error && <div className="mermaid-error">{error}</div>}
      <div ref={containerRef} className="mermaid-container" />
    </div>
  );
}
