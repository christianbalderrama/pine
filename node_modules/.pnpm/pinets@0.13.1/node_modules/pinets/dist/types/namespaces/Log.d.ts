import { Context } from '..';
export declare class Log {
    private context;
    constructor(context: Context);
    private logFormat;
    param(source: any, index?: number, name?: string): any;
    private _formatTimestamp;
    warning(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
}
