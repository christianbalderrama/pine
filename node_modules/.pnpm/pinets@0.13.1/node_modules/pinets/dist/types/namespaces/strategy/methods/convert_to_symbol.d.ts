/**
 * Inverse of convert_to_account: from account currency → symbol currency.
 *
 * Mirrors convert_to_account's TV-matching behavior: identity passthrough
 * when account and symbol currencies are the same string, NaN when they
 * differ. See convert_to_account.ts for the full rationale.
 */
export declare function convert_to_symbol(context: any): (value: number) => number;
