export function setByPath<T extends object>(obj: T, path: string, value: unknown): T {
  if (!path) return obj;
  const segments = path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean);
  let cursor: Record<string, unknown> = obj as Record<string, unknown>;
  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i];
    if (!(key in cursor) || cursor[key] == null) {
      // create array or object based on next key pattern
      const next = segments[i + 1];
      cursor[key] = String(+next) === next ? [] : {};
    }
    cursor = cursor[key] as Record<string, unknown>;
  }
  const lastKey = segments[segments.length - 1];
  cursor[lastKey] = value;
  return obj;
}
