import React, { useEffect, useState } from 'react';
import { invoke, view, events } from '@forge/bridge';
import Editor from './components/Editor';
import Viewer from './components/Viewer';
import './App.css';

function App() {
  const [context, setContext] = useState(null);
  const [code, setCode] = useState('');
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  const loadDiagram = (ctx) => {
    const contentId = ctx?.extension?.content?.id || 'unknown';
    const macroId = ctx?.extension?.macro?.id || ctx?.localId || 'default';
    const storageKey = `${contentId}_${macroId}`;

    return invoke('getDiagram', { key: storageKey }).then((data) => {
      if (data && data.code) {
        setCode(data.code);
      }
    }).catch(() => {});
  };

  useEffect(() => {
    // Enable theming
    view.theme.enable().catch(() => {});

    // Race getContext against a timeout (bridge hangs outside Confluence)
    const contextTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 3000)
    );

    Promise.race([view.getContext(), contextTimeout]).then((ctx) => {
      setContext(ctx);

      // Determine theme from context
      if (ctx.theme?.colorMode === 'dark') {
        setTheme('dark');
      }

      loadDiagram(ctx).finally(() => setLoading(false));

      // Listen for diagram updates from the config editor via Forge events
      const unsubscribe = events.on('DIAGRAM_UPDATED', (data) => {
        if (data && data.code !== undefined) {
          setCode(data.code);
        }
      });

      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }).catch(() => {
      // Running outside Confluence or bridge unavailable - show editor with defaults
      setLoading(false);
    });

    // Listen for theme changes
    const handleThemeChange = (themeData) => {
      setTheme(themeData.colorMode === 'dark' ? 'dark' : 'light');
    };
    if (typeof view.theme.onChange === 'function') {
      view.theme.onChange(handleThemeChange).catch(() => {});
    }
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Detect config mode (editor): bridge type, URL param, tunnel port, or no context
  const urlParams = new URLSearchParams(window.location.search);
  const isConfigMode = context?.extension?.type === 'macro:config'
    || urlParams.get('mode') === 'config'
    || window.location.port === '8001'
    || !context;

  const contentId = context?.extension?.content?.id || 'unknown';
  const macroId = context?.extension?.macro?.id || context?.localId || 'default';
  const storageKey = `${contentId}_${macroId}`;

  if (isConfigMode) {
    return (
      <div className={`app ${theme}`} data-theme={theme}>
        <Editor storageKey={storageKey} initialCode={code} theme={theme} />
      </div>
    );
  }

  // Inline macro on the page (both edit and view mode) - show graph only
  return (
    <div className={`app ${theme}`} data-theme={theme}>
      <Viewer code={code} theme={theme} />
    </div>
  );
}

export default App;
