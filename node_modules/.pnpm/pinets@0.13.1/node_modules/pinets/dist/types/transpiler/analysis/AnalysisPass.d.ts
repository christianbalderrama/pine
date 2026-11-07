import ScopeManager from './ScopeManager';
export declare function transformNestedArrowFunctions(ast: any): void;
/**
 * Rename function parameters that share a user function's name (`g(double) => double(double)`).
 * In Pine a call always resolves to the function, but in the emitted JS the parameter would
 * shadow it. Every reference in the function is renamed except call callees; the matching
 * `fn.__pineParamTypes__` keys follow.
 */
export declare function renameParamsShadowingFunctions(ast: any): void;
/**
 * Pre-walk the AST to populate the UDT registry on the ScopeManager.
 *
 * Two registries are populated:
 *   1. UDT type names — collected from `const X = Type({field: ['type', default], ...})`
 *      which pine2js emits from Pine `type X` declarations. The field-type metadata
 *      is stored alongside (V2 data model) for future use-site type-aware rewrites.
 *
 *   2. UDT instance variables — variables initialized via `<X>.new(...)` or
 *      `<X>.copy(...)` where X ∈ udtTypeNames. Each instance is tagged with its
 *      UDT type name (V2 shape).
 *
 * The instance check intentionally consults `isUdtTypeName(X)` rather than just
 * "X is an Identifier", so built-in factory calls like `array.from(...)`,
 * `polyline.new(...)`, `chart.point.from_index(...)` are excluded — those are
 * handled by their own runtime layers and must NOT be treated as UDT instances.
 */
export declare function preProcessUdtRegistry(ast: any, scopeManager: ScopeManager): void;
export declare function preProcessContextBoundVars(ast: any, scopeManager: ScopeManager): void;
export declare function transformArrowFunctionParams(node: any, scopeManager: ScopeManager, isRootFunction?: boolean): void;
export declare function runAnalysisPass(ast: any, scopeManager: ScopeManager): string | undefined;
