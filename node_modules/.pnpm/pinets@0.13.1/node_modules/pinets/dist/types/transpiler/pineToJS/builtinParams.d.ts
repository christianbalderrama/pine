/**
 * Parameter names of the Pine built-in functions, by overload, in positional order (Pine Script
 * v6 reference). The code generator uses them to turn a call's named arguments into positional
 * ones (`ta.sma(source = close, length = 5)` → `ta.sma(close, 5)`), so the call compiles exactly
 * like its positional form.
 *
 * Not listed: functions whose runtime reads the named arguments itself (plots, inputs, strategy
 * orders, drawing constructors and setters, collections, time functions) and variadic functions.
 */
export declare const BUILTIN_PARAMS: Record<string, string[][]>;
