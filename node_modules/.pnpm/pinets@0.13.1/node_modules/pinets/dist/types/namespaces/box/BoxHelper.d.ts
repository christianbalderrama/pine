import { BoxObject } from './BoxObject';
import { ChartPointObject } from '../chart/ChartPointObject';
export declare class BoxHelper {
    private context;
    private _boxes;
    constructor(context: any);
    param(source: any, index?: number, name?: string): any;
    private _ensurePlotsEntry;
    syncToPlot(): void;
    private _resolvePoint;
    private _resolve;
    /**
     * Resolve a color value, preserving na markers so renderers can detect "no color".
     * Pine emits na either as NaN (from `bgcolor = na`) or as null (from
     * `bgcolor = color(na)` — `color(na)` returns null per PineColor.any). Both
     * must survive — replacing them with a default would force renderers to paint
     * a visible color where the script asked for none.
     */
    private _resolveColor;
    private _createBox;
    /**
     * Enforce max_boxes_count: auto-delete the oldest non-deleted boxes
     * when the active count exceeds the limit (FIFO eviction).
     */
    private _enforceMaxCount;
    new(...args: any[]): BoxObject;
    any(...args: any[]): BoxObject | null;
    set_left(id: BoxObject, left: number): void;
    set_right(id: BoxObject, right: number): void;
    set_top(id: BoxObject, top: number): void;
    set_bottom(id: BoxObject, bottom: number): void;
    set_lefttop(id: BoxObject, left: number, top: number): void;
    set_rightbottom(id: BoxObject, right: number, bottom: number): void;
    set_top_left_point(id: BoxObject, point: ChartPointObject): void;
    set_bottom_right_point(id: BoxObject, point: ChartPointObject): void;
    set_xloc(id: BoxObject, left: number, right: number, xloc: string): void;
    set_bgcolor(id: BoxObject, color: string): void;
    set_border_color(id: BoxObject, color: string): void;
    set_border_width(id: BoxObject, width: number): void;
    set_border_style(id: BoxObject, style: string): void;
    set_extend(id: BoxObject, extend: string): void;
    set_text(id: BoxObject, text: string): void;
    set_text_color(id: BoxObject, color: string): void;
    set_text_size(id: BoxObject, size: string): void;
    set_text_halign(id: BoxObject, align: string): void;
    set_text_valign(id: BoxObject, align: string): void;
    set_text_wrap(id: BoxObject, wrap: string): void;
    set_text_font_family(id: BoxObject, family: string): void;
    set_text_formatting(id: BoxObject, formatting: string): void;
    get_left(id: BoxObject): number;
    get_right(id: BoxObject): number;
    get_top(id: BoxObject): number;
    get_bottom(id: BoxObject): number;
    copy(id: BoxObject): BoxObject | undefined;
    delete(id: BoxObject): void;
    get all(): BoxObject[];
    /**
     * Remove all drawing objects created at or after the given bar index,
     * and un-delete objects that were deleted during rolled-back bars.
     * Called during streaming rollback to prevent accumulation.
     */
    rollbackFromBar(barIdx: number): void;
}
