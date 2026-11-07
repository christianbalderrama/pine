import { PolylineObject } from './PolylineObject';
export declare class PolylineHelper {
    private context;
    private _polylines;
    constructor(context: any);
    param(source: any, index?: number, name?: string): any;
    private _ensurePlotsEntry;
    syncToPlot(): void;
    /**
     * Resolve a value that may be a Series, a bound function, or a plain scalar.
     */
    private _resolve;
    /**
     * Resolve a color value, preserving na markers (NaN from `na`, null from
     * `color(na)`) so renderers can detect "no color" instead of forcing a
     * default via the `||` operator.
     */
    private _resolveColor;
    /**
     * Extract raw ChartPointObject array from a PineArrayObject, Series, or plain array.
     */
    private _extractPoints;
    new(...args: any[]): PolylineObject;
    private _enforceMaxCount;
    any(...args: any[]): PolylineObject | null;
    delete(id: PolylineObject): void;
    get all(): PolylineObject[];
    /**
     * Remove all drawing objects created at or after the given bar index.
     * Called during streaming rollback to prevent accumulation.
     */
    rollbackFromBar(barIdx: number): void;
}
