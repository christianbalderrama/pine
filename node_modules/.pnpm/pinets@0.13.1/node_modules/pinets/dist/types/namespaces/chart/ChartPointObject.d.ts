export declare class ChartPointObject {
    time: number | undefined;
    index: number | undefined;
    price: number;
    constructor(time: number | undefined, index: number | undefined, price: number);
    copy(): ChartPointObject;
    toString(): string;
}
