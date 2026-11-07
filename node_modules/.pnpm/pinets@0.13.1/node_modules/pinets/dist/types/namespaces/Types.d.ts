export declare enum order {
    ascending = 1,
    descending = 0
}
export declare enum currency {
    AED = "AED",
    ARS = "ARS",
    AUD = "AUD",
    BDT = "BDT",
    BHD = "BHD",
    BRL = "BRL",
    BTC = "BTC",
    CAD = "CAD",
    CHF = "CHF",
    CLP = "CLP",
    CNY = "CNY",
    COP = "COP",
    CZK = "CZK",
    DKK = "DKK",
    EGP = "EGP",
    ETH = "ETH",
    EUR = "EUR",
    GBP = "GBP",
    HKD = "HKD",
    HUF = "HUF",
    IDR = "IDR",
    ILS = "ILS",
    INR = "INR",
    ISK = "ISK",
    JPY = "JPY",
    KES = "KES",
    KRW = "KRW",
    KWD = "KWD",
    LKR = "LKR",
    MAD = "MAD",
    MXN = "MXN",
    MYR = "MYR",
    NGN = "NGN",
    NOK = "NOK",
    NONE = "NONE",
    NZD = "NZD",
    PEN = "PEN",
    PHP = "PHP",
    PKR = "PKR",
    PLN = "PLN",
    QAR = "QAR",
    RON = "RON",
    RSD = "RSD",
    RUB = "RUB",
    SAR = "SAR",
    SEK = "SEK",
    SGD = "SGD",
    THB = "THB",
    TND = "TND",
    TRY = "TRY",
    TWD = "TWD",
    USD = "USD",
    USDT = "USDT",
    VES = "VES",
    VND = "VND",
    ZAR = "ZAR"
}
export declare enum dayofweek {
    sunday = 1,
    monday = 2,
    tuesday = 3,
    wednesday = 4,
    thursday = 5,
    friday = 6,
    saturday = 7
}
export declare enum display {
    all = "all",
    data_window = "data_window",
    none = "none",
    pane = "pane",
    price_scale = "price_scale",
    status_line = "status_line"
}
/** `a + b` on display values — the union of both surface sets. */
export declare function displayUnion(a: unknown, b: unknown): string;
/** `a - b` on display values — the surfaces of `a` without those of `b`. */
export declare function displayMinus(a: unknown, b: unknown): string;
export declare enum shape {
    flag = "shape_flag",
    arrowdown = "shape_arrow_down",
    arrowup = "shape_arrow_up",
    circle = "shape_circle",
    cross = "shape_cross",
    diamond = "shape_diamond",
    labeldown = "shape_label_down",
    labelup = "shape_label_up",
    square = "shape_square",
    triangledown = "shape_triangle_down",
    triangleup = "shape_triangle_up",
    xcross = "shape_xcross"
}
export declare enum location {
    abovebar = "AboveBar",
    belowbar = "BelowBar",
    absolute = "Absolute",
    bottom = "Bottom",
    top = "Top"
}
export declare enum size {
    auto = "auto",
    tiny = "tiny",
    small = "small",
    normal = "normal",
    large = "large",
    huge = "huge"
}
export declare enum format {
    inherit = "inherit",
    mintick = "mintick",
    percent = "percent",
    price = "price",
    volume = "volume"
}
export declare enum plot {
    linestyle_dashed = "linestyle_dashed",
    linestyle_dotted = "linestyle_dotted",
    linestyle_solid = "linestyle_solid",
    style_area = "style_area",
    style_areabr = "style_areabr",
    style_circles = "style_circles",
    style_columns = "style_columns",
    style_cross = "style_cross",
    style_histogram = "style_histogram",
    style_line = "style_line",
    style_linebr = "style_linebr",
    style_stepline = "style_stepline",
    style_stepline_diamond = "style_stepline_diamond",
    style_steplinebr = "style_steplinebr"
}
export declare enum barmerge {
    gaps_on = "gaps_on",
    gaps_off = "gaps_off",
    lookahead_on = "lookahead_on",
    lookahead_off = "lookahead_off"
}
export declare enum xloc {
    bar_index = "bi",
    bar_time = "bt"
}
export declare enum yloc {
    price = "pr",
    abovebar = "ab",
    belowbar = "bl"
}
export declare enum extend {
    left = "l",
    right = "r",
    both = "b",
    none = "n"
}
export declare enum text {
    align_bottom = "bottom",
    align_top = "top",
    align_left = "left",
    align_center = "center",
    align_right = "right",
    wrap_auto = "auto",
    wrap_none = "none",
    format_bold = "bold",
    format_italic = "italic",
    format_none = "none"
}
export declare enum font {
    family_default = "default",
    family_monospace = "monospace"
}
export declare enum adjustment {
    none = "none",
    splits = "splits",
    dividends = "dividends"
}
export declare enum backadjustment {
    inherit = "inherit",
    off = "off",
    on = "on"
}
export declare enum earnings {
    actual = "earnings_actual",
    estimate = "earnings_estimate",
    standardized = "earnings_standardized",
    future_eps = "earnings_future_eps",
    future_period_end_time = "earnings_future_period_end_time",
    future_revenue = "earnings_future_revenue",
    future_time = "earnings_future_time"
}
export declare enum dividends {
    gross = "dividends_gross",
    net = "dividends_net",
    future_amount = "dividends_future_amount",
    future_ex_date = "dividends_future_ex_date",
    future_pay_date = "dividends_future_pay_date"
}
export declare enum splits {
    denominator = "splits_denominator",
    numerator = "splits_numerator"
}
export declare enum position {
    top_left = "top_left",
    top_center = "top_center",
    top_right = "top_right",
    middle_left = "middle_left",
    middle_center = "middle_center",
    middle_right = "middle_right",
    bottom_left = "bottom_left",
    bottom_center = "bottom_center",
    bottom_right = "bottom_right"
}
export declare enum scale {
    left = "left",
    none = "none",
    right = "right"
}
export declare enum settlement_as_close {
    inherit = "inherit",
    off = "off",
    on = "on"
}
declare const types: {
    order: typeof order;
    currency: typeof currency;
    dayofweek: typeof dayofweek;
    display: {
        __union: typeof displayUnion;
        __minus: typeof displayMinus;
        all: display.all;
        data_window: display.data_window;
        none: display.none;
        pane: display.pane;
        price_scale: display.price_scale;
        status_line: display.status_line;
    };
    shape: typeof shape;
    location: typeof location;
    size: typeof size;
    format: typeof format;
    barmerge: typeof barmerge;
    xloc: typeof xloc;
    yloc: typeof yloc;
    extend: typeof extend;
    text: typeof text;
    font: typeof font;
    adjustment: typeof adjustment;
    backadjustment: typeof backadjustment;
    earnings: typeof earnings;
    dividends: typeof dividends;
    splits: typeof splits;
    position: typeof position;
    scale: typeof scale;
    settlement_as_close: typeof settlement_as_close;
};
export default types;
