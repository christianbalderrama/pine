/** Elements as `str.tostring` prints them: `[1.5, 2]`, `[0.3333333333, 100000000]`. */
export declare function tostringElements(arr: {
    array: any[];
    type: string;
}): string[];
/**
 * Elements as `array.join` and a `str.format` placeholder print them: float arrays use Java's
 * Double.toString (`5.0`, `1.0E8`, `1.0E-7`), int arrays plain integers.
 */
export declare function joinElements(arr: {
    array: any[];
    type: string;
}): string[];
