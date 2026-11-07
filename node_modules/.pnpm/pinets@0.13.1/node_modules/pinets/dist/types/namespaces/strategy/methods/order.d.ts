import { Order } from '../types';
/**
 * Place a basic order.
 * Pine reference: https://www.tradingview.com/pine-script-reference/v5/#fun_strategy{dot}order
 */
export declare function order(context: any): (...args: any[]) => Order;
