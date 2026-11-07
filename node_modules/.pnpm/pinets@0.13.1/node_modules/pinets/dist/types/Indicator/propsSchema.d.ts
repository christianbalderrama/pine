import type { IPineProp } from './types';
export declare const INDICATOR_PROPS: IPineProp[];
export declare const STRATEGY_PROPS: IPineProp[];
/**
 * Pick the right schema for a detected declaration type. Returns the
 * indicator schema when type is unknown (sensible fallback per spec).
 */
export declare function propsForDeclaration(type: 'indicator' | 'strategy' | null): IPineProp[];
