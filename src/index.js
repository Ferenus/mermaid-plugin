import Resolver from '@forge/resolver';
import { kvs } from '@forge/kvs';

const resolver = new Resolver();

resolver.define('getDiagram', async (req) => {
  const { key } = req.payload;
  const data = await kvs.get(key);
  return data || { code: '', history: [] };
});

resolver.define('saveDiagram', async (req) => {
  const { key, code, savedBy, addToHistory } = req.payload;
  const existing = await kvs.get(key) || { code: '', history: [] };

  let history = existing.history;
  if (addToHistory) {
    const historyEntry = {
      code,
      timestamp: new Date().toISOString(),
      savedBy: savedBy || 'unknown',
    };
    history = [...history, historyEntry].slice(-50);
  }

  const data = { code, history };
  await kvs.set(key, data);
  return data;
});

resolver.define('getHistory', async (req) => {
  const { key, page = 0, pageSize = 50 } = req.payload;
  const data = await kvs.get(key);
  if (!data || !data.history.length) return { items: [], total: 0 };

  const history = [...data.history].reverse();
  const start = page * pageSize;
  const items = history.slice(start, start + pageSize);
  return { items, total: history.length };
});

resolver.define('clearHistory', async (req) => {
  const { key } = req.payload;
  const data = await kvs.get(key);
  if (data) {
    data.history = [];
    await kvs.set(key, data);
  }
  return { success: true };
});

export const handler = resolver.getDefinitions();
