/**
 * Maximum drawdown percent. Pine's semantic is the RUNNING MAX of
 * `(latched_drawdown / equity_at_that_latch) × 100` across all latch
 * events over the strategy's lifetime — NOT a derived
 * `(current_max_drawdown / current_equity_at_peak) × 100`. The two
 * interpretations diverge when a later latch produces a larger absolute
 * drawdown but a smaller percentage (because equity grew faster than
 * the drawdown), in which case the earlier latch's higher ratio is the
 * reported value.
 *
 * The running max is maintained in `updateEquityPeaks` (utils.ts) on
 * every latch event; this getter is a pure read.
 */
export declare function max_drawdown_percent(context: any): () => any;
