import Resolver from '@forge/resolver';
import { kvs } from '@forge/kvs';

const resolver = new Resolver();

resolver.define('getDiagram', async (req) => {
  const { key } = req.payload;
  const data = await kvs.get(key);
  return data || { code: '', history: [] };
});

resolver.define('saveDiagram', async (req) => {
  const { key, code, savedBy } = req.payload;
  const existing = await kvs.get(key) || { code: '', history: [] };

  const historyEntry = {
    code,
    timestamp: new Date().toISOString(),
    savedBy: savedBy || 'unknown',
  };

  const history = [...existing.history, historyEntry].slice(-50);

  const data = { code, history };
  await kvs.set(key, data);
  return data;
});

resolver.define('getHistory', async (req) => {
  const { key } = req.payload;
  const data = await kvs.get(key);
  return data ? data.history : [];
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
