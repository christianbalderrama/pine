import { LineObject } from '../line/LineObject';
export declare function resetLinefillIdCounter(): void;
export declare class LinefillObject {
    id: number;
    line1: LineObject;
    line2: LineObject;
    color: string;
    _deleted: boolean;
    /** Bar index at which this object was created (for streaming rollback) */
    _createdAtBar: number;
    constructor(line1: LineObject, line2: LineObject, color: string);
    get_line1(): LineObject;
    get_line2(): LineObject;
    set_color(...args: any[]): void;
    delete(): void;
    toPlotData(): any;
}
