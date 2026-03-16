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

    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: theme === 'dark' ? 'dark' : 'default',
        securityLevel: 'strict',
      });

      const id = `mermaid-diagram-${++renderCounter}`;
      const { svg } = await mermaid.render(id, diagramCode);
      if (containerRef.current) {
        containerRef.current.innerHTML = svg;
        setError(null);
      }
    } catch (err) {
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
