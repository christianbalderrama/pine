import { extractPineScriptVersion } from './version';
export { extractPineScriptVersion };
/**
 * `options.libraries` maps import paths (`user/library/version`) to library
 * sources; the libraries the script imports are linked into its code. Imports
 * without a source are listed in `unresolvedImports` and left out of the code.
 */
export declare function pineToJS(sourceCode: string, options?: any): {
    success: boolean;
    version: number;
    error: string;
    code?: undefined;
    ast?: undefined;
    tokens?: undefined;
    inputs?: undefined;
    imports?: undefined;
    unresolvedImports?: undefined;
    stack?: undefined;
} | {
    success: boolean;
    version: number;
    code: string;
    ast: import("./ast").Program;
    tokens: import("./tokens").Token[];
    inputs: import("./inputs/analyzeInputs").InputSite[];
    imports: import("./imports").ImportSpec[];
    unresolvedImports: import("./imports").ImportSpec[];
    error?: undefined;
    stack?: undefined;
} | {
    success: boolean;
    version: number;
    error: any;
    stack: any;
    code?: undefined;
    ast?: undefined;
    tokens?: undefined;
    inputs?: undefined;
    imports?: undefined;
    unresolvedImports?: undefined;
};
