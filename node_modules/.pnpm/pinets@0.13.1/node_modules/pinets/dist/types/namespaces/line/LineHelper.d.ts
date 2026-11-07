import { LineObject } from './LineObject';
import { ChartPointObject } from '../chart/ChartPointObject';
export declare class LineHelper {
    private context;
    private _lines;
    linefills: {
        deleteForLine(line: LineObject): void;
    } | null;
    constructor(context: any);
    param(source: any, index?: number, name?: string): any;
    private _ensurePlotsEntry;
    syncToPlot(): void;
    private _resolvePoint;
    /**
     * Resolve a value that may be a Series, a bound function, or a plain scalar.
     * Pine Script variables (inputs, chart properties) can be stored as Series
     * objects or bound methods in the PineTS runtime. This ensures the resolved
     * scalar value is used for line properties.
     */
    private _resolve;
    /**
     * Resolve a color value, PRESERVING na markers so renderers can
     * detect "no color". Pine emits na as null (from `color(na)` —
     * `color.any` returns null) or NaN (from raw `na` literal). Both
     * must survive into the plot data — collapsing them to a default
     * forces the renderer to paint a visible line where the script
     * asked for none. Mirrors Box/Polyline `_resolveColor`.
     */
    private _resolveColor;
    private _createLine;
    private _enforceMaxCount;
    new(...args: any[]): LineObject;
    any(...args: any[]): LineObject | null;
    set_x1(id: LineObject, x: number): void;
    set_y1(id: LineObject, y: number): void;
    set_x2(id: LineObject, x: number): void;
    set_y2(id: LineObject, y: number): void;
    set_xy1(id: LineObject, x: number, y: number): void;
    set_xy2(id: LineObject, x: number, y: number): void;
    set_color(id: LineObject, color: string): void;
    set_width(id: LineObject, width: number): void;
    set_style(id: LineObject, style: string): void;
    set_extend(id: LineObject, extend: string): void;
    set_xloc(id: LineObject, x1: number, x2: number, xloc: string): void;
    set_first_point(id: LineObject, point: ChartPointObject): void;
    set_second_point(id: LineObject, point: ChartPointObject): void;
    get_x1(id: LineObject): number;
    get_y1(id: LineObject): number;
    get_x2(id: LineObject): number;
    get_y2(id: LineObject): number;
    get_price(id: LineObject, x: number): number;
    copy(id: LineObject): LineObject | undefined;
    delete(id: LineObject): void;
    get all(): LineObject[];
    /**
     * Remove all drawing objects created at or after the given bar index.
     * Called during streaming rollback to prevent accumulation.
     */
    rollbackFromBar(barIdx: number): void;
    get style_solid(): string;
    get style_dotted(): string;
    get style_dashed(): string;
    get style_arrow_left(): string;
    get style_arrow_right(): string;
    get style_arrow_both(): string;
}
