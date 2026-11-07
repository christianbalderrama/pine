export declare class Series {
    data: any[];
    offset: number;
    /** Value of a read before the first bar: na, or `false` for a Pine v6 bool series (v6 bools are never na). */
    beforeStart: any;
    /** Storage of a `varip` variable: re-executions of a bar do not roll its value back. */
    varip?: boolean;
    constructor(data: any[], offset?: number);
    get(index: number): any;
    set(index: number, value: any): void;
    get length(): number;
    toArray(): any[];
    static from(source: any): Series;
}
