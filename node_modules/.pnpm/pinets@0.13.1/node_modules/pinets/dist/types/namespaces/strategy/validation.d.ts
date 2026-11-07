import { StrategyState } from './types';
/** A negative `qty` in strategy.entry / strategy.order (TradingView RE10024; 0 places nothing). */
export declare function checkOrderQty(fn: 'strategy.entry' | 'strategy.order', qty: unknown): void;
/**
 * `qty_percent` outside (0, 100] in strategy.exit, or outside [0, 100] in strategy.close, whose message
 * also names strategy.exit (TradingView RE10025). An na value is absent.
 */
export declare function checkQtyPercent(fn: 'strategy.exit' | 'strategy.close', pct: unknown): void;
/**
 * Re-placing a pending strategy.entry / strategy.order id with the other direction, on the same bar or a
 * later one (TradingView RE10028). The message names the command that placed the pending order.
 */
export declare function checkPendingDirection(fn: 'strategy.entry' | 'strategy.order', strategy: StrategyState, id: string, dir: number): void;
/**
 * strategy.exit needs a price leg: `profit`, `limit`, `loss` or `stop`, or `trail_offset` with `trail_price` /
 * `trail_points` (TradingView compile error CE10042; a leg given as na counts). Raised when the call runs.
 */
export declare function checkExitLegs(parsed: Record<string, unknown>): void;
