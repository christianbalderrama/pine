import { ChartPointObject } from '../chart/ChartPointObject';
export declare function resetPolylineIdCounter(): void;
export declare class PolylineObject {
    id: number;
    points: ChartPointObject[];
    curved: boolean;
    closed: boolean;
    xloc: string;
    line_color: any;
    fill_color: any;
    line_style: string;
    line_width: number;
    force_overlay: boolean;
    _deleted: boolean;
    /** Bar index at which this object was created (for streaming rollback) */
    _createdAtBar: number;
    constructor(points: ChartPointObject[], curved?: boolean, closed?: boolean, xloc?: string, line_color?: any, fill_color?: any, line_style?: string, line_width?: number, force_overlay?: boolean);
    delete(): void;
    toPlotData(): any;
}
