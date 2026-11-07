export declare function resetTableIdCounter(): void;
/**
 * Pine truncates fractional "int" values at the point of use: since v6,
 * `int / int` keeps the static type `int` but can carry a fractional value
 * (e.g. `(i / 6) + 1` with a loop counter), and TradingView truncates it
 * toward zero when it is consumed as a table coordinate. NaN (Pine `na`)
 * stays NaN so the bounds checks below reject it as a silent no-op.
 */
export declare function truncCoord(v: number): number;
export interface TableCell {
    text: string;
    width: number;
    height: number;
    text_color: string;
    text_halign: string;
    text_valign: string;
    text_size: string | number;
    bgcolor: string;
    tooltip: string;
    text_font_family: string;
    text_formatting: string;
    _merged: boolean;
    _merge_parent: [number, number] | null;
}
export interface MergeRegion {
    startCol: number;
    startRow: number;
    endCol: number;
    endRow: number;
}
export declare class TableObject {
    id: number;
    position: string;
    columns: number;
    rows: number;
    bgcolor: string;
    frame_color: string;
    frame_width: number;
    border_color: string;
    border_width: number;
    force_overlay: boolean;
    _deleted: boolean;
    cells: (TableCell | null)[][];
    merges: MergeRegion[];
    private _helper;
    constructor(position?: string, columns?: number, rows?: number, bgcolor?: string, frame_color?: string, frame_width?: number, border_color?: string, border_width?: number, force_overlay?: boolean);
    delete(): void;
    toPlotData(): any;
    setCell(column: number, row: number, props: Partial<TableCell>): void;
    /** Marks a cell as part of the merge region whose origin is (originCol, originRow). */
    markMerged(column: number, row: number, originCol: number, originRow: number): void;
    getCell(column: number, row: number): TableCell | null;
    clearCell(column: number, row: number): void;
    _setHelper(helper: any): void;
    cell(...args: any[]): any;
    clear(...args: any[]): any;
    merge_cells(...args: any[]): any;
    cell_set_text(...args: any[]): any;
    cell_set_bgcolor(...args: any[]): any;
    cell_set_text_color(...args: any[]): any;
    cell_set_text_size(...args: any[]): any;
    cell_set_height(...args: any[]): any;
    cell_set_width(...args: any[]): any;
    cell_set_tooltip(...args: any[]): any;
    cell_set_text_halign(...args: any[]): any;
    cell_set_text_valign(...args: any[]): any;
    cell_set_text_font_family(...args: any[]): any;
    cell_set_text_formatting(...args: any[]): any;
    set_position(...args: any[]): any;
    set_bgcolor(...args: any[]): any;
    set_border_color(...args: any[]): any;
    set_border_width(...args: any[]): any;
    set_frame_color(...args: any[]): any;
    set_frame_width(...args: any[]): any;
    private _defaultCell;
}
