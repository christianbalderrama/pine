import { TableObject } from './TableObject';
export declare class TableHelper {
    private context;
    private _tables;
    constructor(context: any);
    param(source: any, index?: number, name?: string): any;
    private _ensurePlotsEntry;
    syncToPlot(): void;
    private _resolve;
    new(...args: any[]): TableObject;
    private _takePosition;
    any(...args: any[]): TableObject | null;
    cell(...args: any[]): void;
    delete(id: TableObject): void;
    clear(...args: any[]): void;
    merge_cells(...args: any[]): void;
    cell_set_text(table_id: any, column: any, row: any, text: any): void;
    cell_set_bgcolor(table_id: any, column: any, row: any, bgcolor: any): void;
    cell_set_text_color(table_id: any, column: any, row: any, text_color: any): void;
    cell_set_text_size(table_id: any, column: any, row: any, text_size: any): void;
    cell_set_height(table_id: any, column: any, row: any, height: any): void;
    cell_set_width(table_id: any, column: any, row: any, width: any): void;
    cell_set_tooltip(table_id: any, column: any, row: any, tooltip: any): void;
    cell_set_text_halign(table_id: any, column: any, row: any, text_halign: any): void;
    cell_set_text_valign(table_id: any, column: any, row: any, text_valign: any): void;
    cell_set_text_font_family(table_id: any, column: any, row: any, text_font_family: any): void;
    cell_set_text_formatting(table_id: any, column: any, row: any, text_formatting: any): void;
    set_position(table_id: any, position: any): void;
    set_bgcolor(table_id: any, bgcolor: any): void;
    set_border_color(table_id: any, border_color: any): void;
    set_border_width(table_id: any, border_width: any): void;
    set_frame_color(table_id: any, frame_color: any): void;
    set_frame_width(table_id: any, frame_width: any): void;
    get all(): TableObject[];
    /**
     * Remove all tables created at or after the given bar index.
     * Called during streaming rollback.
     */
    rollbackFromBar(barIdx: number): void;
    private _setCellProp;
    private _resolveText;
}
