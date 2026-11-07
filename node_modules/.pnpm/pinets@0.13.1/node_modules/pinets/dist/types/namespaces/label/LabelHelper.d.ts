import { LabelObject } from './LabelObject';
import { ChartPointObject } from '../chart/ChartPointObject';
export declare class LabelHelper {
    private context;
    private _labels;
    constructor(context: any);
    param(source: any, index?: number, name?: string): any;
    private _ensurePlotsEntry;
    syncToPlot(): void;
    /**
     * Resolve a value that may be a Series, a bound function, or a plain scalar.
     * Pine Script variables (inputs, chart properties) can be stored as Series
     * objects or bound methods in the PineTS runtime. This ensures the resolved
     * scalar value is used for label properties.
     */
    private _resolve;
    private _createLabel;
    private _enforceMaxCount;
    new(...args: any[]): LabelObject;
    any(...args: any[]): LabelObject | null;
    set_x(id: LabelObject, x: number): void;
    set_y(id: LabelObject, y: number): void;
    set_xy(id: LabelObject, x: number, y: number): void;
    set_text(id: LabelObject, text: string): void;
    set_color(id: LabelObject, color: string): void;
    set_textcolor(id: LabelObject, textcolor: string): void;
    set_size(id: LabelObject, size: string): void;
    set_style(id: LabelObject, style: string): void;
    set_textalign(id: LabelObject, textalign: string): void;
    set_tooltip(id: LabelObject, tooltip: string): void;
    set_text_font_family(id: LabelObject, family: string): void;
    set_text_formatting(id: LabelObject, formatting: string): void;
    set_xloc(id: LabelObject, x: number, xloc: string): void;
    set_yloc(id: LabelObject, yloc: string): void;
    set_point(id: LabelObject, point: ChartPointObject): void;
    get_x(id: LabelObject): number;
    get_y(id: LabelObject): number;
    get_text(id: LabelObject): string;
    copy(id: LabelObject): LabelObject | undefined;
    delete(id: LabelObject): void;
    get all(): LabelObject[];
    /**
     * Remove all drawing objects created at or after the given bar index.
     * Called during streaming rollback to prevent accumulation.
     */
    rollbackFromBar(barIdx: number): void;
    get style_label_down(): string;
    get style_label_up(): string;
    get style_label_left(): string;
    get style_label_right(): string;
    get style_label_lower_left(): string;
    get style_label_lower_right(): string;
    get style_label_upper_left(): string;
    get style_label_upper_right(): string;
    get style_label_center(): string;
    get style_circle(): string;
    get style_square(): string;
    get style_diamond(): string;
    get style_flag(): string;
    get style_arrowup(): string;
    get style_arrowdown(): string;
    get style_cross(): string;
    get style_xcross(): string;
    get style_triangleup(): string;
    get style_triangledown(): string;
    get style_none(): string;
    get style_text_outline(): string;
}
