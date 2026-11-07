import { ChartPointObject } from './ChartPointObject';
export declare class ChartHelper {
    private context;
    point: {
        new: (time?: number, index?: number, price?: number) => ChartPointObject;
        from_index: (index: number, price: number) => ChartPointObject;
        from_time: (time: number, price: number) => ChartPointObject;
        copy: (point: ChartPointObject) => ChartPointObject;
        now: (price: number) => ChartPointObject;
    };
    constructor(context: any);
    param(source: any, index?: number, name?: string): any;
    bg_color(): string;
    fg_color(): string;
    is_standard(): boolean;
    is_heikinashi(): boolean;
    is_kagi(): boolean;
    is_linebreak(): boolean;
    is_pnf(): boolean;
    is_range(): boolean;
    is_renko(): boolean;
}
