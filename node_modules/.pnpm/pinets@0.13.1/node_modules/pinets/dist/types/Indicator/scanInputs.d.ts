import type { IPineInput } from './types';
/**
 * Public entry point. Returns `[]` for invalid Pine or for non-string source.
 * `libraries` (import path → source) lets `input.enum()` read imported enums.
 */
export declare function scanInputs(source: unknown, libraries?: Record<string, string>): IPineInput[];
