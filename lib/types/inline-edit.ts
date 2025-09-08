/**
 * Shared types for inline editing functionality across resume sections
 */

export type InlineEditPayload = 
  | { path: string; value: string }
  | { action: 'addBullet' | 'removeBullet'; path: string; index: number };

export type InlineChangeHandler = (payload: InlineEditPayload) => void;
