import { LineObject } from '../line/LineObject';
import { LinefillObject } from './LinefillObject';
export declare class LinefillHelper {
    private context;
    private _linefills;
    constructor(context: any);
    param(source: any, index?: number, name?: string): any;
    private _ensurePlotsEntry;
    syncToPlot(): void;
    /**
     * Resolve a value that may be a Series, a bound function, or a plain scalar.
     */
    private _resolve;
    /**
     * Resolve a color value, PRESERVING na markers so renderers can
     * detect "no color" instead of being forced to paint a default.
     * Pine emits na either as null (from `color(na)` — `color.any`
     * returns null) or as NaN (from raw `na` literals). The previous
     * implementation collapsed both to '' via `_resolve(color) || ''`,
     * which destroyed the signal and made `linefill.new(line1, line2,
     * color(na))` render as a default-coloured fill instead of being
     * invisible. Mirror Box/Polyline `_resolveColor`.
     */
    private _resolveColor;
    new(line1: LineObject, line2: LineObject, color: any): LinefillObject | null;
    private _enforceMaxCount;
    any(...args: any[]): LinefillObject | null;
    set_color(id: LinefillObject, color: any): void;
    get_line1(id: LinefillObject): LineObject | undefined;
    get_line2(id: LinefillObject): LineObject | undefined;
    delete(id: LinefillObject): void;
    deleteForLine(line: LineObject): void;
    get all(): LinefillObject[];
    /**
     * Remove all drawing objects created at or after the given bar index.
     * Called during streaming rollback to prevent accumulation.
     */
    rollbackFromBar(barIdx: number): void;
}
