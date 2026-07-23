/**
 * Core dynamic rendering guards for RepoPilot.
 * Never render hardcoded field lists. Always check if data actually exists.
 */

/**
 * Returns true if a value should NOT be rendered in the UI.
 * Covers null, undefined, whitespace strings, backend sentinels ("None"/"null"),
 * numeric 0 (for empty counts), empty arrays, and empty objects.
 */
export const isEmpty = (v: unknown): boolean => {
  if (v == null) return true;
  if (typeof v === 'string') {
    const trimmed = v.trim();
    return trimmed === '' || trimmed === 'None' || trimmed === 'null';
  }
  if (typeof v === 'number') return v === 0;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return Object.keys(v as object).length === 0;
  return false;
};

/**
 * Returns true only if value has meaningful, renderable data.
 */
export const hasData = (v: unknown): boolean => !isEmpty(v);
