export type JsonPrimitive = string | number | boolean | null | undefined;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export interface DiffChange {
  path: string;
  type: 'add' | 'remove' | 'replace';
  before?: unknown;
  after?: unknown;
}

export function computeObjectDiff(prev: unknown, curr: unknown, basePath: string = ''): DiffChange[] {
  const changes: DiffChange[] = [];

  // Identical via JSON string (fast path)
  try {
    if (JSON.stringify(prev) === JSON.stringify(curr)) return changes;
  } catch {}

  // Handle arrays
  if (Array.isArray(prev) && Array.isArray(curr)) {
    const maxLen = Math.max(prev.length, curr.length);
    for (let i = 0; i < maxLen; i++) {
      const p = prev[i];
      const c = curr[i];
      const path = `${basePath}[${i}]`;
      if (i >= prev.length) {
        changes.push({ path, type: 'add', after: c });
      } else if (i >= curr.length) {
        changes.push({ path, type: 'remove', before: p });
      } else {
        changes.push(...computeObjectDiff(p, c, path));
      }
    }
    return changes;
  }

  // Divergent types or primitives
  if (!isObject(prev) || !isObject(curr)) {
    changes.push({ path: basePath || '/', type: 'replace', before: prev, after: curr });
    return changes;
  }

  // Objects
  const prevKeys = new Set(Object.keys(prev));
  const currKeys = new Set(Object.keys(curr));

  for (const key of currKeys) {
    const path = basePath ? `${basePath}.${key}` : key;
    if (!prevKeys.has(key)) {
      changes.push({ path, type: 'add', after: (curr as Record<string, unknown>)[key] });
    } else {
      changes.push(
        ...computeObjectDiff(
          (prev as Record<string, unknown>)[key],
          (curr as Record<string, unknown>)[key],
          path
        )
      );
    }
  }
  for (const key of prevKeys) {
    if (!currKeys.has(key)) {
      const path = basePath ? `${basePath}.${key}` : key;
      changes.push({ path, type: 'remove', before: (prev as Record<string, unknown>)[key] });
    }
  }
  return changes;
}

export function formatDiffAsBullets(changes: DiffChange[], maxItems: number = 20): string {
  if (changes.length === 0) return '無變更';
  const lines = changes.slice(0, maxItems).map((c) => {
    const path = c.path || '/';
    if (c.type === 'add') return `+ ${path}: ${summarizeValue(c.after)}`;
    if (c.type === 'remove') return `- ${path}: ${summarizeValue(c.before)}`;
    return `~ ${path}: ${summarizeValue(c.before)} -> ${summarizeValue(c.after)}`;
  });
  const suffix = changes.length > maxItems ? `\n...（其餘 ${changes.length - maxItems} 項變更省略）` : '';
  return lines.join('\n') + suffix;
}

function summarizeValue(value: unknown): string {
  if (value === null || value === undefined) return String(value);
  if (typeof value === 'string') return truncate(value, 120);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return `[${value.length} items]`;
  try {
    const json = JSON.stringify(value);
    return truncate(json, 140);
  } catch {
    return '[object]';
  }
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

export function computeResumeDiffSummary(previous: unknown | null, current: unknown | null): string | null {
  if (!previous || !current) return null;
  const changes = computeObjectDiff(previous, current, 'resume');
  if (changes.length === 0) return null;
  return formatDiffAsBullets(changes);
}


