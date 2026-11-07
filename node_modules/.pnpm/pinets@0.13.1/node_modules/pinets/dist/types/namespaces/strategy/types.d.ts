/**
 * Strategy configuration options.
 *
 * Field names mirror Pine's strategy() declaration parameters exactly
 * (snake_case, single-word where Pine uses one word). See
 * https://www.tradingview.com/pine-script-reference/v5/#fun_strategy
 */
export interface StrategyConfig {
    title: string;
    shorttitle?: string;
    overlay: boolean;
    format?: string;
    precision?: number;
    scale?: string;
    pyramiding?: number;
    calc_on_order_fills?: boolean;
    calc_on_every_tick?: boolean;
    max_bars_back?: number;
    backtest_fill_limits_assumption?: number;
    default_qty_type?: string;
    default_qty_value?: number;
    initial_capital?: number;
    currency?: string;
    slippage?: number;
    commission_type?: string;
    commission_value?: number;
    process_orders_on_close?: boolean;
    close_entries_rule?: string;
    margin_long?: number;
    margin_short?: number;
    explicit_plot_zorder?: boolean;
    max_lines_count?: number;
    max_labels_count?: number;
    max_boxes_count?: number;
    max_polylines_count?: number;
    calc_bars_count?: number;
    risk_free_rate?: number;
    use_bar_magnifier?: boolean;
    fill_orders_on_standard_ohlc?: boolean;
    dynamic_requests?: boolean;
    behind_chart?: boolean;
}
/**
 * A single trade — either currently open or already closed.
 *
 * Field names mirror Pine's per-trade getters from
 * strategy.closedtrades.*(idx) / strategy.opentrades.*(idx).
 *
 * `size` is SIGNED to match Pine: positive = long, negative = short.
 * The historical direction/qty pair has been collapsed into this single
 * field, matching what `strategy.closedtrades.size(idx)` returns.
 */
export interface Trade {
    id: string;
    _exits_filled?: Set<string>;
    _fav?: number;
    _adv?: number;
    _obsFrom?: number;
    _openBar?: number;
    _openAt?: number;
    _entry_qty?: number;
    entry_id: string;
    entry_price: number;
    entry_bar_index: number;
    entry_time: number;
    entry_comment?: string;
    exit_id?: string;
    exit_price?: number;
    exit_bar_index?: number;
    exit_time?: number;
    exit_comment?: string;
    size: number;
    profit?: number;
    commission?: number;
    max_drawdown?: number;
    max_runup?: number;
    status: 'open' | 'closed';
    /**
     * PHYSICAL entry price of this lot, immutable — used to compute
     * per-lot exit-bracket levels (strategy.exit profit/loss ticks).
     * Distinct from `entry_price`, which is the LEDGER value and can be
     * swapped by FIFO entry/exit pairing when a newer lot's bracket fills
     * before an older lot's (TV ledger convention).
     */
    _bracket_entry?: number;
    /** Closed rows: the entry-leg part of `commission` (base of the `*_percent` getters). */
    _entry_commission?: number;
    _intrabarEntry?: {
        bar: number;
        level: number;
        type: 'limit' | 'stop';
        dir: number;
    };
}
/**
 * A pending or filled order tracked internally by the engine.
 *
 * No Pine API exposes pending orders directly. Field names follow Pine's
 * `strategy.entry()` / `strategy.order()` parameter names where they map
 * (`limit`, `stop`, `oca_name`, `oca_type`), and snake_case for the rest.
 */
export interface Order {
    id: string;
    direction: number;
    qty: number;
    type: 'market' | 'limit' | 'stop' | 'stop-limit';
    limit?: number;
    stop?: number;
    bar: number;
    time: number;
    oca_name?: string;
    oca_type?: 'cancel' | 'reduce' | 'none';
    comment?: string;
    fill_price?: number;
    fill_bar?: number;
    fill_time?: number;
    status: 'pending' | 'filled' | 'cancelled';
    category?: 'entry' | 'exit';
    profit?: number;
    loss?: number;
    trail_price?: number;
    trail_offset?: number;
    trail_points?: number;
    from_entry?: string;
    qty_percent?: number;
    comment_profit?: string;
    comment_loss?: string;
    comment_trailing?: string;
    alert_message?: string;
    alert_profit?: string;
    alert_loss?: string;
    alert_trailing?: string;
    disable_alert?: boolean;
    immediately?: boolean;
    _isReversalEntry?: boolean;
    _attachedAtReversal?: boolean;
    _placedWithPosition?: boolean;
    _seq?: number;
    _placed?: number;
    _priceLegsWin?: boolean;
    _placedDir?: number;
    _stopTriggered?: boolean;
    _deferredPastExits?: number;
    _trailByTrade?: Record<string, {
        armed: boolean;
        peak: number;
    }>;
    _trailPriceRaw?: number;
    _risk?: boolean;
    _intended_trade_ids?: string[];
}
/**
 * Strategy state stored on the Context after a backtest run.
 *
 * Top-level scalars mirror Pine's `strategy.*` properties 1:1 (snake_case,
 * Pine's single-word concatenations like `netprofit` / `grossprofit` /
 * `grossloss` / `openprofit` preserved). Position fields are FLATTENED
 * — Pine exposes `strategy.position_size` / `position_avg_price` /
 * `position_entry_name` as three separate scalars, not a nested object.
 *
 * The `opentrades` / `closedtrades` arrays use Pine's exact names with
 * `.length` providing the count — same semantic as Pine's int count but
 * also indexable for the per-trade getter equivalents.
 */
export interface StrategyState {
    config: StrategyConfig;
    opentrades: Trade[];
    closedtrades: Trade[];
    pending_orders: Order[];
    position_size: number;
    position_avg_price: number;
    position_entry_name: string;
    initial_capital: number;
    account_currency: string;
    equity: number;
    netprofit: number;
    grossprofit: number;
    grossloss: number;
    openprofit: number;
    cagr: number;
    max_drawdown: number;
    max_runup: number;
    equity_peak: number;
    equity_trough: number;
    equity_at_runup_peak: number;
    equity_at_drawdown_peak: number;
    max_drawdown_percent_value: number;
    max_runup_percent_value: number;
    sharpe_ratio: number;
    sortino_ratio: number;
    buy_and_hold_pnl: number;
    buy_and_hold_per_gain: number;
    strategy_outperformance: number;
    _first_entry_price?: number;
    _monthly_equity?: number[];
    _last_month_key?: number;
    wintrades: number;
    losstrades: number;
    eventrades: number;
    wintrades_total_profit: number;
    losstrades_total_loss: number;
    max_contracts_held_all: number;
    max_contracts_held_long: number;
    max_contracts_held_short: number;
    risk_rules: {
        allow_entry_in?: 'long' | 'short' | 'all';
        max_cons_loss_days?: {
            count: number;
            alert_message?: string;
        };
        max_drawdown?: {
            value: number;
            type: 'cash' | 'percent_of_equity';
        };
        max_intraday_filled_orders?: {
            count: number;
            alert_message?: string;
        };
        max_intraday_loss?: {
            value: number;
            type: 'cash' | 'percent_of_equity';
        };
        max_position_size?: number;
    };
    risk_halted: boolean;
    _exit_fallback_last_bar?: number;
}
